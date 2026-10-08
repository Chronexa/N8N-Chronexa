---
title: n8n Pricing in 2026: Cloud Plans vs Self-Hosting Cost
metaTitle: n8n Pricing 2026: Cloud Plans vs Self-Hosting Cost
metaDescription: n8n pricing explained: Starter, Pro, Business and Enterprise plans, what an execution is, what self-hosting really costs, and which option fits you.
excerpt: n8n's plans checked on 8 October 2026, what counts as an execution, the real cost of self-hosting, and how to choose between Cloud, self-hosting and a managed setup.
takeaways:
- n8n charges per workflow execution, not per step. One run of a ten-step workflow is one execution.
- On n8n Cloud, Starter is 20 EUR a month for 2,500 executions and Pro is 50 EUR a month for 10,000 (prices listed on 8 October 2026, annual billing).
- The Community Edition is free to self-host, but you pay for the server, the database, backups and the time to keep it running and secure.
- The Business plan (667 EUR a month, 40,000 executions) is self-hosted only and adds SSO, environments, Git version control and queue mode.
- Self-hosting is worth it when data must stay in your environment or when volume is high. For light use, Cloud is simpler and cheaper once you count your time.
---
n8n pricing is easier to understand than most automation tools once you know what it counts. n8n charges for **workflow executions**, meaning how many times a workflow runs, not how many steps it contains. You can also run n8n yourself for free. The catch is that "free" covers the software, not the server, the maintenance or the risk.

This guide covers the current plans, what an execution is, what self-hosting actually costs, and how to choose. The plan details below were read from n8n's pricing page on 8 October 2026. Plans and prices change, so confirm on the n8n site before you decide.

## n8n Cloud plans and prices

| Plan | Price (annual billing) | Executions a month | Notes |
|---|---|---|---|
| Starter (Cloud) | 20 EUR a month | 2,500 | Hosted by n8n, one shared project |
| Pro (Cloud) | 50 EUR a month | 10,000 | Three shared projects, admin roles, longer workflow history |
| Business (self-hosted) | 667 EUR a month | 40,000 | SSO and LDAP, multiple environments, queue mode, Git version control |
| Enterprise | Contact n8n | Custom | Unlimited projects, extended retention, dedicated support |
| Community Edition (self-hosted) | Free | No cap from n8n | Standard version from GitHub |

All plans include unlimited users and unlimited workflows, according to the pricing page, and every integration. Pricing depends only on how many executions you use.

## What counts as an execution

An execution is one run of a workflow from trigger to finish. A workflow with two steps and one with forty steps both use a single execution per run. That is the main reason n8n tends to cost less than tools that charge per step once workflows get long. A loop inside a workflow still counts as part of the same execution, which makes AI agent workflows, where the model may call several tools in one run, cheaper to run than on per-task pricing.

If you run a workflow 3,000 times a month, you would need more than the Starter allowance, so Pro is the natural step up.

## What self-hosting n8n really costs

The software is free. Everything around it is not.

- **A server.** n8n runs in a container on a virtual machine or Kubernetes cluster. Light use fits on a small server. Production use with many workflows needs more memory and a queue-mode setup with workers.
- **A database.** n8n stores workflows, credentials and execution history in a database. Production setups use PostgreSQL rather than the default SQLite file, and that usually means a managed database service.
- **Backups and monitoring.** If the database is lost, so are your workflows and credentials. You need automated backups, and alerts for when a workflow fails.
- **Updates and security.** n8n ships updates often. Someone has to apply them, keep the host patched, restrict access and protect the credentials stored in the instance.
- **People's time.** Whoever does this is not doing something else. For many small teams, this is the real cost.

A rough rule: if n8n Cloud at Starter or Pro covers your volume and you do not have strict data rules, Cloud is almost always cheaper once you count your own time. Self-hosting pays off in two cases.

### When self-hosting is worth it

1. **Your data must stay in your environment.** Regulated work, client confidentiality and data residency rules can make a third-party cloud a non-starter. Running n8n inside your own cloud account or network keeps records and execution logs in your perimeter.
2. **Your volume is high.** Past tens of thousands of executions a month, fixed infrastructure costs can be lower than cloud tiers. Check the Business plan price against your own infrastructure and staff costs before you assume it is cheaper.

Some features, including SSO, multiple environments and Git-based version control, sit in the paid Business and Enterprise plans rather than the free Community Edition. If you need them, price those plans into your comparison.

## Keeping sensitive data safe in a self-hosted setup

If workflows send data to external AI models, a sensible pattern is to strip personal identifiers before the data leaves your environment. A local step detects names, account numbers and similar fields, replaces them with tokens, sends the cleaned text to the model, and puts the real values back afterwards from a table that never left your servers. This keeps the model useful without handing it identities. It is one layer of protection, not a compliance guarantee on its own, so pair it with access controls, logging and a review of what each model provider does with your data.

## Cloud, self-hosted or managed: how to choose

| Situation | Best fit |
|---|---|
| Small team, light volume, no strict data rules | n8n Cloud (Starter or Pro) |
| Regulated data or data residency requirements | Self-hosted in your own cloud account |
| High volume and you have DevOps capacity | Self-hosted, queue mode |
| You want self-hosting without running it | A managed setup run by an implementation partner |

The fourth option is where we come in. We deploy and run n8n in a client's own environment, build the workflows on it, and keep it patched and monitored, so the control of self-hosting comes without the on-call burden. See [our AI automation services](/ai-automation-agency), or compare n8n with other tools in our guide to [n8n vs Zapier vs Make](/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams).

## Frequently Asked Questions

### How much does n8n cost?

On n8n Cloud, Starter is 20 EUR a month for 2,500 executions and Pro is 50 EUR a month for 10,000 (annual billing, as listed on 8 October 2026). The Business plan is 667 EUR a month and self-hosted only. Enterprise is custom. The Community Edition is free to self-host.

### Is n8n free?

The Community Edition is free to download and run on your own server. You still pay for hosting, a database, backups and maintenance. n8n Cloud and the Business plan are paid.

### What is an n8n execution?

One full run of a workflow, from the trigger to the last step. The number of steps in the workflow does not change the count.

### Is self-hosting n8n cheaper than n8n Cloud?

Not always. Cloud is usually cheaper for light use once you count your own time. Self-hosting becomes attractive for high volume or when data must stay inside your environment.

### Can I use n8n for commercial work for free?

The Community Edition uses n8n's fair-code licence, which allows internal business use but restricts offering n8n itself as a paid service to others. Read the licence terms for your specific use, or ask n8n directly.

### Do I need a developer to self-host n8n?

You need someone comfortable with servers, containers, databases and security. If you do not have that person, a managed setup or n8n Cloud is the safer choice.

### Should I hire someone to set up n8n?

If the workflows touch client data or run important processes, yes. A good setup includes backups, monitoring, error handling and a clear owner. [Book a free AI audit](/ai-automation-agency) and we will tell you whether Cloud, self-hosted or managed fits.
