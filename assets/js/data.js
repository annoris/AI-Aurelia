/**
 * Aurelia AI — Deterministic Browser Sandbox Dataset & Grounded Response Engine
 * Multi-industry SMB & Enterprise sample records (zero external fetches).
 */

export const WORKSPACES = [
  {
    id: 'sales-proposals',
    shortName: 'Sales & Proposals',
    name: 'Sales & B2B Proposals',
    industryTag: 'Consulting, Agencies & B2B Services',
    description:
      'Generate structured B2B proposals, verify service pricing tiers, and flag missing scope prerequisites before quoting.',
    defaultProviderId: 'openai-gpt41',
    defaultVectorDbId: 'lancedb',
    retrievalPrecision: 97.4,
    avgLatencySec: 1.2,
    weeklyQueries: [28, 34, 41, 39, 52, 64, 58],
    heroHighlight:
      'Prepared B2B proposal scope and onboarding timeline from your Service Catalog and SLA Guide, flagging 2 open pricing prerequisites for human sign-off.',
    suggestedPrompts: [
      'Draft a 30-day onboarding scope for a mid-market operations team.',
      'What SLA response times and volume discounts apply to annual retainers?',
      'Which client prerequisites must be confirmed before sending a formal quote?'
    ]
  },
  {
    id: 'customer-support',
    shortName: '24/7 Customer Support',
    name: 'Customer Support 24/7',
    industryTag: 'E-Commerce, Retail & SaaS Support',
    description:
      'Resolve customer inquiries 24/7 strictly from warranty terms, return policies, and escalation playbooks.',
    defaultProviderId: 'anthropic-sonnet',
    defaultVectorDbId: 'qdrant',
    retrievalPrecision: 98.2,
    avgLatencySec: 0.9,
    weeklyQueries: [64, 71, 88, 92, 105, 84, 79],
    heroHighlight:
      'Drafted a warranty replacement and partial refund policy reply grounded in Return Policy v4 and Escalation Matrix, routing Tier-2 hardware claims to QA.',
    suggestedPrompts: [
      'How do we handle a damaged shipment reported 18 days after delivery?',
      'When should a billing or service outage ticket escalate to Tier-2 engineering?',
      'Summarize exchange eligibility for commercial bulk orders.'
    ]
  },
  {
    id: 'clinic-booking',
    shortName: 'Clinic & Booking',
    name: 'Clinic & Booking Desk',
    industryTag: 'Dental, Medical & Local Service Clinics',
    description:
      'Streamline patient intake prerequisites, insurance verification checklists, and appointment reminder handoffs.',
    defaultProviderId: 'gemini-25',
    defaultVectorDbId: 'lancedb',
    retrievalPrecision: 99.1,
    avgLatencySec: 1.1,
    weeklyQueries: [22, 29, 31, 37, 42, 26, 19],
    heroHighlight:
      'Verified intake forms, 24-hour fasting/prep rules, and multi-location slot buffers for upcoming dental and diagnostic bookings.',
    suggestedPrompts: [
      'What intake forms and prep instructions are required for a new patient diagnostic visit?',
      'Explain our 24-hour rescheduling policy and no-show reminder cadence.',
      'How should the desk triage an urgent same-day pain appointment?'
    ]
  },
  {
    id: 'operations-sop',
    shortName: 'Operations & SOPs',
    name: 'Operations & SOPs',
    industryTag: 'Automotive, Logistics & Field Services',
    description:
      'Turn maintenance manuals, dispatch protocols, and safety procedures into actionable shift checklists.',
    defaultProviderId: 'ollama-llama33',
    defaultVectorDbId: 'chroma',
    retrievalPrecision: 96.8,
    avgLatencySec: 1.6,
    weeklyQueries: [18, 24, 27, 35, 38, 30, 25],
    heroHighlight:
      'Compiled a pre-dispatch fleet inspection checklist from SOP-04 and Fleet Maintenance Standards using local air-gapped Ollama inference.',
    suggestedPrompts: [
      'Build a 5-point pre-dispatch vehicle safety and liftgate inspection checklist.',
      'What is the escalation protocol when a cold-chain sensor drifts above 6 C?',
      'Outline end-of-shift bay handoff steps for service technicians.'
    ]
  }
];

export const DOCUMENTS = [
  // Sales & B2B Proposals (3 attached + 1 unattached)
  {
    id: 'doc-sales-1',
    workspaceId: 'sales-proposals',
    title: 'Service-Catalog-2026.pdf',
    type: 'PDF',
    size: '2.4 MB',
    chunks: 46,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 14, 2026',
    excerpt:
      'Core Packages: Growth Retainer ($3,500/mo, up to 2 automated workflows + weekly optimization), Enterprise Suite ($7,800/mo, dedicated collector pipeline, RBAC, and custom MCP connectors). Onboarding requires 10 business days after kickoff discovery and signed DPA.'
  },
  {
    id: 'doc-sales-2',
    workspaceId: 'sales-proposals',
    title: 'SLA-Policy-v3.docx',
    type: 'DOCX',
    size: '680 KB',
    chunks: 24,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 12, 2026',
    excerpt:
      'Standard SLA: P1 urgent workflow outage response within 2 hours (24/7 on-call), P2 degradation within 6 business hours. Annual prepay agreements receive a 12% volume discount and quarterly executive ROI reviews.'
  },
  {
    id: 'doc-sales-3',
    workspaceId: 'sales-proposals',
    title: 'Proposal-Qualification-Checklist.md',
    type: 'MD',
    size: '42 KB',
    chunks: 14,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 10, 2026',
    excerpt:
      'Mandatory Pre-Quote Prerequisites: (1) Confirm active seat count and data residency region, (2) Identify primary document sources (Drive, SharePoint, or local PDFs), (3) Verify CRM write-back approval from the client IT lead before issuing binding pricing.'
  },
  {
    id: 'doc-sales-4',
    workspaceId: 'sales-proposals',
    title: 'Q4-Enterprise-Discount-Matrix.xlsx',
    type: 'XLSX',
    size: '310 KB',
    chunks: 18,
    status: 'Indexed',
    attached: false,
    updatedAt: 'Nov 08, 2026',
    excerpt:
      'Tiered Multi-Site Pricing Matrix: 2-4 locations qualify for 8% bundle reduction; 5+ locations qualify for 15% enterprise reduction subject to VP Finance sign-off and 24-month commitment.'
  },

  // Customer Support 24/7 (3 attached + 1 unattached)
  {
    id: 'doc-support-1',
    workspaceId: 'customer-support',
    title: 'Return-and-Warranty-Policy-v4.pdf',
    type: 'PDF',
    size: '1.6 MB',
    chunks: 38,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 16, 2026',
    excerpt:
      'Standard Return Window: 30 calendar days from verified carrier delivery. Transit damage reported within 21 days qualifies for prepaid return label and priority replacement dispatch once photo evidence is attached to the RMA ticket.'
  },
  {
    id: 'doc-support-2',
    workspaceId: 'customer-support',
    title: 'Tier2-Escalation-Matrix.docx',
    type: 'DOCX',
    size: '540 KB',
    chunks: 21,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 15, 2026',
    excerpt:
      'Escalation Triggers: Route immediately to Tier-2 Engineering when an outage affects >3 accounts, payment webhook retries fail consecutively for >15 minutes, or API 5xx errors exceed 2% over a 10-minute window.'
  },
  {
    id: 'doc-support-3',
    workspaceId: 'customer-support',
    title: 'Macro-Tone-and-Refund-Rules.md',
    type: 'MD',
    size: '58 KB',
    chunks: 16,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 11, 2026',
    excerpt:
      'Support agents may autonomously approve store-credit adjustments up to $150. Cash refunds above $250 or commercial bulk-order restocking waivers require supervisor approval in the local ticket ledger.'
  },
  {
    id: 'doc-support-4',
    workspaceId: 'customer-support',
    title: 'Bulk-B2B-Order-Exceptions.xlsx',
    type: 'XLSX',
    size: '275 KB',
    chunks: 15,
    status: 'Indexed',
    attached: false,
    updatedAt: 'Nov 03, 2026',
    excerpt:
      'Commercial Bulk Orders (>25 units): Custom-configured hardware carries a 10% restocking fee after 14 days unless defective on arrival, in which case cross-shipping activates within 1 business day.'
  },

  // Clinic & Booking Desk (3 attached + 1 unattached)
  {
    id: 'doc-clinic-1',
    workspaceId: 'clinic-booking',
    title: 'New-Patient-Intake-Guide.pdf',
    type: 'PDF',
    size: '1.3 MB',
    chunks: 32,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 17, 2026',
    excerpt:
      'New Patient Requirements: Photo ID, active insurance card front/back, completed medical history form, and medication list submitted at least 24 hours prior to initial exam. Diagnostic imaging slots reserve a 45-minute buffer.'
  },
  {
    id: 'doc-clinic-2',
    workspaceId: 'clinic-booking',
    title: 'Scheduling-and-NoShow-Policy.docx',
    type: 'DOCX',
    size: '410 KB',
    chunks: 19,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 13, 2026',
    excerpt:
      'Rescheduling & Reminders: Automated SMS/email reminders dispatch at 48 hours and 4 hours before visit. Cancellations inside 24 hours incur a $45 late-change fee unless waived for acute illness or verified emergency.'
  },
  {
    id: 'doc-clinic-3',
    workspaceId: 'clinic-booking',
    title: 'Urgent-Triage-Desk-Protocol.md',
    type: 'MD',
    size: '48 KB',
    chunks: 12,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 09, 2026',
    excerpt:
      'Same-Day Urgent Triage: Two reserved acute-care slots (11:30 AM and 3:45 PM) are held daily for severe pain, swelling, or post-op bleeding. Collect symptom onset and fever status before booking; escalate red-flag airway symptoms to emergency care.'
  },
  {
    id: 'doc-clinic-4',
    workspaceId: 'clinic-booking',
    title: 'Insurance-Copay-Fee-Schedule.xlsx',
    type: 'XLSX',
    size: '490 KB',
    chunks: 27,
    status: 'Indexed',
    attached: false,
    updatedAt: 'Nov 02, 2026',
    excerpt:
      'Standard In-Network Copay Ranges: Preventive checkup $0-$25, diagnostic X-ray panel $35-$60, crown/restorative pre-authorization turnaround 3-5 business days.'
  },

  // Operations & SOPs (3 attached + 1 unattached)
  {
    id: 'doc-ops-1',
    workspaceId: 'operations-sop',
    title: 'SOP-04-PreDispatch-Safety.pdf',
    type: 'PDF',
    size: '3.1 MB',
    chunks: 52,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 16, 2026',
    excerpt:
      'Pre-Dispatch 5-Point Check: (1) Tire tread depth >= 4/32 in and pressure within OEM spec, (2) Hydraulic liftgate lock latch verified, (3) Dashcam & ELD telemetry green, (4) Load straps rated for manifest weight, (5) Spill kit and chocks stowed.'
  },
  {
    id: 'doc-ops-2',
    workspaceId: 'operations-sop',
    title: 'Cold-Chain-Deviation-Playbook.docx',
    type: 'DOCX',
    size: '720 KB',
    chunks: 26,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 14, 2026',
    excerpt:
      'Temperature Excursion Protocol: If cabin sensor exceeds 6.0 C for >12 consecutive minutes, driver must pull over safely, verify door seal & compressor state, log lot numbers, and alert QA Dispatch before unloading.'
  },
  {
    id: 'doc-ops-3',
    workspaceId: 'operations-sop',
    title: 'Shift-Handoff-Bay-Checklist.md',
    type: 'MD',
    size: '36 KB',
    chunks: 11,
    status: 'Indexed',
    attached: true,
    updatedAt: 'Nov 11, 2026',
    excerpt:
      'End-of-Shift Bay Handoff: Tag open work orders in yellow/red status, calibrate torque wrenches back to zero, log diagnostic OBD codes into local work ledger, and confirm parts crib reorder alerts.'
  },
  {
    id: 'doc-ops-4',
    workspaceId: 'operations-sop',
    title: 'Annual-Preventive-Maintenance-Intervals.xlsx',
    type: 'XLSX',
    size: '385 KB',
    chunks: 22,
    status: 'Indexed',
    attached: false,
    updatedAt: 'Oct 29, 2026',
    excerpt:
      'Fleet Service Cadence: Oil & filter inspection every 7,500 miles; brake lining micrometer measurement every 15,000 miles; full hydraulic fluid flush every 1,200 operating hours.'
  }
];

export const OVERVIEW_TEMPLATES = [
  {
    id: 'tpl-proposal',
    workspaceId: 'sales-proposals',
    category: 'Sales & Consulting',
    title: 'B2B Proposal Drafts',
    description:
      'Generate structured proposals from service descriptions and flag missing client requirements before quoting.',
    prompt:
      'Draft a 30-day onboarding scope for a mid-market operations team and list prerequisites before quoting.',
    icon: 'file-text'
  },
  {
    id: 'tpl-support',
    workspaceId: 'customer-support',
    category: 'Customer Support',
    title: '24/7 Policy-Grounded Replies',
    description:
      'Draft customer answers strictly from product guides, return policies, and escalation rules.',
    prompt:
      'How do we handle a damaged shipment reported 18 days after delivery, and when do we escalate?',
    icon: 'message'
  },
  {
    id: 'tpl-clinic',
    workspaceId: 'clinic-booking',
    category: 'Clinics & Services',
    title: 'Appointment & Intake Triage',
    description:
      'Organize client intake notes, service prerequisites, and scheduling handoffs in one local workspace.',
    prompt:
      'What intake forms and prep instructions are required for a new patient diagnostic visit?',
    icon: 'calendar'
  },
  {
    id: 'tpl-ops',
    workspaceId: 'operations-sop',
    category: 'Operations & Field',
    title: 'SOP-to-Checklist Builder',
    description:
      'Convert dense safety manuals and dispatch protocols into structured technician checklists.',
    prompt:
      'Build a 5-point pre-dispatch vehicle safety and liftgate inspection checklist from our SOPs.',
    icon: 'checklist'
  }
];

export const SEEDED_CHAT = {
  'sales-proposals': [
    {
      id: 'msg-sales-1',
      role: 'user',
      author: 'Operator',
      timestamp: '09:41 AM',
      text: 'Summarize our core onboarding packages and which prerequisites we must confirm before sending a formal quote.'
    },
    {
      id: 'msg-sales-2',
      role: 'assistant',
      author: 'Aurelia Workspace Assistant',
      timestamp: '09:41 AM',
      text:
        'Grounded Summary from Sales & B2B Proposals:\n\n' +
        '1. Package Tiers: Growth Retainer ($3,500/mo, up to 2 automated workflows) and Enterprise Suite ($7,800/mo, dedicated collector pipeline, RBAC, and custom MCP connectors). Standard onboarding runs 10 business days post-DPA.\n' +
        '2. SLA & Terms: P1 incidents carry a 2-hour response commitment; annual prepay qualifies for a 12% volume discount.\n' +
        '3. Pre-Quote Flags: Confirm (a) active seat count & data residency region, (b) primary document sources, and (c) IT sign-off on CRM write-back permissions prior to issuing a binding quote.',
      citations: ['doc-sales-1', 'doc-sales-2', 'doc-sales-3'],
      modelLabel: 'OpenAI GPT-4.1',
      latencyMs: 1180
    }
  ],
  'customer-support': [
    {
      id: 'msg-support-1',
      role: 'user',
      author: 'Support Lead',
      timestamp: '10:12 AM',
      text: 'A customer reported transit damage 18 days after delivery on a $140 unit. Can we issue an immediate replacement?'
    },
    {
      id: 'msg-support-2',
      role: 'assistant',
      author: 'Aurelia Workspace Assistant',
      timestamp: '10:12 AM',
      text:
        'Grounded Resolution Guidance:\n\n' +
        '- Eligibility Confirmed: Day 18 falls inside the 21-day transit damage window (and 30-day overall return window).\n' +
        '- Action Allowed: Request photo evidence on the RMA ticket, issue a prepaid return label, and trigger priority replacement dispatch. Because the value ($140) is under the $150 autonomous threshold, no supervisor override is required.\n' +
        '- Escalation Check: Only escalate to Tier-2 if defect patterns repeat across >=3 accounts.',
      citations: ['doc-support-1', 'doc-support-3', 'doc-support-2'],
      modelLabel: 'Anthropic Claude Sonnet',
      latencyMs: 910
    }
  ],
  'clinic-booking': [
    {
      id: 'msg-clinic-1',
      role: 'user',
      author: 'Intake Coordinator',
      timestamp: '08:55 AM',
      text: 'What must we collect before confirming a new patient diagnostic imaging visit?'
    },
    {
      id: 'msg-clinic-2',
      role: 'assistant',
      author: 'Aurelia Workspace Assistant',
      timestamp: '08:55 AM',
      text:
        'Pre-Visit Intake Requirements:\n\n' +
        '- Collect photo ID, front/back active insurance card, medical history form, and current medication list at least 24 hours ahead of the visit.\n' +
        '- Reserve a 45-minute slot buffer for diagnostic imaging and schedule automated reminders at 48 hours and 4 hours prior.\n' +
        '- Remind the patient of the 24-hour rescheduling window ($45 late-change policy).',
      citations: ['doc-clinic-1', 'doc-clinic-2'],
      modelLabel: 'Google Gemini 2.5',
      latencyMs: 1040
    }
  ],
  'operations-sop': [
    {
      id: 'msg-ops-1',
      role: 'user',
      author: 'Shift Supervisor',
      timestamp: '07:15 AM',
      text: 'Provide the cold-chain excursion steps if a truck sensor hits 6.8 C during route dispatch.'
    },
    {
      id: 'msg-ops-2',
      role: 'assistant',
      author: 'Aurelia Workspace Assistant',
      timestamp: '07:15 AM',
      text:
        'Cold-Chain Excursion SOP:\n\n' +
        '- Trigger Threshold: Above 6.0 C for more than 12 consecutive minutes requires immediate driver intervention.\n' +
        '- Field Steps: Pull over safely, inspect rear door gaskets and compressor indicator, record impacted pallet lot numbers, and notify QA Dispatch before unloading any cargo.\n' +
        '- Post-Route Handoff: Tag the trailer work order in yellow/red status in the bay handoff ledger.',
      citations: ['doc-ops-2', 'doc-ops-3'],
      modelLabel: 'Ollama Local (Llama 3.3)',
      latencyMs: 1590
    }
  ]
};

/**
 * Generates a deterministic, document-grounded response strictly from currently attached docs.
 */
export function generateGroundedReply({ workspace, attachedDocs, promptText, providerName }) {
  if (!attachedDocs || attachedDocs.length === 0) {
    return {
      text:
        `No documents are currently attached to "${workspace.name}".\n\n` +
        'Because Aurelia AI enforces strict document grounding, this workspace cannot cite unattached files or invent policy terms. Attach one or more documents in the Workspace Context panel on the right and resubmit your query.',
      citations: [],
      modelLabel: providerName,
      latencyMs: 320
    };
  }

  const normalized = (promptText || '').toLowerCase();
  const stopWords = new Set([
    'what',
    'when',
    'where',
    'which',
    'how',
    'for',
    'the',
    'and',
    'with',
    'from',
    'that',
    'this',
    'into',
    'before',
    'after',
    'our',
    'are',
    'can',
    'does',
    'must'
  ]);
  const tokens = normalized
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopWords.has(t));

  const scored = attachedDocs.map((doc, idx) => {
    const haystack = `${doc.title} ${doc.excerpt}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += 3;
    }
    // Slight deterministic bias so broad prompts still surface top relevant docs
    score += Math.max(0, attachedDocs.length - idx) * 0.25;
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, Math.min(2, scored.length)).map((item) => item.doc);
  const citationIds = selected.map((d) => d.id);

  const bulletLines = selected
    .map((d) => `- ${d.title} (${d.type}): ${d.excerpt}`)
    .join('\n');

  const unattachedCount = Math.max(0, 4 - attachedDocs.length);
  const coverageNote =
    unattachedCount > 0
      ? `\nNote: ${unattachedCount} additional library file(s) in this workspace remain unattached and were excluded from retrieval.`
      : '\nAll 4 workspace reference files are attached and active in this retrieval pass.';

  const text =
    `Grounded Response (${workspace.name} · ${selected.length} cited source${selected.length > 1 ? 's' : ''}):\n\n` +
    `Regarding "${promptText.trim()}":\n` +
    `${bulletLines}\n` +
    `\nRecommended Next Action: Verify any missing client-specific inputs or approval thresholds flagged above before executing external writes.${coverageNote}`;

  const baseMs = providerName.includes('Ollama') ? 1520 : providerName.includes('Gemini') ? 960 : 1140;
  return {
    text,
    citations: citationIds,
    modelLabel: providerName,
    latencyMs: baseMs + (promptText.length % 190)
  };
}

export const WORKFLOWS = [
  {
    id: 'flow-b2b-proposal',
    name: 'B2B Proposal Generator',
    workspaceId: 'sales-proposals',
    triggerLabel: 'New Qualified RFP / Lead Record',
    summary: 'Assembles scope, SLA terms, and missing pre-quote flags into a structured proposal draft.',
    nodes: [
      {
        id: 'node-1',
        type: 'Trigger & Inputs',
        title: 'Capture RFP Scope & Tier',
        subtitle: 'Normalizes company size, seat count, and target timeline',
        latencyMs: 95,
        tokens: 180,
        defaultConfig: {
          accountName: 'Northstar Logistics Group',
          requestedPackage: 'Enterprise Suite ($7,800/mo)',
          billingTerm: 'Annual Prepay (12% Discount)'
        }
      },
      {
        id: 'node-2',
        type: 'Vector Retrieval',
        title: 'Query Service Catalog & SLA',
        subtitle: 'Top-K chunk retrieval across attached PDF/DOCX guides',
        latencyMs: 210,
        tokens: 640,
        defaultConfig: {
          vectorStore: 'LanceDB Embedded',
          topK: '6',
          similarityFloor: '0.78'
        }
      },
      {
        id: 'node-3',
        type: 'LLM Reasoning',
        title: 'Draft Scope & Flag Gaps',
        subtitle: 'Synthesizes deliverables and highlights missing IT sign-offs',
        latencyMs: 680,
        tokens: 1420,
        defaultConfig: {
          reasoningMode: 'Strict Grounding + Gap Check',
          temperature: '0.2',
          requireHumanSignOff: 'Yes'
        }
      },
      {
        id: 'node-4',
        type: 'Tool / API Action',
        title: 'Enrich Local CRM Opportunity',
        subtitle: 'Writes draft summary to local CRM ledger (approval gated)',
        latencyMs: 145,
        tokens: 220,
        defaultConfig: {
          targetModule: 'Local CRM Pipeline',
          writeMode: 'Draft Only (No External Email)',
          stageUpdate: 'Proposal Sent'
        }
      },
      {
        id: 'node-5',
        type: 'Structured Output',
        title: 'Emit Proposal JSON & Brief',
        subtitle: 'Outputs validated proposal packet ready for operator export',
        latencyMs: 75,
        tokens: 310,
        defaultConfig: {
          outputFormat: 'JSON + Executive Markdown',
          includeCitations: 'true',
          confidenceThreshold: '0.92'
        }
      }
    ]
  },
  {
    id: 'flow-support-triage',
    name: '24/7 Support Escalation Triage',
    workspaceId: 'customer-support',
    triggerLabel: 'Inbound Support Ticket / Webhook',
    summary: 'Classifies urgency, checks warranty/refund limits, and routes Tier-2 technical claims.',
    nodes: [
      {
        id: 'node-1',
        type: 'Trigger & Inputs',
        title: 'Ingest Customer Ticket',
        subtitle: 'Extracts order ID, days since delivery, and defect category',
        latencyMs: 85,
        tokens: 160,
        defaultConfig: {
          ticketId: 'SUP-4928',
          daysSinceDelivery: '18',
          claimValueUsd: '140'
        }
      },
      {
        id: 'node-2',
        type: 'Vector Retrieval',
        title: 'Retrieve Return & Escalation Rules',
        subtitle: 'Grounds policy limits from Return-and-Warranty-Policy-v4.pdf',
        latencyMs: 190,
        tokens: 580,
        defaultConfig: {
          vectorStore: 'Qdrant',
          topK: '5',
          similarityFloor: '0.80'
        }
      },
      {
        id: 'node-3',
        type: 'LLM Reasoning',
        title: 'Evaluate Refund & Tier-2 Criteria',
        subtitle: 'Verifies $150 autonomous cap and outage thresholds',
        latencyMs: 540,
        tokens: 1120,
        defaultConfig: {
          reasoningMode: 'Policy Verification',
          temperature: '0.1',
          autoApproveLimitUsd: '150'
        }
      },
      {
        id: 'node-4',
        type: 'Tool / API Action',
        title: 'Prepare RMA & Slack Escalation',
        subtitle: 'Stages prepaid label draft or routes Slack engineering alert',
        latencyMs: 160,
        tokens: 240,
        defaultConfig: {
          targetChannel: '#support-tier2-ops',
          rmaAction: 'Stage Replacement Label',
          notifySupervisor: 'No (Under $150)'
        }
      },
      {
        id: 'node-5',
        type: 'Structured Output',
        title: 'Emit Grounded Reply Draft',
        subtitle: 'Delivers cited customer message with internal audit trail',
        latencyMs: 65,
        tokens: 260,
        defaultConfig: {
          outputFormat: 'Ticket Reply + Audit JSON',
          includeCitations: 'true',
          slaTag: 'Priority-24h'
        }
      }
    ]
  },
  {
    id: 'flow-clinic-intake',
    name: 'Clinic Appointment Intake & Reminders',
    workspaceId: 'clinic-booking',
    triggerLabel: 'Booking Request / Patient Intake',
    summary: 'Validates intake prerequisites, detects urgent triage flags, and stages 48h/4h reminders.',
    nodes: [
      {
        id: 'node-1',
        type: 'Trigger & Inputs',
        title: 'Receive Patient Booking Request',
        subtitle: 'Captures visit type, symptom urgency, and insurance status',
        latencyMs: 90,
        tokens: 150,
        defaultConfig: {
          clinicLocation: 'Midtown Dental & Diagnostic',
          visitType: 'New Patient Diagnostic (45m)',
          urgencyFlag: 'Routine'
        }
      },
      {
        id: 'node-2',
        type: 'Vector Retrieval',
        title: 'Fetch Intake & Triage Guides',
        subtitle: 'Pulls prep rules and same-day acute slot buffers',
        latencyMs: 175,
        tokens: 510,
        defaultConfig: {
          vectorStore: 'LanceDB Embedded',
          topK: '4',
          similarityFloor: '0.82'
        }
      },
      {
        id: 'node-3',
        type: 'LLM Reasoning',
        title: 'Check Prerequisites & Slot Fit',
        subtitle: 'Flags missing insurance card or medication checklist items',
        latencyMs: 520,
        tokens: 980,
        defaultConfig: {
          reasoningMode: 'Clinical Intake Checklist',
          temperature: '0.1',
          bufferMinutes: '45'
        }
      },
      {
        id: 'node-4',
        type: 'Tool / API Action',
        title: 'Queue Booking & Reminder Cadence',
        subtitle: 'Schedules 48-hour and 4-hour reminder drafts in local CRM',
        latencyMs: 135,
        tokens: 195,
        defaultConfig: {
          reminderCadence: '48h + 4h Pre-Visit',
          noShowFeeNotice: '$45 (<24h)',
          syncLocalCalendar: 'Confirmed'
        }
      },
      {
        id: 'node-5',
        type: 'Structured Output',
        title: 'Return Intake Readiness Packet',
        subtitle: 'Produces front-desk checklist and patient prep message',
        latencyMs: 70,
        tokens: 245,
        defaultConfig: {
          outputFormat: 'Front-Desk Card + SMS Draft',
          includeCitations: 'true',
          redFlagEscalation: 'Enabled'
        }
      }
    ]
  },
  {
    id: 'flow-sop-checklist',
    name: 'SOP-to-Checklist Converter',
    workspaceId: 'operations-sop',
    triggerLabel: 'Shift Start / Maintenance Dispatch',
    summary: 'Converts safety manuals and cold-chain protocols into structured technician shift checklists.',
    nodes: [
      {
        id: 'node-1',
        type: 'Trigger & Inputs',
        title: 'Select Vehicle & Shift Spec',
        subtitle: 'Loads route class, refrigeration unit status, and bay ID',
        latencyMs: 80,
        tokens: 140,
        defaultConfig: {
          fleetUnit: 'Reefer Van #18 (Bay 3)',
          routeProfile: 'Cold-Chain Regional',
          shiftWindow: '06:00 AM - 02:30 PM'
        }
      },
      {
        id: 'node-2',
        type: 'Vector Retrieval',
        title: 'Retrieve SOP-04 & Excursion Playbook',
        subtitle: 'Queries local Chroma index with zero cloud egress',
        latencyMs: 240,
        tokens: 610,
        defaultConfig: {
          vectorStore: 'Chroma',
          topK: '5',
          similarityFloor: '0.79'
        }
      },
      {
        id: 'node-3',
        type: 'LLM Reasoning',
        title: 'Synthesize 5-Point Shift Checklist',
        subtitle: 'Executes via Ollama Local (Llama 3.3) for air-gapped privacy',
        latencyMs: 790,
        tokens: 1290,
        defaultConfig: {
          reasoningMode: 'Local Ollama SOP Compiler',
          temperature: '0.15',
          airGappedMode: 'Strict Local'
        }
      },
      {
        id: 'node-4',
        type: 'Tool / API Action',
        title: 'Write Bay Inspection Log',
        subtitle: 'Records checklist hash via local Filesystem MCP tool',
        latencyMs: 125,
        tokens: 185,
        defaultConfig: {
          mcpServer: 'Filesystem',
          logTarget: '/var/aurelia/sop-logs/bay-3.json',
          alertThresholdC: '6.0 C (>12m)'
        }
      },
      {
        id: 'node-5',
        type: 'Structured Output',
        title: 'Publish Technician Checklist',
        subtitle: 'Emits printable pass/fail checklist with excursion triggers',
        latencyMs: 70,
        tokens: 280,
        defaultConfig: {
          outputFormat: 'Checklist JSON + Dispatch Sheet',
          includeCitations: 'true',
          signOffRequired: 'Lead Tech + Driver'
        }
      }
    ]
  }
];

export const LLM_PROVIDERS = [
  {
    id: 'openai-gpt41',
    name: 'OpenAI GPT-4.1',
    routing: 'Cloud API',
    privacyTier: 'Cloud HTTPS · Encrypted Transit',
    latency: '1.1s avg',
    contextWindow: '128K tokens',
    description:
      'Balanced enterprise reasoning, structured JSON tool calling, and fast multi-document B2B proposal synthesis.'
  },
  {
    id: 'anthropic-sonnet',
    name: 'Anthropic Claude Sonnet',
    routing: 'Cloud API',
    privacyTier: 'Cloud HTTPS · Zero Training Retention',
    latency: '1.2s avg',
    contextWindow: '200K tokens',
    description:
      'High-precision policy synthesis, nuanced 24/7 customer support replies, and strict refusal when facts are missing.'
  },
  {
    id: 'gemini-25',
    name: 'Google Gemini 2.5',
    routing: 'Cloud API',
    privacyTier: 'Cloud API · Regional Endpoints',
    latency: '1.0s avg',
    contextWindow: '1M tokens',
    description:
      'Low-latency intake triage, expansive catalog indexing, and multimodal schedule or document summarization.'
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    routing: 'Cloud API (VPC)',
    privacyTier: 'Private VNet · Regional Data Residency',
    latency: '1.3s avg',
    contextWindow: '128K tokens',
    description:
      'Dedicated tenant deployment supporting enterprise compliance boundaries and private endpoint routing.'
  },
  {
    id: 'ollama-llama33',
    name: 'Ollama Local (Llama 3.3)',
    routing: 'Self-Hosted Local Privacy',
    privacyTier: '100% On-Premise · Zero Outbound Egress',
    latency: '1.6s avg',
    contextWindow: '128K tokens',
    description:
      'Air-gapped local inference inside your own GPU/CPU host for confidential SOPs, clinic records, and field ops.'
  }
];

export const VECTOR_DBS = [
  {
    id: 'lancedb',
    name: 'LanceDB Embedded',
    mode: 'Embedded Disk Store',
    description: 'Default zero-dependency columnar vector store co-located inside Tier 02 storage volumes.'
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    mode: 'Self-Hosted Container / Cloud',
    description: 'High-throughput Rust vector search engine with strict workspace metadata payload filters.'
  },
  {
    id: 'chroma',
    name: 'Chroma',
    mode: 'Local Service',
    description: 'Lightweight developer-friendly embeddings collection ideal for regional SOP and knowledge hubs.'
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    mode: 'Managed Serverless',
    description: 'Distributed serverless vector index for multi-office teams requiring cross-region replication.'
  }
];

export const AGENT_SKILLS = [
  {
    id: 'skill-rag-cite',
    name: 'Strict Citation Grounding',
    description: 'Requires every factual claim to map back to an attached workspace document chunk.',
    permission: 'Read-Only',
    enabled: true,
    tools: ['vector.query', 'chunk.verify']
  },
  {
    id: 'skill-proposal-draft',
    name: 'B2B Scope & Quote Drafter',
    description: 'Builds structured deliverables, SLA tiers, and prerequisite checklists without binding sends.',
    permission: 'Draft Only',
    enabled: true,
    tools: ['proposal.compose', 'pricing.lookup']
  },
  {
    id: 'skill-crm-stage',
    name: 'Local CRM Record Updater',
    description: 'Updates stage status and logs internal follow-up notes inside the local Prisma CRM ledger.',
    permission: 'Scoped Write',
    enabled: true,
    tools: ['crm.read', 'crm.updateStage']
  },
  {
    id: 'skill-support-rma',
    name: 'Support RMA Eligibility Check',
    description: 'Validates delivery window, $150 autonomous credit cap, and Tier-2 escalation triggers.',
    permission: 'Read-Only',
    enabled: true,
    tools: ['policy.evaluate', 'rma.validate']
  },
  {
    id: 'skill-clinic-triage',
    name: 'Intake & Triage Form Verifier',
    description: 'Checks photo ID, insurance card, and 45-minute diagnostic buffer prerequisites.',
    permission: 'Workspace Tool',
    enabled: true,
    tools: ['intake.check', 'slot.buffer']
  },
  {
    id: 'skill-sop-checklist',
    name: 'SOP Checklist Compiler',
    description: 'Converts dense technical PDFs into numbered pass/fail inspection sheets for field teams.',
    permission: 'Draft Only',
    enabled: false,
    tools: ['sop.extract', 'checklist.format']
  },
  {
    id: 'skill-drive-ingest',
    name: 'Manual Drive Folder Scanner',
    description: 'Lists operator-selected Google Drive folders prior to explicit Collector ingestion.',
    permission: 'Read-Only',
    enabled: false,
    tools: ['drive.listFolder', 'collector.stage']
  },
  {
    id: 'skill-hubspot-batch',
    name: 'Bounded HubSpot Batch Importer',
    description: 'Pulls capped 25, 50, or 100 contact slices with preview validation before CRM insert.',
    permission: 'Scoped Write',
    enabled: true,
    tools: ['hubspot.preview', 'crm.bulkStage']
  }
];

export const MCP_SERVERS = [
  {
    id: 'mcp-filesystem',
    name: 'Filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/srv/aurelia/workspaces'],
    env: {},
    scope: 'Scoped Read/Write (/srv/aurelia/workspaces)',
    enabled: true,
    description: 'Exposes sandboxed workspace exports, SOP checklist archives, and local proposal PDFs.'
  },
  {
    id: 'mcp-postgres',
    name: 'PostgreSQL',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', '${AURELIA_READONLY_PG_URL}'],
    env: { PGSSLMODE: 'require' },
    scope: 'Read-Only Analytics Views',
    enabled: true,
    description: 'Lets agents inspect sanitized billing, appointment slot availability, and order RMA status.'
  },
  {
    id: 'mcp-github',
    name: 'GitHub',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}' },
    scope: 'Repo Issues & Release Docs',
    enabled: false,
    description: 'Syncs technical release notes, bug escalations, and engineering runbooks into workspaces.'
  },
  {
    id: 'mcp-slack',
    name: 'Slack',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-slack'],
    env: { SLACK_BOT_TOKEN: '${SLACK_BOT_TOKEN}', SLACK_TEAM_ID: '${SLACK_TEAM_ID}' },
    scope: 'Escalation Channels (#support-tier2)',
    enabled: true,
    description: 'Routes high-priority Tier-2 incident alerts and daily CRM pipeline summaries.'
  }
];

export const CRM_LEADS = [
  {
    id: 'lead-101',
    company: 'Harborview Dental Group',
    industry: 'Dental Clinic Group',
    contactName: 'Dr. Elena Rostova',
    contactRole: 'Managing Partner',
    email: 'elena.rostova@harborviewdental.example',
    phone: '+1 (312) 555-0148',
    stage: 'Booked',
    value: 14400,
    nextAppointment: '2026-11-24 10:00 AM',
    workspaceId: 'clinic-booking',
    owner: 'M. Alvarez',
    source: 'Website Chat Embed',
    lastTouch: '2h ago',
    notes: '3-location practice looking to automate 48h/4h patient reminders and insurance pre-checks.'
  },
  {
    id: 'lead-102',
    company: 'Apex Auto & Fleet Care',
    industry: 'Automotive Service Center',
    contactName: 'Marcus Vance',
    contactRole: 'Service Director',
    email: 'mvance@apexfleetcare.example',
    phone: '+1 (404) 555-0192',
    stage: 'Proposal Sent',
    value: 21600,
    nextAppointment: '2026-11-25 02:30 PM',
    workspaceId: 'operations-sop',
    owner: 'D. Chen',
    source: 'HubSpot Batch Import',
    lastTouch: '5h ago',
    notes: 'Needs air-gapped Ollama deployment for 14-bay technician diagnostic checklists and OEM manuals.'
  },
  {
    id: 'lead-103',
    company: 'Northstar Cold Logistics',
    industry: 'Logistics & Cold-Chain Ops',
    contactName: 'Priya Nair',
    contactRole: 'VP of Operations',
    email: 'pnair@northstarcold.example',
    phone: '+1 (206) 555-0177',
    stage: 'Qualified',
    value: 38400,
    nextAppointment: '2026-11-26 11:00 AM',
    workspaceId: 'operations-sop',
    owner: 'D. Chen',
    source: 'Direct Inbound',
    lastTouch: '1d ago',
    notes: 'Evaluating 5-point pre-dispatch checklist flow and temperature excursion SOP automation across 4 hubs.'
  },
  {
    id: 'lead-104',
    company: 'Loom & Clay Home Goods',
    industry: 'E-Commerce Brand',
    contactName: 'Hannah Brooks',
    contactRole: 'Head of CX',
    email: 'hannah@loomandclay.example',
    phone: '+1 (512) 555-0134',
    stage: 'Won',
    value: 16800,
    nextAppointment: '2026-12-01 09:30 AM',
    workspaceId: 'customer-support',
    owner: 'S. Patel',
    source: 'Website Chat Embed',
    lastTouch: '1d ago',
    notes: 'Signed annual Growth Retainer for 24/7 transit-damage RMA replies and return policy grounding.'
  },
  {
    id: 'lead-105',
    company: 'StrataBridge Advisory',
    industry: 'B2B SaaS Consultancy',
    contactName: 'David Lindqvist',
    contactRole: 'Principal Consultant',
    email: 'david@stratabridge.example',
    phone: '+1 (415) 555-0181',
    stage: 'Proposal Sent',
    value: 29500,
    nextAppointment: '2026-11-25 04:00 PM',
    workspaceId: 'sales-proposals',
    owner: 'M. Alvarez',
    source: 'Google Drive RFP Sync',
    lastTouch: '6h ago',
    notes: 'Reviewing Enterprise Suite SLA and missing client IT sign-off prerequisite for CRM write-back.'
  },
  {
    id: 'lead-106',
    company: 'Summit Mechanical HVAC',
    industry: 'Commercial Field Services',
    contactName: 'Carlos Mendez',
    contactRole: 'Operations Manager',
    email: 'cmendez@summithvac.example',
    phone: '+1 (602) 555-0166',
    stage: 'Follow-Up',
    value: 12900,
    nextAppointment: '2026-11-27 01:00 PM',
    workspaceId: 'sales-proposals',
    owner: 'D. Chen',
    source: 'HubSpot Batch Import',
    lastTouch: '3d ago',
    notes: 'Requested commercial maintenance quote template plus technician dispatch checklist bundle.'
  },
  {
    id: 'lead-107',
    company: 'ClearPath Urgent Care',
    industry: 'Medical Clinic Network',
    contactName: 'Dr. Samuel Okafor',
    contactRole: 'Medical Director',
    email: 'sokafor@clearpathcare.example',
    phone: '+1 (617) 555-0129',
    stage: 'Qualified',
    value: 31200,
    nextAppointment: '2026-11-28 09:00 AM',
    workspaceId: 'clinic-booking',
    owner: 'S. Patel',
    source: 'Direct Inbound',
    lastTouch: '12h ago',
    notes: 'Needs same-day urgent triage protocol plus Azure OpenAI regional VNet compliance confirmation.'
  },
  {
    id: 'lead-108',
    company: 'Veloce Parts Wholesale',
    industry: 'B2B Parts Distribution',
    contactName: 'Rachel Kim',
    contactRole: 'Support Operations Lead',
    email: 'rkim@veloceparts.example',
    phone: '+1 (713) 555-0155',
    stage: 'Booked',
    value: 19200,
    nextAppointment: '2026-11-24 03:15 PM',
    workspaceId: 'customer-support',
    owner: 'M. Alvarez',
    source: 'Website Chat Embed',
    lastTouch: '4h ago',
    notes: 'Demo scheduled to inspect bulk order exception tables and Slack Tier-2 escalation routing.'
  },
  {
    id: 'lead-109',
    company: 'Atelier Solis Architecture',
    industry: 'Design & Engineering Studio',
    contactName: 'Claire Moreau',
    contactRole: 'Studio Director',
    email: 'claire@ateliersolis.example',
    phone: '+1 (212) 555-0118',
    stage: 'Follow-Up',
    value: 15600,
    nextAppointment: '2026-11-29 11:30 AM',
    workspaceId: 'sales-proposals',
    owner: 'D. Chen',
    source: 'Google Drive RFP Sync',
    lastTouch: '2d ago',
    notes: 'Interested in indexing historical RFP deliverables and municipal permit checklists locally.'
  },
  {
    id: 'lead-110',
    company: 'Oakridge Veterinary Partners',
    industry: 'Veterinary Hospital Group',
    contactName: 'Dr. Nina Patel',
    contactRole: 'Clinic Administrator',
    email: 'npatel@oakridgevet.example',
    phone: '+1 (503) 555-0140',
    stage: 'Won',
    value: 18000,
    nextAppointment: '2026-12-02 10:30 AM',
    workspaceId: 'clinic-booking',
    owner: 'S. Patel',
    source: 'HubSpot Batch Import',
    lastTouch: '1d ago',
    notes: 'Live across 2 clinics handling surgery prep checklists and post-visit follow-up drafts.'
  },
  {
    id: 'lead-111',
    company: 'Kestrel Cloud Billing',
    industry: 'B2B FinTech SaaS',
    contactName: 'Trevor Walsh',
    contactRole: 'VP Customer Success',
    email: 'twalsh@kestrelbilling.example',
    phone: '+1 (303) 555-0199',
    stage: 'Proposal Sent',
    value: 26400,
    nextAppointment: '2026-11-26 02:00 PM',
    workspaceId: 'customer-support',
    owner: 'M. Alvarez',
    source: 'Direct Inbound',
    lastTouch: '9h ago',
    notes: 'Comparing Anthropic Claude Sonnet vs GPT-4.1 for billing dispute triage and PostgreSQL read-only MCP.'
  },
  {
    id: 'lead-112',
    company: 'Pacific Timber & Supply',
    industry: 'Industrial Equipment & Supply',
    contactName: 'Greg Halvorsen',
    contactRole: 'Safety & Fleet Lead',
    email: 'ghalvorsen@pacifictimber.example',
    phone: '+1 (253) 555-0163',
    stage: 'Qualified',
    value: 22800,
    nextAppointment: '2026-11-30 08:30 AM',
    workspaceId: 'operations-sop',
    owner: 'D. Chen',
    source: 'Website Chat Embed',
    lastTouch: '14h ago',
    notes: 'Focused on OSHA inspection logs, liftgate safety compliance, and offline warehouse tablet access.'
  }
];

/**
 * Generates deterministic follow-up draft variations for a CRM lead (never sends externally).
 */
export function buildFollowUpDraft(lead, variantIndex = 0) {
  const firstName = (lead.contactName || 'Team').split(' ')[0];
  const formattedVal = `$${Number(lead.value || 0).toLocaleString('en-US')}`;
  const variants = [
    `Subject: Next Steps & Onboarding Prerequisites — ${lead.company}\n\n` +
      `Hi ${firstName},\n\n` +
      `Thank you for reviewing the ${lead.industry} automation scope with our team. Based on your notes (${lead.notes}), I prepared an updated draft workspace tailored to your ${formattedVal} rollout.\n\n` +
      `Before our ${lead.nextAppointment} checkpoint, please confirm:\n` +
      `1. Primary document folders or policy PDFs for initial Collector indexing\n` +
      `2. Preferred model routing (Cloud API vs. self-hosted Ollama local privacy)\n` +
      `3. Approver contact for scoped CRM or MCP read-only connections\n\n` +
      `Best regards,\n${lead.owner} · Aurelia AI Implementation Team`,

    `Subject: Confirmation for ${lead.nextAppointment} — ${lead.company} Workflow Review\n\n` +
      `Hello ${firstName},\n\n` +
      `Looking forward to our session on ${lead.nextAppointment}. We will walk through your ${lead.stage} milestone and demonstrate live citation grounding using representative ${lead.industry} documents.\n\n` +
      `If any additional team members from IT or operations should join to verify security boundaries, feel free to forward the calendar invite.\n\n` +
      `Warm regards,\n${lead.owner} · Aurelia AI`,

    `Subject: Implementation Checklist & Timeline Summary (${lead.company})\n\n` +
      `Hi ${firstName},\n\n` +
      `Following up on our recent touchpoint (${lead.lastTouch}): our standard 10-business-day onboarding plan covers document ingestion, visual flow testing, and local CRM staging for ${lead.company}.\n\n` +
      `Current pipeline status: ${lead.stage} (${formattedVal} estimated annual scope). Let me know if you want us to stage a sample document pack ahead of ${lead.nextAppointment}.\n\n` +
      `Sincerely,\n${lead.owner} · Aurelia AI`
  ];
  return variants[Math.abs(variantIndex) % variants.length];
}

export const DRIVE_FOLDERS = [
  {
    id: 'folder-sales',
    name: 'Sales-Proposals-2026/',
    workspaceId: 'sales-proposals',
    files: [
      { id: 'gd-1', name: '2026-Master-Service-Rates.pdf', size: '1.9 MB', modified: 'Nov 16, 2026' },
      { id: 'gd-2', name: 'Enterprise-DPA-Template.docx', size: '420 KB', modified: 'Nov 12, 2026' },
      { id: 'gd-3', name: 'Onboarding-Timeline-Milestones.xlsx', size: '295 KB', modified: 'Nov 09, 2026' }
    ]
  },
  {
    id: 'folder-support',
    name: 'Support-Playbooks/',
    workspaceId: 'customer-support',
    files: [
      { id: 'gd-4', name: 'Holiday-Shipping-Cutoff-FAQ.pdf', size: '860 KB', modified: 'Nov 15, 2026' },
      { id: 'gd-5', name: 'Warranty-RMA-Workflow-v4.md', size: '64 KB', modified: 'Nov 11, 2026' },
      { id: 'gd-6', name: 'Escalation-OnCall-Roster.xlsx', size: '180 KB', modified: 'Nov 07, 2026' }
    ]
  },
  {
    id: 'folder-ops',
    name: 'Clinic-and-Ops-SOPs/',
    workspaceId: 'operations-sop',
    files: [
      { id: 'gd-7', name: 'Fleet-ColdChain-SOP-04.pdf', size: '2.7 MB', modified: 'Nov 14, 2026' },
      { id: 'gd-8', name: 'Clinic-Intake-Consent-Packet.docx', size: '510 KB', modified: 'Nov 10, 2026' },
      { id: 'gd-9', name: 'Shift-Handoff-Audit-Sheet.xlsx', size: '230 KB', modified: 'Nov 05, 2026' }
    ]
  }
];

export const HUBSPOT_SAMPLE_CONTACTS = Array.from({ length: 100 }, (_, i) => {
  const companies = [
    'BlueRidge Dental Care',
    'Metroline Auto Group',
    'Summit Cold Freight',
    'Cedar & Loom Retail',
    'Vanguard Advisory LLP',
    'BrightPath Health Clinic',
    'Keystone HVAC Co',
    'Pacific Marine Logistics',
    'Solis Design Studio',
    'Cascade Vet Associates'
  ];
  const owners = ['M. Alvarez', 'D. Chen', 'S. Patel'];
  const stages = ['Qualified', 'Proposal Sent', 'Booked', 'Follow-Up'];
  const num = i + 1;
  const company = `${companies[i % companies.length]} #${Math.floor(i / companies.length) + 1}`;
  return {
    id: `hs-${1000 + num}`,
    name: `Contact ${num.toString().padStart(3, '0')}`,
    email: `ops${num}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.example`,
    company,
    stage: stages[i % stages.length],
    owner: owners[i % owners.length]
  };
});

export const CHANNELS_STATUS = [
  {
    id: 'conn-telegram',
    name: 'Telegram Bot Bridge',
    badge: 'Configured (Sample Token)',
    badgeVariant: 'is-configured',
    summary:
      'Routes field technician SOP queries and appointment reminders through your self-hosted webhook endpoint.',
    endpoint: 'POST /api/channels/telegram/webhook'
  },
  {
    id: 'conn-email',
    name: 'Gmail / Outlook Draft Bridge',
    badge: 'Draft-Only Guardrail',
    badgeVariant: 'is-sample',
    summary:
      'Creates customer reply and CRM follow-up drafts in operator inboxes without automatic outbound dispatch.',
    endpoint: 'Scoped OAuth (compose.draft)'
  },
  {
    id: 'conn-embed',
    name: 'Website Chat Embed',
    badge: 'Ready to Customize',
    badgeVariant: 'is-ready',
    summary:
      'Lightweight script tag embedding workspace-scoped RAG chat onto SMB marketing sites or client portals.',
    endpoint: 'GET /embed/aurelia-widget.js'
  }
];

export const DEFAULT_EMBED_CONFIG = {
  workspaceTitle: 'Aurelia Assistant',
  workspaceId: 'sales-proposals',
  accentColor: '#0f766e',
  welcomeMessage: 'Hello! Ask about our services, pricing tiers, or book an onboarding call.',
  position: 'bottom-right'
};

export const ACTIVITY_FEED_SEED = [
  {
    id: 'act-1',
    title: 'Grounded proposal checklist synthesized from 3 attached files',
    meta: 'Sales & B2B Proposals · OpenAI GPT-4.1 · 1.18s',
    badge: 'Cited RAG',
    badgeVariant: 'is-configured'
  },
  {
    id: 'act-2',
    title: 'Harborview Dental Group moved to Booked ($14,400)',
    meta: 'Local CRM · Website Chat Embed source',
    badge: 'CRM Record',
    badgeVariant: 'is-ready'
  },
  {
    id: 'act-3',
    title: 'SOP-to-Checklist Converter validated via Ollama Local',
    meta: 'Operations & SOPs · 0 outbound tokens · Air-gapped',
    badge: 'Local Privacy',
    badgeVariant: 'is-sample'
  },
  {
    id: 'act-4',
    title: 'HubSpot bounded contact preview ready (25 / 50 / 100 slices)',
    meta: 'Connections · Explicit operator import gate',
    badge: 'Bounded Sync',
    badgeVariant: 'is-configured'
  }
];
