#!/usr/bin/env python3
"""
Fix script for Stage 1, 2, 3 outreach workflows.
Issues addressed:
  Stage 1: corrupted field expressions, sheet sync, Perplexity prompt
  Stage 2: sheet sync, Filter1 blocking all leads, Stage 2 output wiring
  Stage 3: sheet sync, ghost FOMO path removal, <br> tag fix in Email Generator
"""

import json, copy, re, sys, subprocess, os

# ── Config ────────────────────────────────────────────────────────────────────
N8N_URL     = "https://n8n.chronexa.io/api/v1"
N8N_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NWJkNjNhYy04YTgwLTQwOTItYTlhNC0wZGFhMjNlNDAyNWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI0NTM3Y2UtNmIwNy00YjFmLWI2ZTctOGQ4Mjg4YjJlY2QyIiwiaWF0IjoxNzc4MjI5MTE2fQ.lAq1dPQieI1-2UG-3dd-_xeYP50IvMkjwzTkG-OOybg"

NEW_SHEET_ID  = "1sKbjAUWyVHSnD8Qh6HhMa71uB45jRvJbshiJoplUQwM"
NEW_SHEET_GID = 0

STAGE1_ID = "9nrl0oAMvnBAiU6U"
STAGE2_ID = "1OBENjsV21NziZNv"
STAGE3_ID = "MkZTtPEXjHq1VzN5"

TOOL_DIR  = "/Users/ankitdhiman/.claude/projects/-Users-ankitdhiman-Work-N8N-Chronexa/1a37d7dd-5dcb-493d-89b0-cc22d0b7d3ff/tool-results"
STAGE1_FILE = f"{TOOL_DIR}/btx2e8jdl.txt"
STAGE2_FILE = f"{TOOL_DIR}/bkmr08sng.txt"
STAGE3_FILE = f"{TOOL_DIR}/bi1ivvmh4.txt"

# ── Helpers ───────────────────────────────────────────────────────────────────
def load(path):
    with open(path) as f:
        return json.load(f)

def put_workflow(wf_id, payload):
    body = json.dumps(payload)
    result = subprocess.run([
        "curl", "-s", "-X", "PUT",
        f"{N8N_URL}/workflows/{wf_id}",
        "-H", f"X-N8N-API-KEY: {N8N_KEY}",
        "-H", "Content-Type: application/json",
        "-d", body
    ], capture_output=True, text=True)
    try:
        resp = json.loads(result.stdout)
        if "id" in resp:
            print(f"  ✅ Deployed {wf_id} — '{resp.get('name')}'")
        else:
            print(f"  ❌ Error deploying {wf_id}: {result.stdout[:400]}")
        return resp
    except Exception as e:
        print(f"  ❌ Could not parse response for {wf_id}: {result.stdout[:400]}")
        return None

ALLOWED_SETTINGS = {"executionOrder", "saveManualExecutions", "callerPolicy", "errorWorkflow", "timezone"}

def build_payload(wf):
    raw = wf.get("settings", {})
    settings = {k: v for k, v in raw.items() if k in ALLOWED_SETTINGS}
    return {
        "name":        wf["name"],
        "nodes":       wf["nodes"],
        "connections": wf["connections"],
        "settings":    settings
    }

def swap_sheet_node(params):
    """Point any Google Sheets node at the new test sheet, keeping GID 0."""
    if "documentId" in params:
        params["documentId"] = {
            "__rl": True,
            "value": NEW_SHEET_ID,
            "mode": "id",
            "cachedResultName": "Test Leads",
            "cachedResultUrl": f"https://docs.google.com/spreadsheets/d/{NEW_SHEET_ID}/edit?usp=drivesdk"
        }
    if "sheetName" in params:
        params["sheetName"] = {
            "__rl": True,
            "value": NEW_SHEET_GID,
            "mode": "list",
            "cachedResultName": "Sheet1",
            "cachedResultUrl": f"https://docs.google.com/spreadsheets/d/{NEW_SHEET_ID}/edit#gid={NEW_SHEET_GID}"
        }
    return params


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 1 FIXES
# ══════════════════════════════════════════════════════════════════════════════
def fix_stage1(wf):
    print("\n── Stage 1 fixes ──")
    for node in wf["nodes"]:
        if not isinstance(node, dict):
            continue
        t = node.get("type", "")
        n = node.get("name", "")
        p = node.get("parameters", {})

        # 1. Swap every Google Sheets node to new test sheet
        if t == "n8n-nodes-base.googleSheets":
            node["parameters"] = swap_sheet_node(p)
            print(f"  📋 Swapped sheet → '{n}'")

            # 2. Fix corrupted field expressions in Update row in sheet3
            if n == "Update row in sheet3":
                cols = node["parameters"].get("columns", {}).get("value", {})

                # Fix Tech Stack section inside Company Summary
                if "Company Summary" in cols:
                    old = cols["Company Summary"]
                    fixed = old.replace(
                        "Tech Stack:\n{{ $json.output.Products_Services }}",
                        "Tech Stack:\n{{ $json.output.Tech_Stack }}"
                    )
                    cols["Company Summary"] = fixed
                    changed = old != fixed
                    print(f"  {'✅' if changed else '⚠️  (already ok)'} Company Summary Tech_Stack expression")

                # Fix Strategic Intel — fully replace (both sections were wrong)
                if "Strategic Intel" in cols:
                    cols["Strategic Intel"] = (
                        "=Workflow Signals:\n{{ $json.output.Workflow_Signals }}\n"
                        "-------------------------------------\n\n"
                        "Recent Trigger:\n{{ $json.output.Recent_Trigger }}"
                    )
                    print("  ✅ Strategic Intel expressions (Workflow_Signals + Recent_Trigger)")

        # 3. Fix Perplexity prompt — remove hard LinkedIn cap, soften identity gate
        if t == "n8n-nodes-base.perplexity" and n == "Message a model3":
            msgs = p.get("messages", {}).get("message", [])
            for msg in msgs:
                content = msg.get("content", "")
                if "TASK 7" in content or "Cap at 35" in content:
                    # Remove the cap
                    content = content.replace(
                        "Cap at 35 if workflow_signals = NOT FOUND.",
                        "If workflow_signals = NOT FOUND, score reflects only available signals — no hard cap."
                    )
                    # Soften the Research_Status threshold
                    content = content.replace(
                        '"Strong": verified = true AND summary found AND workflow_signals found AND contact philosophy found',
                        '"Strong": verified = true AND summary found AND at least 2 of (workflow_signals, tech_stack, contact_philosophy) found'
                    )
                    msg["content"] = content
                    print("  ✅ Perplexity: removed LinkedIn confidence cap")

                if "Do not run Tasks 2" in content:
                    content = content.replace(
                        "Do not run Tasks 2–6 if verified = false.",
                        "If verified = false, set research_status = \"Failed\" but still run Tasks 2–4 using company name and domain."
                    )
                    msg["content"] = content
                    print("  ✅ Perplexity: softened identity verification hard gate")

    return wf


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 2 FIXES
# ══════════════════════════════════════════════════════════════════════════════
def fix_stage2(wf):
    print("\n── Stage 2 fixes ──")
    for node in wf["nodes"]:
        if not isinstance(node, dict):
            continue
        t = node.get("type", "")
        n = node.get("name", "")
        p = node.get("parameters", {})

        # 1. Swap every Google Sheets node to new test sheet
        if t == "n8n-nodes-base.googleSheets":
            node["parameters"] = swap_sheet_node(p)
            print(f"  📋 Swapped sheet → '{n}'")

        # 2. Fix Filter1 — it blocks all leads because it checks for "NOT FOUND"
        #    text in fields that are actually empty strings on new leads.
        #    Clear the conditions so it passes every item through.
        if t == "n8n-nodes-base.filter" and n == "Filter1":
            node["parameters"]["conditions"]["conditions"] = []
            node["parameters"]["conditions"]["combinator"] = "and"
            print("  ✅ Filter1: cleared blocking conditions (passes all leads)")

        # 3. Fix Stage 2 scoring in GPT prompt — reduce harsh deductions for
        #    commonly-missing LinkedIn data so more leads reach the email stage.
        if t == "@n8n/n8n-nodes-langchain.openAi" and n == "Message a model1":
            responses = p.get("responses", {}).get("values", [])
            for resp in responses:
                content = resp.get("content", "")
                if "−20 no gap found" in content or "-20 no gap found" in content:
                    # Soften the deductions
                    content = content.replace("−15 budget_authority NOT FOUND", "−5 budget_authority NOT FOUND")
                    content = content.replace("−10 Research_Status Weak",       "−5 Research_Status Weak")
                    # Remove the -20 no gap penalty (too harsh when research is weak)
                    content = content.replace("−20 no gap found",               "−10 no gap found")
                    resp["content"] = content
                    print("  ✅ Stage 2 scoring: reduced LinkedIn-data deductions")

    return wf


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 3 FIXES
# ══════════════════════════════════════════════════════════════════════════════

# Ghost nodes that form the old FOMO email path (Loop Items10 track)
GHOST_NODES = {
    "Loop Over Items10",
    "Get row(s) in sheet14",
    "Wait17",
    "Filter8",
    "Persona Alignment",
    "Create customer information profile1",
    "Code in JavaScript1",
    "Update row in sheet5",
    "Message a Model",
}

def fix_stage3(wf):
    print("\n── Stage 3 fixes ──")

    # 1. Remove ghost FOMO path nodes
    before = len(wf["nodes"])
    wf["nodes"] = [n for n in wf["nodes"] if isinstance(n, dict) and n.get("name") not in GHOST_NODES]
    removed = before - len(wf["nodes"])
    print(f"  ✅ Removed {removed} ghost FOMO path nodes")

    # 2. Remove ghost node connections (source entries)
    for ghost in GHOST_NODES:
        if ghost in wf["connections"]:
            del wf["connections"][ghost]

    # 3. Remove any destination references to ghost nodes in remaining connections
    clean_connections = {}
    for src_name, src_data in wf["connections"].items():
        clean_main = []
        for branch in src_data.get("main", []):
            clean_branch = [
                edge for edge in branch
                if isinstance(edge, dict) and edge.get("node") not in GHOST_NODES
            ]
            clean_main.append(clean_branch)
        clean_connections[src_name] = {"main": clean_main}
    wf["connections"] = clean_connections
    print("  ✅ Cleaned ghost node references from connections")

    # 4. Swap sheets + fix Email Generator HTML tags
    for node in wf["nodes"]:
        if not isinstance(node, dict):
            continue
        t = node.get("type", "")
        n = node.get("name", "")
        p = node.get("parameters", {})

        if t == "n8n-nodes-base.googleSheets":
            node["parameters"] = swap_sheet_node(p)
            print(f"  📋 Swapped sheet → '{n}'")

        # Fix <br> HTML tags in Email Generator user prompt
        if n == "Email Generator" and t == "@n8n/n8n-nodes-langchain.openAi":
            responses = p.get("responses", {}).get("values", [])
            for resp in responses:
                if "content" in resp:
                    old = resp["content"]
                    fixed = old.replace("<br><br>", "\n\n").replace("<br>", "\n")
                    resp["content"] = fixed
                    if old != fixed:
                        print("  ✅ Email Generator: replaced <br> tags with newlines")

    return wf


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Loading workflows from saved files...")
    s1 = load(STAGE1_FILE)
    s2 = load(STAGE2_FILE)
    s3 = load(STAGE3_FILE)

    s1 = fix_stage1(s1)
    s2 = fix_stage2(s2)
    s3 = fix_stage3(s3)

    print("\nDeploying to n8n...")
    put_workflow(STAGE1_ID, build_payload(s1))
    put_workflow(STAGE2_ID, build_payload(s2))
    put_workflow(STAGE3_ID, build_payload(s3))

    print("\nDone.")
