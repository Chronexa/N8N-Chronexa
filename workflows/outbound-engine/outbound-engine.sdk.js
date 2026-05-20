import { workflow, node, trigger, ifElse, switchCase, newCredential, expr, sticky } from '@n8n/workflow-sdk';

const PERPLEXITY_SYSTEM =
  'You are an enterprise sales intelligence extractor for Chronexa.io. ' +
  'Return a single valid JSON object matching the schema below. ' +
  'No prose, no markdown, no commentary, no code fences.\\n\\n' +
  'SCHEMA (all four keys required):\\n' +
  '{\\n' +
  '  \\"SUMMARY\\": \\"<1-2 sentences strictly defining their core business operation>\\",\\n' +
  '  \\"REGULATED_INDUSTRY\\": \\"<YES if Legal, Finance, Banking, Healthcare, or Public Sector. Otherwise NO>\\",\\n' +
  '  \\"RECENT_TRIGGER\\": \\"<1 event from the last 90 days: a merger, high-volume hiring for operations/admin, or a new tech initiative. NOT FOUND if none>\\",\\n' +
  '  \\"TECH_STACK_HINTS\\": \\"<Mentions of ERPs, CRMs, or legacy systems. NOT FOUND if none>\\"\\n' +
  '}\\n\\n' +
  'RULES:\\n' +
  '- Output a single JSON object only. No preamble.\\n' +
  '- Use NOT FOUND when data is unavailable.\\n' +
  '- REGULATED_INDUSTRY must be exactly YES or NO.\\n' +
  '- SUMMARY describes operations, not marketing positioning.\\n' +
  '- RECENT_TRIGGER must be from the last 90 days only.';

const ANTHROPIC_ROUTING_SYSTEM =
  'You are Chronexa\\\'s enterprise routing algorithm. We build custom AI workflows. Match the target company to ONE of our buckets based on their data. \\n' +
  'BUCKET 1: Legal/Compliance (Offline Azure deployments for Tier-1 Law Firms). \\n' +
  'BUCKET 2: Fintech/Wealth (Fintech product development, wealth management automation, and reserve studies). \\n' +
  'BUCKET 3: Industrial/AgTech (IoT sensor data reporting). \\n' +
  'BUCKET 4: General Ops (OCR & back-office automation).\\n\\n' +
  'Output strictly valid JSON matching this schema: {\\"matched_case_study\\": \\"<Bucket Name>\\", \\"relevance_reason\\": \\"<1 sentence rationale>\\", \\"requires_secure_infrastructure\\": <boolean, true if highly regulated>, \\"should_skip\\": <boolean, true if no fit>}. No preamble.';

const ANTHROPIC_EMAIL_SYSTEM =
  'You are a RevOps growth engineer writing a cold plain-text email. \\n' +
  'Rules:\\n' +
  '1. NO subject lines, NO greetings (Hi X,), NO sign-offs. Only write the body.\\n' +
  '2. Max 3 sentences.\\n' +
  '3. Sentence 1: A casual observation based on the RECENT_TRIGGER.\\n' +
  '4. Sentence 2: The exact Chronexa Pitch.\\n' +
  '5. Sentence 3: A low-friction question asking if they are open to seeing an architecture framework.\\n' +
  '6. NO buzzwords.';

const PERPLEXITY_BODY_EXPR =
  '{{ { ' +
    '"model": "sonar", ' +
    '"temperature": 0.2, ' +
    '"top_p": 0.9, ' +
    '"max_tokens": 800, ' +
    '"return_images": false, ' +
    '"return_related_questions": false, ' +
    '"messages": [' +
      '{"role":"system","content":"' + PERPLEXITY_SYSTEM + '"},' +
      '{"role":"user","content":"Company Name: " + $json.company_name + "\\nDomain: " + $json.company_domain + "\\n\\nExtract the four data points per schema."}' +
    '], ' +
    '"response_format": {"type":"json_schema","json_schema":{"schema":{"type":"object","properties":{"SUMMARY":{"type":"string"},"REGULATED_INDUSTRY":{"type":"string","enum":["YES","NO"]},"RECENT_TRIGGER":{"type":"string"},"TECH_STACK_HINTS":{"type":"string"}},"required":["SUMMARY","REGULATED_INDUSTRY","RECENT_TRIGGER","TECH_STACK_HINTS"],"additionalProperties":false}}}' +
  ' } }}';

const ANTHROPIC_ROUTING_BODY_EXPR =
  '{{ { ' +
    '"model": "claude-3-5-sonnet-20241022", ' +
    '"max_tokens": 500, ' +
    '"temperature": 0.1, ' +
    '"system": "' + ANTHROPIC_ROUTING_SYSTEM + '", ' +
    '"messages": [{"role":"user","content":"Company: " + $json.company_name + "\\nRegulated: " + $json.REGULATED_INDUSTRY + "\\nSummary: " + $json.SUMMARY + "\\nTrigger: " + $json.RECENT_TRIGGER}]' +
  ' } }}';

const ANTHROPIC_EMAIL_BODY_EXPR =
  '{{ { ' +
    '"model": "claude-3-5-sonnet-20241022", ' +
    '"max_tokens": 500, ' +
    '"temperature": 0.7, ' +
    '"system": "' + ANTHROPIC_EMAIL_SYSTEM + '", ' +
    '"messages": [{"role":"user","content":' +
      '"Trigger: " + $json.RECENT_TRIGGER + "\\n" + ' +
      '"Target Company: " + $json.company_name + "\\n" + ' +
      '"Our Pitch: " + ' +
      '($json.matched_case_study.includes("BUCKET 1") ? "We build secure RAG and document intelligence pipelines to automate data extraction." : ' +
       '$json.matched_case_study.includes("BUCKET 2") ? "We build enterprise n8n workflows that connect siloed CRMs, ERPs, and field data." : ' +
       '"We build custom AI products and bespoke software engineering for tech-forward operations.") + ' +
      '"\\n" + ' +
      '"Secure Infra Required: " + $json.requires_secure_infrastructure + " (If true, you MUST mention offline Azure deployments in the pitch sentence)."' +
    '}]' +
  ' } }}';

const PARSE_PERPLEXITY_CODE =
  "const NORMALIZE_NODE = 'Normalize Lead Input';\n" +
  "const httpItem = $input.item.json;\n" +
  "const lead = $(NORMALIZE_NODE).item.json;\n" +
  "const base = {\n" +
  "  company_name: lead.company_name,\n" +
  "  company_domain: lead.company_domain,\n" +
  "  SUMMARY: null,\n" +
  "  REGULATED_INDUSTRY: null,\n" +
  "  RECENT_TRIGGER: null,\n" +
  "  TECH_STACK_HINTS: null,\n" +
  "};\n" +
  "const rawContent = httpItem?.choices?.[0]?.message?.content;\n" +
  "if (typeof rawContent !== 'string' || rawContent.length === 0) {\n" +
  "  return { json: { ...base, error: 'PERPLEXITY_EMPTY_CONTENT', error_detail: 'choices[0].message.content was missing or not a string' } };\n" +
  "}\n" +
  "try {\n" +
  "  const parsed = JSON.parse(rawContent);\n" +
  "  return { json: { ...base, SUMMARY: parsed.SUMMARY ?? null, REGULATED_INDUSTRY: parsed.REGULATED_INDUSTRY ?? null, RECENT_TRIGGER: parsed.RECENT_TRIGGER ?? null, TECH_STACK_HINTS: parsed.TECH_STACK_HINTS ?? null } };\n" +
  "} catch (err) {\n" +
  "  return { json: { ...base, error: 'PERPLEXITY_PARSE_ERROR', error_detail: err.message, raw_content: rawContent } };\n" +
  "}";

const PARSE_ANTHROPIC_CODE =
  "const PERPLEXITY_PARSE_NODE = 'Parse Perplexity Response';\n" +
  "const httpItem = $input.item.json;\n" +
  "const lead = $(PERPLEXITY_PARSE_NODE).item.json;\n" +
  "const base = {\n" +
  "  company_name: lead.company_name,\n" +
  "  company_domain: lead.company_domain,\n" +
  "  SUMMARY: lead.SUMMARY,\n" +
  "  REGULATED_INDUSTRY: lead.REGULATED_INDUSTRY,\n" +
  "  RECENT_TRIGGER: lead.RECENT_TRIGGER,\n" +
  "  TECH_STACK_HINTS: lead.TECH_STACK_HINTS,\n" +
  "  matched_case_study: null,\n" +
  "  relevance_reason: null,\n" +
  "  requires_secure_infrastructure: null,\n" +
  "  should_skip: null,\n" +
  "};\n" +
  "const rawContent = httpItem?.content?.[0]?.text;\n" +
  "if (typeof rawContent !== 'string' || rawContent.length === 0) {\n" +
  "  return { json: { ...base, error: 'ANTHROPIC_EMPTY_CONTENT', error_detail: 'content[0].text was missing or not a string' } };\n" +
  "}\n" +
  "try {\n" +
  "  const parsed = JSON.parse(rawContent);\n" +
  "  return { json: { ...base, matched_case_study: parsed.matched_case_study ?? null, relevance_reason: parsed.relevance_reason ?? null, requires_secure_infrastructure: typeof parsed.requires_secure_infrastructure === 'boolean' ? parsed.requires_secure_infrastructure : null, should_skip: typeof parsed.should_skip === 'boolean' ? parsed.should_skip : null } };\n" +
  "} catch (err) {\n" +
  "  return { json: { ...base, error: 'ANTHROPIC_PARSE_ERROR', error_detail: err.message, raw_content: rawContent } };\n" +
  "}";

const PARSE_EMAIL_CODE =
  "const ANTHROPIC_PARSE_NODE = 'Parse Anthropic Response';\n" +
  "const httpItem = $input.item.json;\n" +
  "const lead = $(ANTHROPIC_PARSE_NODE).item.json;\n" +
  "const base = {\n" +
  "  company_name: lead.company_name,\n" +
  "  company_domain: lead.company_domain,\n" +
  "  RECENT_TRIGGER: lead.RECENT_TRIGGER,\n" +
  "  matched_case_study: lead.matched_case_study,\n" +
  "  generated_email: null,\n" +
  "  approval_status: 'Pending',\n" +
  "};\n" +
  "const rawContent = httpItem?.content?.[0]?.text;\n" +
  "if (typeof rawContent !== 'string' || rawContent.length === 0) {\n" +
  "  return { json: { ...base, error: 'EMAIL_EMPTY_CONTENT', error_detail: 'content[0].text was missing or not a string' } };\n" +
  "}\n" +
  "return { json: { ...base, generated_email: rawContent.trim() } };";

const webhookTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook Trigger',
    parameters: {
      httpMethod: 'POST',
      path: 'chronexa-outbound',
      responseMode: 'onReceived',
      options: {}
    },
    position: [240, 300]
  },
  output: [{ body: { company_name: 'Acme Corp', company_domain: 'acme.com' }, headers: {}, params: {}, query: {} }]
});

const normalizeLeadInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Normalize Lead Input',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 'cn', name: 'company_name', value: expr('{{ $json.body.company_name }}'), type: 'string' },
          { id: 'cd', name: 'company_domain', value: expr('{{ $json.body.company_domain }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [440, 300]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com' }]
});

const perplexityHttp = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Perplexity Extract Triggers',
    parameters: {
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Accept', value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(PERPLEXITY_BODY_EXPR),
      options: {
        response: {
          response: {
            responseFormat: 'json',
            fullResponse: false,
            neverError: false
          }
        },
        timeout: 30000
      }
    },
    credentials: {
      httpHeaderAuth: newCredential('Perplexity API')
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    position: [640, 300]
  },
  output: [{ choices: [{ message: { content: '{"SUMMARY":"Sample","REGULATED_INDUSTRY":"NO","RECENT_TRIGGER":"NOT FOUND","TECH_STACK_HINTS":"NOT FOUND"}' } }] }]
});

const parsePerplexity = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Perplexity Response',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: PARSE_PERPLEXITY_CODE
    },
    position: [840, 300]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', SUMMARY: 'Sample', REGULATED_INDUSTRY: 'NO', RECENT_TRIGGER: 'NOT FOUND', TECH_STACK_HINTS: 'NOT FOUND' }]
});

const errorGate = ifElse({
  type: 'n8n-nodes-base.if',
  version: 2.3,
  config: {
    name: 'Gate Error Check',
    parameters: {
      conditions: {
        options: {
          caseSensitive: true,
          leftValue: '',
          typeValidation: 'loose',
          version: 2
        },
        conditions: [
          {
            id: 'err-empty-1',
            leftValue: expr('{{ $json.error }}'),
            rightValue: '',
            operator: {
              type: 'string',
              operation: 'empty',
              singleValue: true
            }
          }
        ],
        combinator: 'and'
      },
      looseTypeValidation: true,
      options: {}
    },
    position: [1040, 300]
  }
});

const anthropicRoutingHttp = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Anthropic Match Routing Bucket',
    parameters: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'anthropic-version', value: '2023-06-01' },
          { name: 'content-type', value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(ANTHROPIC_ROUTING_BODY_EXPR),
      options: {
        response: {
          response: {
            responseFormat: 'json',
            fullResponse: false,
            neverError: false
          }
        },
        timeout: 30000
      }
    },
    credentials: {
      httpHeaderAuth: newCredential('Anthropic API')
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    position: [1240, 200]
  },
  output: [{ content: [{ type: 'text', text: '{"matched_case_study":"BUCKET 4","relevance_reason":"Sample","requires_secure_infrastructure":false,"should_skip":false}' }] }]
});

const parseAnthropic = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Anthropic Response',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: PARSE_ANTHROPIC_CODE
    },
    onError: 'continueErrorOutput',
    position: [1440, 200]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', SUMMARY: 'Sample', REGULATED_INDUSTRY: 'NO', RECENT_TRIGGER: 'NOT FOUND', TECH_STACK_HINTS: 'NOT FOUND', matched_case_study: 'BUCKET 4', relevance_reason: 'Sample', requires_secure_infrastructure: false, should_skip: false }]
});

const switchBucketRouter = switchCase({
  type: 'n8n-nodes-base.switch',
  version: 3.4,
  config: {
    name: 'Switch Bucket Router',
    parameters: {
      mode: 'rules',
      rules: {
        values: [
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-skip', leftValue: expr('{{ $json.should_skip }}'), rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Skip'
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-b1', leftValue: expr('{{ $json.matched_case_study }}'), rightValue: 'BUCKET 1', operator: { type: 'string', operation: 'contains' } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Bucket 1'
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-b2', leftValue: expr('{{ $json.matched_case_study }}'), rightValue: 'BUCKET 2', operator: { type: 'string', operation: 'contains' } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Bucket 2'
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-b3', leftValue: expr('{{ $json.matched_case_study }}'), rightValue: 'BUCKET 3', operator: { type: 'string', operation: 'contains' } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Bucket 3'
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-b4', leftValue: expr('{{ $json.matched_case_study }}'), rightValue: 'BUCKET 4', operator: { type: 'string', operation: 'contains' } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Bucket 4'
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
              conditions: [{ id: 'r-fallback', leftValue: 'x', rightValue: 'x', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and'
            },
            renameOutput: true,
            outputKey: 'Unrecognized'
          }
        ]
      },
      looseTypeValidation: true,
      options: {}
    },
    position: [1640, 200]
  }
});

const anthropicEmailHttp = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Anthropic Generate Cold Email',
    parameters: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'anthropic-version', value: '2023-06-01' },
          { name: 'content-type', value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(ANTHROPIC_EMAIL_BODY_EXPR),
      options: {
        response: {
          response: {
            responseFormat: 'json',
            fullResponse: false,
            neverError: false
          }
        },
        timeout: 30000
      }
    },
    credentials: {
      httpHeaderAuth: newCredential('Anthropic API')
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    position: [1900, 100]
  },
  output: [{ content: [{ type: 'text', text: 'Sample 3-sentence email body.' }] }]
});

const parseEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Email Output',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: PARSE_EMAIL_CODE
    },
    onError: 'continueErrorOutput',
    position: [2100, 100]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', RECENT_TRIGGER: 'NOT FOUND', matched_case_study: 'BUCKET 4', generated_email: 'Sample email body', approval_status: 'Pending' }]
});

const hitlSheetsAppend = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to HITL Queue',
    parameters: {
      authentication: 'oAuth2',
      resource: 'sheet',
      operation: 'append',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_HITL_SHEET_ID' },
      sheetName: { __rl: true, mode: 'id', value: 'REPLACE_WITH_HITL_SHEET_GID' },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          'Company Name': expr('{{ $json.company_name }}'),
          'Website': expr('{{ $json.company_domain }}'),
          'Trigger Found': expr('{{ $json.RECENT_TRIGGER }}'),
          'Matched Bucket': expr('{{ $json.matched_case_study }}'),
          'Generated Email Draft': expr('{{ $json.generated_email }}'),
          'Approval Status': expr('{{ $json.approval_status }}')
        },
        matchingColumns: [],
        schema: [
          { id: 'Company Name', displayName: 'Company Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Website', displayName: 'Website', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Trigger Found', displayName: 'Trigger Found', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Matched Bucket', displayName: 'Matched Bucket', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Generated Email Draft', displayName: 'Generated Email Draft', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Approval Status', displayName: 'Approval Status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: true
      },
      options: {}
    },
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets Auth')
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    position: [2300, 100]
  },
  output: [{ row_number: 42 }]
});

const tagPerplexityApiFailure = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Perplexity API Failure',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't1-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't1-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't1-fs', name: 'failure_source', value: 'PERPLEXITY_API_FAILURE', type: 'string' },
          { id: 't1-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [640, 600]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'PERPLEXITY_API_FAILURE', raw_error_data: '{}' }]
});

const tagPerplexityDataError = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Perplexity Data Error',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't2-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't2-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't2-fs', name: 'failure_source', value: 'PERPLEXITY_DATA_ERROR', type: 'string' },
          { id: 't2-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1240, 500]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'PERPLEXITY_DATA_ERROR', raw_error_data: '{}' }]
});

const tagRoutingApiFailure = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Routing API Failure',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't3-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't3-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't3-fs', name: 'failure_source', value: 'ANTHROPIC_ROUTING_API_FAILURE', type: 'string' },
          { id: 't3-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1240, 700]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'ANTHROPIC_ROUTING_API_FAILURE', raw_error_data: '{}' }]
});

const tagAnthropicParseJsError = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Anthropic Parse JS Error',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't4-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't4-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't4-fs', name: 'failure_source', value: 'ANTHROPIC_PARSE_JS_ERROR', type: 'string' },
          { id: 't4-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1440, 500]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'ANTHROPIC_PARSE_JS_ERROR', raw_error_data: '{}' }]
});

const tagLegitimateSkip = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Legitimate Skip',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't5-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't5-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't5-fs', name: 'failure_source', value: 'LEGITIMATE_SKIP', type: 'string' },
          { id: 't5-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1640, 500]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'LEGITIMATE_SKIP', raw_error_data: '{}' }]
});

const tagClassificationDrift = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Classification Drift',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't6-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't6-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't6-fs', name: 'failure_source', value: 'CLASSIFICATION_DRIFT', type: 'string' },
          { id: 't6-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1640, 700]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'CLASSIFICATION_DRIFT', raw_error_data: '{}' }]
});

const tagEmailApiFailure = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Email API Failure',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't7-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't7-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't7-fs', name: 'failure_source', value: 'ANTHROPIC_EMAIL_API_FAILURE', type: 'string' },
          { id: 't7-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [1900, 400]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'ANTHROPIC_EMAIL_API_FAILURE', raw_error_data: '{}' }]
});

const tagEmailParseJsError = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Email Parse JS Error',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't8-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't8-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't8-fs', name: 'failure_source', value: 'EMAIL_PARSE_JS_ERROR', type: 'string' },
          { id: 't8-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [2100, 400]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'EMAIL_PARSE_JS_ERROR', raw_error_data: '{}' }]
});

const tagSheetsApiFailure = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Sheets API Failure',
    parameters: {
      mode: 'manual',
      assignments: {
        assignments: [
          { id: 't9-cn', name: 'company_name', value: expr('{{ $("Normalize Lead Input").item.json.company_name }}'), type: 'string' },
          { id: 't9-cd', name: 'company_domain', value: expr('{{ $("Normalize Lead Input").item.json.company_domain }}'), type: 'string' },
          { id: 't9-fs', name: 'failure_source', value: 'SHEETS_API_FAILURE', type: 'string' },
          { id: 't9-re', name: 'raw_error_data', value: expr('{{ JSON.stringify($json) }}'), type: 'string' }
        ]
      },
      includeOtherFields: false,
      options: {}
    },
    position: [2300, 400]
  },
  output: [{ company_name: 'Acme Corp', company_domain: 'acme.com', failure_source: 'SHEETS_API_FAILURE', raw_error_data: '{}' }]
});

const dlqSheetsAppend = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to DLQ Sheet',
    parameters: {
      authentication: 'oAuth2',
      resource: 'sheet',
      operation: 'append',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_DLQ_SHEET_ID' },
      sheetName: { __rl: true, mode: 'id', value: 'REPLACE_WITH_DLQ_SHEET_GID' },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          'Company Name': expr('{{ $json.company_name }}'),
          'Website': expr('{{ $json.company_domain }}'),
          'Failure Source': expr('{{ $json.failure_source }}'),
          'Raw Error Data': expr('{{ $json.raw_error_data }}')
        },
        matchingColumns: [],
        schema: [
          { id: 'Company Name', displayName: 'Company Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Website', displayName: 'Website', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Failure Source', displayName: 'Failure Source', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Raw Error Data', displayName: 'Raw Error Data', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: true
      },
      options: {}
    },
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets Auth')
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    position: [2700, 600]
  },
  output: [{ row_number: 42 }]
});

export default workflow('chronexa-outbound-v2', 'Chronexa Autonomous Outbound Engine v2.0')
  .add(webhookTrigger)
  .to(normalizeLeadInput)
  .to(perplexityHttp)
  .to(parsePerplexity)
  .to(errorGate
    .onTrue(anthropicRoutingHttp)
    .onFalse(tagPerplexityDataError)
  )
  .add(anthropicRoutingHttp)
  .to(parseAnthropic)
  .to(switchBucketRouter
    .onCase(0, tagLegitimateSkip)
    .onCase(1, anthropicEmailHttp)
    .onCase(2, anthropicEmailHttp)
    .onCase(3, anthropicEmailHttp)
    .onCase(4, anthropicEmailHttp)
    .onCase(5, tagClassificationDrift)
  )
  .add(anthropicEmailHttp)
  .to(parseEmail)
  .to(hitlSheetsAppend)
  .add(perplexityHttp.output(1)).to(tagPerplexityApiFailure)
  .add(anthropicRoutingHttp.output(1)).to(tagRoutingApiFailure)
  .add(parseAnthropic.output(1)).to(tagAnthropicParseJsError)
  .add(anthropicEmailHttp.output(1)).to(tagEmailApiFailure)
  .add(parseEmail.output(1)).to(tagEmailParseJsError)
  .add(hitlSheetsAppend.output(1)).to(tagSheetsApiFailure)
  .add(tagPerplexityApiFailure).to(dlqSheetsAppend)
  .add(tagPerplexityDataError).to(dlqSheetsAppend)
  .add(tagRoutingApiFailure).to(dlqSheetsAppend)
  .add(tagAnthropicParseJsError).to(dlqSheetsAppend)
  .add(tagLegitimateSkip).to(dlqSheetsAppend)
  .add(tagClassificationDrift).to(dlqSheetsAppend)
  .add(tagEmailApiFailure).to(dlqSheetsAppend)
  .add(tagEmailParseJsError).to(dlqSheetsAppend)
  .add(tagSheetsApiFailure).to(dlqSheetsAppend);
