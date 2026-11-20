/**
 * Aurelia AI — Pure HTML View Renderers & Inline SVG Icon Library
 * Zero raw OS emojis; zero external templating dependencies.
 */

import {
  WORKSPACES,
  OVERVIEW_TEMPLATES,
  WORKFLOWS,
  LLM_PROVIDERS,
  VECTOR_DBS,
  DRIVE_FOLDERS,
  HUBSPOT_SAMPLE_CONTACTS,
  CHANNELS_STATUS
} from './data.js';
import {
  renderOverviewCoverageRingSvg,
  renderOverviewWeeklyQueriesSvg,
  renderCrmPipelineChartSvg
} from './charts.js';

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString('en-US')}`;
}

export function iconSvg(name, size = 16) {
  const s = Number(size) || 16;
  const base = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;

  const paths = {
    'file-text':
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    calendar:
      '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    checklist:
      '<path d="M11 6h9M11 12h9M11 18h9"/><path d="m3 6 2 2 4-4M3 12l2 2 4-4M3 18l2 2 4-4"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    arrowDown: '<path d="M12 5v14M5 12l7 7 7-7"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M20 15h2M9 2v2M9 20v2M2 9h2M20 9h2"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    folder:
      '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    refresh:
      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    sliders:
      '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'
  };

  return `<svg ${base}>${paths[name] || paths['file-text']}</svg>`;
}

export function getActiveWorkspace(state) {
  return WORKSPACES.find((w) => w.id === state.activeWorkspaceId) || WORKSPACES[0];
}

export function getWorkspaceDocuments(state, workspaceId = state.activeWorkspaceId) {
  return state.documents.filter((d) => d.workspaceId === workspaceId);
}

export function getActiveProvider(state) {
  const cfg = state.workspaceProviders[state.activeWorkspaceId];
  return LLM_PROVIDERS.find((p) => p.id === cfg?.providerId) || LLM_PROVIDERS[0];
}

export function getActiveVectorDb(state) {
  const cfg = state.workspaceProviders[state.activeWorkspaceId];
  return VECTOR_DBS.find((v) => v.id === cfg?.vectorDbId) || VECTOR_DBS[0];
}

export function compileMcpConfigJson(mcpServers) {
  const mcpServersMap = {};
  for (const srv of mcpServers) {
    if (!srv.enabled) continue;
    const entry = {
      command: srv.command,
      args: srv.args
    };
    if (srv.env && Object.keys(srv.env).length > 0) {
      entry.env = srv.env;
    }
    mcpServersMap[srv.name.toLowerCase()] = entry;
  }
  return JSON.stringify({ mcpServers: mcpServersMap }, null, 2);
}

export function buildEmbedSnippet(embedConfig) {
  const title = (embedConfig.workspaceTitle || 'Aurelia Assistant').replace(/"/g, '&quot;');
  const welcome = (embedConfig.welcomeMessage || '').replace(/"/g, '&quot;');
  const accent = embedConfig.accentColor || '#0f766e';
  const pos = embedConfig.position === 'bottom-left' ? 'bottom-left' : 'bottom-right';
  const wsId = embedConfig.workspaceId || 'sales-proposals';

  return `<script
  src="https://your-aurelia-host.example/embed/aurelia-widget.js"
  data-workspace="${wsId}"
  data-title="${title}"
  data-accent="${accent}"
  data-position="${pos}"
  data-welcome="${welcome}"
  defer
></script>`;
}

/**
 * View 1: Overview (#view=overview)
 */
export function renderOverviewView(state) {
  const ws = getActiveWorkspace(state);
  const wsDocs = getWorkspaceDocuments(state);
  const attachedDocs = wsDocs.filter((d) => d.attached);
  const attachedChunks = attachedDocs.reduce((sum, d) => sum + d.chunks, 0);
  const provider = getActiveProvider(state);
  const vectorDb = getActiveVectorDb(state);

  const enabledSkills = state.skills.filter((s) => s.enabled).length;
  const enabledMcp = state.mcpServers.filter((m) => m.enabled).length;
  const pipelineTotal = state.crmLeads.reduce((sum, l) => sum + Number(l.value || 0), 0);
  const weeklyTotal = ws.weeklyQueries.reduce((a, b) => a + b, 0);

  const templatesHtml = OVERVIEW_TEMPLATES.map((tpl) => {
    const targetWs = WORKSPACES.find((w) => w.id === tpl.workspaceId);
    return `
      <article class="template-card">
        <div class="template-card-head">
          <span class="template-icon">${iconSvg(tpl.icon, 18)}</span>
          <span class="status-badge is-configured">${escapeHtml(tpl.category)}</span>
        </div>
        <h5>${escapeHtml(tpl.title)}</h5>
        <p>${escapeHtml(tpl.description)}</p>
        <div class="template-card-footer">
          <span class="status-badge is-sample">${escapeHtml(targetWs?.shortName || 'Workspace')}</span>
          <button
            type="button"
            class="btn btn-secondary"
            data-run-template="${escapeHtml(tpl.id)}"
          >
            Run in AI Chat
            ${iconSvg('arrowRight', 14)}
          </button>
        </div>
      </article>
    `;
  }).join('');

  const activityHtml = state.activityFeed
    .map(
      (item) => `
      <li class="activity-item">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.meta)}</span>
        </div>
        <span class="status-badge ${escapeHtml(item.badgeVariant)}">${escapeHtml(item.badge)}</span>
      </li>
    `
    )
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Executive Workspace Overview — ${escapeHtml(ws.name)}</h3>
          <p>${escapeHtml(ws.description)}</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge is-sample">${escapeHtml(ws.industryTag)}</span>
          <button type="button" class="btn btn-primary" data-jump-view="chat">
            Open AI Chat
            ${iconSvg('arrowRight', 14)}
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <article class="kpi-card">
          <span class="kpi-label">Attached Knowledge Docs</span>
          <strong class="kpi-value tabular-nums">${attachedDocs.length} / ${wsDocs.length}</strong>
          <span class="kpi-meta">${attachedChunks} active chunks · ${state.documents.filter((d) => d.attached).length}/16 total</span>
        </article>
        <article class="kpi-card">
          <span class="kpi-label">Model Routing Target</span>
          <strong class="kpi-value">${escapeHtml(provider.name)}</strong>
          <span class="kpi-meta">${escapeHtml(provider.routing)} · ${escapeHtml(vectorDb.name)}</span>
        </article>
        <article class="kpi-card">
          <span class="kpi-label">Flows, Skills &amp; MCP</span>
          <strong class="kpi-value tabular-nums">${WORKFLOWS.length} · ${enabledSkills}/8 · ${enabledMcp}/4</strong>
          <span class="kpi-meta">Visual pipelines &amp; scoped server tools</span>
        </article>
        <article class="kpi-card">
          <span class="kpi-label">Local CRM Pipeline</span>
          <strong class="kpi-value tabular-nums">${formatCurrency(pipelineTotal)}</strong>
          <span class="kpi-meta">${state.crmLeads.length} active SMB &amp; enterprise records</span>
        </article>
      </div>

      <div class="overview-split">
        <article class="panel-card">
          <div class="panel-head">
            <h4>7-Day Workspace Query Telemetry</h4>
            <span class="panel-readout tabular-nums">${weeklyTotal} grounded runs · ${ws.retrievalPrecision}% precision</span>
          </div>
          ${renderOverviewWeeklyQueriesSvg(ws.weeklyQueries, ws.name)}
        </article>

        <article class="panel-card">
          <div class="panel-head">
            <h4>Knowledge Coverage &amp; Vector Grounding</h4>
            <span class="panel-readout">${escapeHtml(vectorDb.name)}</span>
          </div>
          ${renderOverviewCoverageRingSvg(attachedDocs.length, wsDocs.length, attachedChunks)}
        </article>
      </div>

      <article class="panel-card">
        <div class="panel-head">
          <h4>Business Task Prompt Templates</h4>
          <span class="panel-readout">Click any template to launch grounded AI Chat</span>
        </div>
        <div class="template-grid">
          ${templatesHtml}
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-head">
          <h4>Recent Workspace Activity</h4>
          <span class="panel-readout">Deterministic audit stream</span>
        </div>
        <ul class="activity-list">
          ${activityHtml}
        </ul>
      </article>
    </div>
  `;
}

/**
 * View 2: AI Chat & Grounded Context (#view=chat)
 */
export function renderChatView(state) {
  const ws = getActiveWorkspace(state);
  const wsDocs = getWorkspaceDocuments(state);
  const attachedDocs = wsDocs.filter((d) => d.attached);
  const provider = getActiveProvider(state);
  const messages = state.chatsByWorkspace[ws.id] || [];

  const threadHtml = messages
    .map((msg) => {
      const isUser = msg.role === 'user';
      const citedDocs = (msg.citations || [])
        .map((id) => state.documents.find((d) => d.id === id))
        .filter(Boolean);

      const citationsHtml =
        !isUser && citedDocs.length > 0
          ? `<div class="citation-list">
              ${citedDocs
                .map((doc) => {
                  const isOpen =
                    state.expandedCitation &&
                    state.expandedCitation.messageId === msg.id &&
                    state.expandedCitation.docId === doc.id;
                  return `
                    <button
                      type="button"
                      class="citation-chip"
                      data-cite-msg="${escapeHtml(msg.id)}"
                      data-cite-doc="${escapeHtml(doc.id)}"
                      aria-expanded="${isOpen ? 'true' : 'false'}"
                    >
                      ${iconSvg('file-text', 13)}
                      <span>${escapeHtml(doc.title)}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>`
          : '';

      let excerptHtml = '';
      if (
        !isUser &&
        state.expandedCitation &&
        state.expandedCitation.messageId === msg.id
      ) {
        const activeDoc = state.documents.find((d) => d.id === state.expandedCitation.docId);
        if (activeDoc) {
          excerptHtml = `
            <div class="citation-excerpt" role="region" aria-label="Cited document excerpt">
              <strong>Source Chunk: ${escapeHtml(activeDoc.title)}</strong>
              (${escapeHtml(activeDoc.type)} · ${activeDoc.chunks} indexed chunks · ${activeDoc.attached ? 'Attached' : 'Currently Detached'})<br />
              ${escapeHtml(activeDoc.excerpt)}
            </div>
          `;
        }
      }

      return `
        <article class="chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}">
          <div class="chat-message-meta">
            <span>${escapeHtml(msg.author)}</span>
            <span class="tabular-nums">${escapeHtml(msg.timestamp)}${msg.modelLabel ? ` · ${escapeHtml(msg.modelLabel)} · ${msg.latencyMs}ms` : ''}</span>
          </div>
          <div class="chat-message-body">${escapeHtml(msg.text)}</div>
          ${citationsHtml}
          ${excerptHtml}
        </article>
      `;
    })
    .join('');

  const suggestionsHtml = ws.suggestedPrompts
    .map(
      (prompt, idx) => `
      <button type="button" class="prompt-chip" data-suggested-prompt="${idx}">
        ${iconSvg('message', 13)}
        <span>${escapeHtml(prompt)}</span>
      </button>
    `
    )
    .join('');

  const docsHtml = wsDocs
    .map(
      (doc) => `
      <label class="doc-item ${doc.attached ? 'is-attached' : ''}">
        <div class="doc-item-info">
          <strong>${escapeHtml(doc.title)}</strong>
          <span>${escapeHtml(doc.type)} · ${escapeHtml(doc.size)} · ${doc.chunks} chunks</span>
        </div>
        <div class="filter-group">
          <span class="status-badge ${doc.attached ? 'is-ready' : 'is-sample'}">${doc.attached ? 'Attached' : 'Library'}</span>
          <input
            type="checkbox"
            data-toggle-doc="${escapeHtml(doc.id)}"
            aria-label="Attach ${escapeHtml(doc.title)} to workspace context"
            ${doc.attached ? 'checked' : ''}
            style="width:18px;height:18px;accent-color:var(--accent);cursor:pointer;"
          />
        </div>
      </label>
    `
    )
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Grounded AI Chat — ${escapeHtml(ws.name)}</h3>
          <p>Responses cite only documents currently attached in the Workspace Context panel.</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge is-configured">${escapeHtml(provider.name)}</span>
          <span class="status-badge ${attachedDocs.length > 0 ? 'is-ready' : 'is-warning'} tabular-nums">
            ${attachedDocs.length} / ${wsDocs.length} Docs Grounded
          </span>
        </div>
      </div>

      <div class="chat-greeting-card">
        <h2>Good evening, Annoris. What would you like to automate today?</h2>
        <p>Document-grounded AI workspace connected to ${escapeHtml(ws.name)} (${attachedDocs.length} attached docs · ${escapeHtml(provider.name)} · pgvector retrieval).</p>
      </div>

      <div class="chat-workspace-grid">
        <section class="chat-panel" aria-label="Grounded workspace conversation">
          <div class="panel-head">
            <h4>Workspace Conversation Thread</h4>
            <span class="panel-readout">Click citation chips to inspect verified source chunks</span>
          </div>

          <div class="chat-thread" id="chat-thread">
            ${threadHtml}
          </div>

          <div class="prompt-suggestions" aria-label="Suggested prompts">
            ${suggestionsHtml}
          </div>

          <form class="chat-composer chat-composer-floating" id="chat-composer-form">
            <label class="sr-only" for="chat-prompt-input">Ask a grounded question for ${escapeHtml(ws.name)}</label>
            <textarea
              id="chat-prompt-input"
              class="chat-textarea"
              rows="2"
              placeholder="Send a message or type '/' for agent commands..."
            ></textarea>
            <div class="composer-toolbar">
              <div class="composer-actions-group">
                <button type="button" class="composer-action-btn" id="composer-attach-btn" title="Manage documents">
                  ${iconSvg('file-text', 14)}
                </button>
                <button type="button" class="composer-action-btn" title="Agent commands">
                  <span style="font-weight:700;font-size:13px;color:var(--accent);">/</span>
                </button>
                <button type="button" class="composer-action-btn" id="composer-mic-btn" title="Voice input">
                  ${iconSvg('activity', 13)}
                </button>
              </div>
              <button type="submit" class="btn-send" id="chat-send-btn" title="Send message">
                ${iconSvg('send', 15)}
              </button>
            </div>
          </form>
        </section>

        <aside class="context-panel" aria-label="Workspace document context">
          <div class="panel-head">
            <h4>Workspace Context</h4>
            <span class="panel-readout tabular-nums">${attachedDocs.length}/${wsDocs.length} attached</span>
          </div>
          <p class="text-muted" style="font-size:12.5px;">
            Toggle documents below to test how Aurelia restricts citations strictly to attached files.
          </p>

          <div class="filter-group">
            <button type="button" class="filter-chip" data-docs-bulk="attach">Attach All</button>
            <button type="button" class="filter-chip" data-docs-bulk="detach">Detach All (Test Zero Context)</button>
          </div>

          <div class="doc-list">
            ${docsHtml}
          </div>
        </aside>
      </div>
    </div>
  `;
}

/**
 * Helper to build dynamic structured output for a workflow run.
 */
export function buildFlowConsoleState(state, flow) {
  const configs = state.workflowConfigs[flow.id] || {};
  const runState = state.flowRuns[flow.id] || { status: 'idle', logs: [], outputText: '' };

  const node1Cfg = configs['node-1'] || {};
  const node2Cfg = configs['node-2'] || {};
  const node3Cfg = configs['node-3'] || {};
  const node4Cfg = configs['node-4'] || {};
  const node5Cfg = configs['node-5'] || {};

  const logsText = (runState.logs || []).join('\n');
  const structuredJson = JSON.stringify(
    {
      workflow: flow.name,
      status: runState.status === 'completed' ? 'completed' : 'preview',
      totalLatencyMs: flow.nodes.reduce((s, n) => s + n.latencyMs, 0),
      totalTokens: flow.nodes.reduce((s, n) => s + n.tokens, 0),
      inputs: node1Cfg,
      retrieval: node2Cfg,
      reasoning: node3Cfg,
      action: node4Cfg,
      output: node5Cfg
    },
    null,
    2
  );

  return { logsText, structuredJson, runState };
}

/**
 * Partial renderer for the Workflow Console so typing in inspector inputs never loses focus.
 */
export function renderFlowConsoleHtml(state, flow) {
  const { logsText, structuredJson, runState } = buildFlowConsoleState(state, flow);
  const badgeClass =
    runState.status === 'completed'
      ? 'is-ready'
      : runState.status === 'running'
        ? 'is-sample'
        : 'is-configured';
  const badgeText =
    runState.status === 'completed'
      ? `Completed (${runState.durationMs}ms)`
      : runState.status === 'running'
        ? 'Running Step Trace...'
        : 'Ready';

  return `
    <div class="panel-head">
      <h4>Execution Trace &amp; Output</h4>
      <span class="status-badge ${badgeClass}">${badgeText}</span>
    </div>
    <pre class="flow-console">${escapeHtml(logsText)}\n\n--- STRUCTURED OUTPUT PREVIEW ---\n${escapeHtml(structuredJson)}</pre>
  `;
}

/**
 * View 3: Visual Agent Flows (#view=workflows)
 */
export function renderWorkflowsView(state) {
  const flow = WORKFLOWS.find((f) => f.id === state.selectedFlowId) || WORKFLOWS[0];
  const selectedNode = flow.nodes.find((n) => n.id === state.selectedNodeId) || flow.nodes[0];
  const runState = state.flowRuns[flow.id] || { status: 'idle', runningNodeIndex: -1 };
  const nodeConfig = state.workflowConfigs[flow.id]?.[selectedNode.id] || selectedNode.defaultConfig;

  const presetsHtml = WORKFLOWS.map((f) => {
    const active = f.id === flow.id;
    return `
      <button
        type="button"
        class="flow-preset-btn ${active ? 'is-active' : ''}"
        data-flow-id="${escapeHtml(f.id)}"
        aria-pressed="${active ? 'true' : 'false'}"
      >
        <strong>${escapeHtml(f.name)}</strong>
        <span>${escapeHtml(f.triggerLabel)}</span>
      </button>
    `;
  }).join('');

  const pipelineHtml = flow.nodes
    .map((node, index) => {
      const isSelected = node.id === selectedNode.id;
      const isRunning = runState.status === 'running' && runState.runningNodeIndex === index;
      const isDone =
        runState.status === 'completed' ||
        (runState.status === 'running' && runState.runningNodeIndex > index);

      const connector =
        index < flow.nodes.length - 1
          ? `<div class="flow-connector" aria-hidden="true">${iconSvg('arrowDown', 16)}</div>`
          : '';

      return `
        <button
          type="button"
          class="flow-node ${isSelected ? 'is-selected' : ''} ${isRunning ? 'is-running' : ''}"
          data-node-id="${escapeHtml(node.id)}"
        >
          <div class="flow-node-top">
            <span class="flow-node-type">${index + 1}. ${escapeHtml(node.type)}</span>
            <span class="status-badge ${isRunning ? 'is-sample' : isDone ? 'is-ready' : 'is-configured'} tabular-nums">
              ${isRunning ? 'Executing' : isDone ? `Done · ${node.latencyMs}ms` : `${node.latencyMs}ms · ${node.tokens} tok`}
            </span>
          </div>
          <strong>${escapeHtml(node.title)}</strong>
          <span class="text-muted" style="font-size:12.5px;">${escapeHtml(node.subtitle)}</span>
        </button>
        ${connector}
      `;
    })
    .join('');

  const fieldsHtml = Object.entries(nodeConfig)
    .map(
      ([key, value]) => `
      <div class="inspector-field">
        <label for="flow-field-${escapeHtml(key)}">${escapeHtml(key)}</label>
        <input
          id="flow-field-${escapeHtml(key)}"
          type="text"
          class="text-input"
          data-flow-input="${escapeHtml(key)}"
          value="${escapeHtml(value)}"
        />
      </div>
    `
    )
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Visual Agent Flows — ${escapeHtml(flow.name)}</h3>
          <p>${escapeHtml(flow.summary)}</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge is-sample">5 Connected Nodes</span>
          <button
            type="button"
            class="btn btn-primary"
            id="run-flow-btn"
            ${runState.status === 'running' ? 'disabled' : ''}
          >
            ${iconSvg('play', 14)}
            <span>${runState.status === 'running' ? 'Simulating Run...' : 'Simulate Flow Run'}</span>
          </button>
        </div>
      </div>

      <div class="workflow-builder-grid">
        <aside class="flow-palette" aria-label="Workflow presets">
          <div class="panel-head">
            <h4>Agent Presets</h4>
            <span class="panel-readout">4 flows</span>
          </div>
          ${presetsHtml}
        </aside>

        <section class="flow-canvas" aria-label="Visual pipeline nodes">
          <div class="panel-head">
            <h4>Pipeline Canvas</h4>
            <span class="panel-readout">Click any node to edit variables</span>
          </div>
          <div class="flow-pipeline">
            ${pipelineHtml}
          </div>
        </section>

        <aside class="flow-inspector" aria-label="Node inspector and trace console">
          <div class="panel-head">
            <h4>Node Inspector</h4>
            <span class="status-badge is-configured">${escapeHtml(selectedNode.type)}</span>
          </div>
          <p class="text-muted" style="font-size:12.5px;">
            Editing <strong>${escapeHtml(selectedNode.title)}</strong> updates the live execution payload below.
          </p>
          ${fieldsHtml}
          <div id="flow-console-region" class="view-stack" style="gap:10px;margin-top:6px;">
            ${renderFlowConsoleHtml(state, flow)}
          </div>
        </aside>
      </div>
    </div>
  `;
}

/**
 * View 4: Agents, Models, Skills & MCP (#view=agents)
 */
export function renderAgentsView(state) {
  const ws = getActiveWorkspace(state);
  const activeProvider = getActiveProvider(state);
  const activeVectorDb = getActiveVectorDb(state);
  const compiledJson = compileMcpConfigJson(state.mcpServers);
  const enabledSkillsCount = state.skills.filter((s) => s.enabled).length;
  const enabledMcpCount = state.mcpServers.filter((m) => m.enabled).length;

  const providersHtml = LLM_PROVIDERS.map((p) => {
    const selected = p.id === activeProvider.id;
    const isLocal = p.routing.toLowerCase().includes('local');
    return `
      <button
        type="button"
        class="provider-card ${selected ? 'is-selected' : ''}"
        data-provider-id="${escapeHtml(p.id)}"
        aria-pressed="${selected ? 'true' : 'false'}"
      >
        <div class="panel-head">
          <strong>${escapeHtml(p.name)}</strong>
          <span class="status-badge ${isLocal ? 'is-sample' : 'is-configured'}">${escapeHtml(p.routing)}</span>
        </div>
        <p class="text-muted" style="font-size:12.5px;">${escapeHtml(p.description)}</p>
        <div class="tool-chip-list">
          <span class="tool-chip">${escapeHtml(p.latency)}</span>
          <span class="tool-chip">${escapeHtml(p.contextWindow)}</span>
          <span class="tool-chip">${escapeHtml(p.privacyTier)}</span>
        </div>
      </button>
    `;
  }).join('');

  const vectorsHtml = VECTOR_DBS.map((v) => {
    const selected = v.id === activeVectorDb.id;
    return `
      <button
        type="button"
        class="provider-card ${selected ? 'is-selected' : ''}"
        data-vector-id="${escapeHtml(v.id)}"
        aria-pressed="${selected ? 'true' : 'false'}"
      >
        <div class="panel-head">
          <strong>${escapeHtml(v.name)}</strong>
          <span class="status-badge ${selected ? 'is-ready' : 'is-configured'}">${escapeHtml(v.mode)}</span>
        </div>
        <p class="text-muted" style="font-size:12.5px;">${escapeHtml(v.description)}</p>
      </button>
    `;
  }).join('');

  const skillsHtml = state.skills
    .map(
      (sk) => `
      <article class="skill-card">
        <div style="display:grid;gap:4px;min-width:0;">
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
            <strong style="font-size:13.5px;">${escapeHtml(sk.name)}</strong>
            <span class="status-badge is-sample">${escapeHtml(sk.permission)}</span>
          </div>
          <p class="text-muted" style="font-size:12px;line-height:1.4;">${escapeHtml(sk.description)}</p>
          <div class="tool-chip-list">
            ${sk.tools.map((t) => `<span class="tool-chip">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <button
          type="button"
          class="toggle-switch"
          data-skill-id="${escapeHtml(sk.id)}"
          aria-pressed="${sk.enabled ? 'true' : 'false'}"
          aria-label="Toggle ${escapeHtml(sk.name)}"
        >
          ${sk.enabled ? 'ON' : 'OFF'}
        </button>
      </article>
    `
    )
    .join('');

  const mcpHtml = state.mcpServers
    .map(
      (srv) => `
      <article class="mcp-card" style="display:grid;gap:10px;">
        <div class="panel-head">
          <div style="display:flex;align-items:center;gap:8px;">
            <strong>${escapeHtml(srv.name)}</strong>
            <span class="status-badge ${srv.enabled ? 'is-ready' : 'is-warning'}">${srv.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <button
            type="button"
            class="toggle-switch"
            data-mcp-id="${escapeHtml(srv.id)}"
            aria-pressed="${srv.enabled ? 'true' : 'false'}"
            aria-label="Toggle ${escapeHtml(srv.name)} MCP server"
          >
            ${srv.enabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <p class="text-muted" style="font-size:12.5px;">${escapeHtml(srv.description)}</p>
        <div class="tool-chip-list">
          <span class="tool-chip">${escapeHtml(srv.scope)}</span>
        </div>
      </article>
    `
    )
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Agents, Model Routing &amp; MCP Tools</h3>
          <p>Active workspace <strong>${escapeHtml(ws.name)}</strong> uses <strong>${escapeHtml(activeProvider.name)}</strong> (${escapeHtml(activeProvider.routing)}) + <strong>${escapeHtml(activeVectorDb.name)}</strong>.</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge ${activeProvider.routing.includes('Local') ? 'is-sample' : 'is-configured'}">
            ${escapeHtml(activeProvider.routing)}
          </span>
          <span class="status-badge is-ready tabular-nums">${enabledSkillsCount}/8 Skills · ${enabledMcpCount}/4 MCP</span>
        </div>
      </div>

      <article class="panel-card">
        <div class="panel-head">
          <h4>LLM Provider Adapters (Cloud API vs. Self-Hosted Local Privacy)</h4>
          <span class="panel-readout">Updates sidebar target live</span>
        </div>
        <div class="provider-grid">
          ${providersHtml}
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-head">
          <h4>Vector Database Engine</h4>
          <span class="panel-readout">Tier 02 Workspace Retrieval Store</span>
        </div>
        <div class="provider-grid">
          ${vectorsHtml}
        </div>
      </article>

      <article class="panel-card" id="agents-skills-panel">
        <div class="panel-head">
          <h4>Agent Skills &amp; Permission Guardrails</h4>
          <span class="panel-readout tabular-nums">${enabledSkillsCount} of ${state.skills.length} active</span>
        </div>
        <div class="skills-grid">
          ${skillsHtml}
        </div>
      </article>

      <div class="embed-grid" id="agents-mcp-section">
        <article class="panel-card">
          <div class="panel-head">
            <h4>MCP Server Integrations</h4>
            <span class="panel-readout tabular-nums">${enabledMcpCount} of ${state.mcpServers.length} compiled</span>
          </div>
          <div class="mcp-grid">
            ${mcpHtml}
          </div>
        </article>

        <div class="code-card">
          <div class="code-card-head">
            <span>Live Compiled aurelia_mcp_servers.json</span>
            <button
              type="button"
              class="copy-btn"
              data-copy-btn
              data-copy-text="${escapeHtml(compiledJson)}"
            >
              ${iconSvg('copy', 13)}
              <span>Copy JSON</span>
            </button>
          </div>
          <pre><code>${escapeHtml(compiledJson)}</code></pre>
        </div>
      </div>
    </div>
  `;
}

/**
 * Helper to filter and sort CRM leads consistently.
 */
export function getFilteredCrmLeads(state) {
  const q = (state.crmSearch || '').trim().toLowerCase();
  const stage = state.crmStageFilter || 'All';
  const { key, dir } = state.crmSort;

  const filtered = state.crmLeads.filter((lead) => {
    if (stage !== 'All' && lead.stage !== stage) return false;
    if (!q) return true;
    const blob = `${lead.company} ${lead.industry} ${lead.contactName} ${lead.notes} ${lead.stage}`.toLowerCase();
    return blob.includes(q);
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (key === 'value') {
      cmp = Number(a.value) - Number(b.value);
    } else {
      cmp = String(a[key] || '').localeCompare(String(b[key] || ''));
    }
    return dir === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

function getStageBadgeClass(stage) {
  switch (stage) {
    case 'Won':
      return 'is-ready';
    case 'Booked':
      return 'is-configured';
    case 'Proposal Sent':
      return 'is-sample';
    case 'Follow-Up':
      return 'is-warning';
    default:
      return 'is-configured';
  }
}

/**
 * Partial renderer for CRM KPIs, chart, and table so typing in #crm-search-input keeps focus.
 */
export function renderCrmResultsRegion(state) {
  const leads = state.crmLeads;
  const filtered = getFilteredCrmLeads(state);
  const totalPipeline = leads.reduce((s, l) => s + Number(l.value || 0), 0);
  const wonAndBooked = leads
    .filter((l) => l.stage === 'Won' || l.stage === 'Booked')
    .reduce((s, l) => s + Number(l.value || 0), 0);
  const avgValue = leads.length > 0 ? Math.round(totalPipeline / leads.length) : 0;

  const sortIndicator = (colKey) => {
    if (state.crmSort.key !== colKey) return '';
    return state.crmSort.dir === 'asc' ? ' (Asc)' : ' (Desc)';
  };

  const rowsHtml =
    filtered.length > 0
      ? filtered
          .map(
            (lead) => `
          <tr>
            <td>
              <strong>${escapeHtml(lead.company)}</strong><br />
              <span class="text-muted" style="font-size:12px;">${escapeHtml(lead.industry)}</span>
            </td>
            <td>
              <strong>${escapeHtml(lead.contactName)}</strong><br />
              <span class="text-muted" style="font-size:12px;">${escapeHtml(lead.contactRole)}</span>
            </td>
            <td>
              <span class="status-badge ${getStageBadgeClass(lead.stage)}">${escapeHtml(lead.stage)}</span>
            </td>
            <td class="tabular-nums"><strong>${formatCurrency(lead.value)}</strong></td>
            <td class="tabular-nums">${escapeHtml(lead.nextAppointment)}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary"
                data-inspect-lead="${escapeHtml(lead.id)}"
              >
                Inspect &amp; Draft
              </button>
            </td>
          </tr>
        `
          )
          .join('')
      : `
        <tr>
          <td colspan="6" style="text-align:center;padding:24px;">
            <p class="text-muted" style="margin-bottom:10px;">No CRM records match your current search or stage filter.</p>
            <button type="button" class="btn btn-secondary" id="crm-clear-filters-btn">Clear Filters</button>
          </td>
        </tr>
      `;

  return `
    <div class="kpi-grid">
      <article class="kpi-card">
        <span class="kpi-label">Total Pipeline Value</span>
        <strong class="kpi-value tabular-nums">${formatCurrency(totalPipeline)}</strong>
        <span class="kpi-meta">${leads.length} local multi-industry leads</span>
      </article>
      <article class="kpi-card">
        <span class="kpi-label">Booked &amp; Won Value</span>
        <strong class="kpi-value tabular-nums">${formatCurrency(wonAndBooked)}</strong>
        <span class="kpi-meta">${leads.filter((l) => l.stage === 'Won' || l.stage === 'Booked').length} confirmed commitments</span>
      </article>
      <article class="kpi-card">
        <span class="kpi-label">Filtered Matches</span>
        <strong class="kpi-value tabular-nums">${filtered.length} / ${leads.length}</strong>
        <span class="kpi-meta">Stage: ${escapeHtml(state.crmStageFilter)}</span>
      </article>
      <article class="kpi-card">
        <span class="kpi-label">Average Deal Scope</span>
        <strong class="kpi-value tabular-nums">${formatCurrency(avgValue)}</strong>
        <span class="kpi-meta">Annualized SMB &amp; mid-market value</span>
      </article>
    </div>

    <article class="panel-card">
      <div class="panel-head">
        <h4>Pipeline Value Breakdown by Stage</h4>
        <span class="panel-readout">Updates live when lead stages change</span>
      </div>
      ${renderCrmPipelineChartSvg(leads)}
    </article>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <button type="button" class="filter-chip" data-crm-sort="company">
                Company &amp; Industry${sortIndicator('company')}
              </button>
            </th>
            <th>Contact</th>
            <th>
              <button type="button" class="filter-chip" data-crm-sort="stage">
                Stage${sortIndicator('stage')}
              </button>
            </th>
            <th>
              <button type="button" class="filter-chip" data-crm-sort="value">
                Value${sortIndicator('value')}
              </button>
            </th>
            <th>
              <button type="button" class="filter-chip" data-crm-sort="nextAppointment">
                Next Appointment${sortIndicator('nextAppointment')}
              </button>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * View 5: Local CRM (#view=crm)
 */
export function renderCrmView(state) {
  const stages = ['All', 'Qualified', 'Proposal Sent', 'Booked', 'Won', 'Follow-Up'];
  const chipsHtml = stages
    .map((stage) => {
      const active = state.crmStageFilter === stage;
      return `
        <button
          type="button"
          class="filter-chip ${active ? 'is-active' : ''}"
          data-stage-filter="${escapeHtml(stage)}"
          aria-pressed="${active ? 'true' : 'false'}"
        >
          ${escapeHtml(stage)}
        </button>
      `;
    })
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Local Business CRM — Leads, Appointments &amp; Quotes</h3>
          <p>Inspect multi-industry SMB records, update pipeline stages, and generate draft-only follow-ups.</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge is-sample tabular-nums">${state.crmLeads.length} Sample Records</span>
          <span class="status-badge is-configured">Local SQLite / Prisma Schema</span>
        </div>
      </div>

      <div class="filter-bar">
        <div style="flex:1 1 260px;max-width:420px;position:relative;">
          <label class="sr-only" for="crm-search-input">Search CRM leads</label>
          <input
            type="search"
            id="crm-search-input"
            class="text-input"
            value="${escapeHtml(state.crmSearch)}"
            placeholder="Search company, industry, contact, or notes..."
          />
        </div>
        <div class="filter-group" role="group" aria-label="Filter CRM by stage">
          ${chipsHtml}
        </div>
      </div>

      <div id="crm-results-region" class="view-stack">
        ${renderCrmResultsRegion(state)}
      </div>
    </div>
  `;
}

/**
 * Lead Inspection & AI Follow-Up Modal Body (#lead-modal-body)
 */
export function renderLeadModalBody(state) {
  if (!state.activeLeadModal) return '';
  const lead = state.crmLeads.find((l) => l.id === state.activeLeadModal.leadId);
  if (!lead) return '';

  const stages = ['Qualified', 'Proposal Sent', 'Booked', 'Won', 'Follow-Up'];
  const stageOptions = stages
    .map(
      (st) =>
        `<option value="${escapeHtml(st)}" ${lead.stage === st ? 'selected' : ''}>${escapeHtml(st)}</option>`
    )
    .join('');

  const draftText = state.activeLeadModal.draftText;

  return `
    <div class="dialog-meta-grid">
      <div class="dialog-meta-cell">
        <span>Company</span>
        <strong>${escapeHtml(lead.company)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Industry</span>
        <strong>${escapeHtml(lead.industry)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Primary Contact</span>
        <strong>${escapeHtml(lead.contactName)} (${escapeHtml(lead.contactRole)})</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Contact Details</span>
        <strong>${escapeHtml(lead.email)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Estimated Value</span>
        <strong class="tabular-nums">${formatCurrency(lead.value)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Next Appointment</span>
        <strong class="tabular-nums">${escapeHtml(lead.nextAppointment)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Channel Source</span>
        <strong>${escapeHtml(lead.source)}</strong>
      </div>
      <div class="dialog-meta-cell">
        <span>Account Owner</span>
        <strong>${escapeHtml(lead.owner)} · Last touch ${escapeHtml(lead.lastTouch)}</strong>
      </div>
    </div>

    <div class="inspector-field">
      <label for="modal-lead-stage">Pipeline Stage (updates CRM table &amp; chart live)</label>
      <select id="modal-lead-stage" class="select-input" data-modal-lead-id="${escapeHtml(lead.id)}">
        ${stageOptions}
      </select>
    </div>

    <div class="panel-card" style="padding:12px;">
      <div class="panel-head">
        <h4>Operator Intake Notes</h4>
        <span class="status-badge ${getStageBadgeClass(lead.stage)}">${escapeHtml(lead.stage)}</span>
      </div>
      <p class="text-muted" style="font-size:13px;">${escapeHtml(lead.notes)}</p>
    </div>

    <div class="panel-card" style="padding:14px;">
      <div class="panel-head">
        <h4>AI Follow-Up Message</h4>
        <span class="status-badge is-sample">Draft only — not sent</span>
      </div>
      <div class="draft-preview-box">${escapeHtml(draftText)}</div>
      <div class="view-header-actions">
        <button type="button" class="btn btn-secondary" id="modal-regenerate-draft">
          ${iconSvg('refresh', 14)}
          <span>Regenerate Draft</span>
        </button>
        <button
          type="button"
          class="copy-btn"
          id="modal-copy-draft-btn"
          data-copy-btn
          data-copy-text="${escapeHtml(draftText)}"
        >
          ${iconSvg('copy', 13)}
          <span>Copy Draft</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Partial renderer for Embed Live Preview + Script Snippet so typing never loses focus.
 */
export function renderEmbedPreviewAndCode(state) {
  const cfg = state.embedConfig;
  const snippet = buildEmbedSnippet(cfg);
  const ws = WORKSPACES.find((w) => w.id === cfg.workspaceId) || WORKSPACES[0];

  return `
    <div class="embed-preview-card">
      <div class="panel-head">
        <h4>Live Website Widget Mockup</h4>
        <span class="panel-readout">${escapeHtml(cfg.position)} · ${escapeHtml(ws.shortName)}</span>
      </div>
      <div class="embed-widget-mock" style="border-color:${escapeHtml(cfg.accentColor)};">
        <div class="panel-head" style="padding-bottom:8px;border-bottom:1px solid var(--border);">
          <strong style="display:inline-flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${escapeHtml(cfg.accentColor)};display:inline-block;"></span>
            ${escapeHtml(cfg.workspaceTitle)}
          </strong>
          <span class="status-badge is-ready">Grounded</span>
        </div>
        <p style="font-size:13px;line-height:1.5;color:var(--fg);">
          ${escapeHtml(cfg.welcomeMessage)}
        </p>
        <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;padding-top:4px;">
          <span class="text-muted" style="font-size:11.5px;">Workspace: ${escapeHtml(ws.name)}</span>
          <span class="status-badge is-configured" style="border-color:${escapeHtml(cfg.accentColor)};color:${escapeHtml(cfg.accentColor)};">Ask a question</span>
        </div>
      </div>
    </div>

    <div class="code-card">
      <div class="code-card-head">
        <span>Generated Embed &lt;script&gt; Tag</span>
        <button
          type="button"
          class="copy-btn"
          data-copy-btn
          data-copy-text="${escapeHtml(snippet)}"
        >
          ${iconSvg('copy', 13)}
          <span>Copy Snippet</span>
        </button>
      </div>
      <pre><code>${escapeHtml(snippet)}</code></pre>
    </div>
  `;
}

/**
 * View 6: Connections & Website Embed (#view=connections)
 */
export function renderConnectionsView(state) {
  const activeFolder =
    DRIVE_FOLDERS.find((f) => f.id === state.driveSelectedFolderId) || DRIVE_FOLDERS[0];
  const folderImported = state.driveImportedFolderIds.includes(activeFolder.id);

  const driveFolderTabs = DRIVE_FOLDERS.map((f) => {
    const active = f.id === activeFolder.id;
    return `
      <button
        type="button"
        class="filter-chip ${active ? 'is-active' : ''}"
        data-drive-folder="${escapeHtml(f.id)}"
        aria-pressed="${active ? 'true' : 'false'}"
      >
        ${iconSvg('folder', 13)}
        <span>${escapeHtml(f.name)}</span>
      </button>
    `;
  }).join('');

  const driveFilesRows = activeFolder.files
    .map(
      (file) => `
      <div class="doc-item ${folderImported ? 'is-attached' : ''}">
        <div class="doc-item-info">
          <strong>${escapeHtml(file.name)}</strong>
          <span>${escapeHtml(file.size)} · Modified ${escapeHtml(file.modified)}</span>
        </div>
        <span class="status-badge ${folderImported ? 'is-ready' : 'is-sample'}">
          ${folderImported ? 'Staged' : 'Browse Preview'}
        </span>
      </div>
    `
    )
    .join('');

  const batchSizes = [25, 50, 100];
  const batchButtons = batchSizes
    .map((sz) => {
      const active = state.hubspotBatchSize === sz;
      return `
        <button
          type="button"
          class="filter-chip ${active ? 'is-active' : ''}"
          data-hubspot-batch="${sz}"
          aria-pressed="${active ? 'true' : 'false'}"
        >
          ${sz} Contacts
        </button>
      `;
    })
    .join('');

  const previewSlice = HUBSPOT_SAMPLE_CONTACTS.slice(0, 3);
  const hubspotRowsHtml = previewSlice
    .map(
      (c) => `
      <tr>
        <td class="mono" style="font-size:11.5px;white-space:nowrap;">${escapeHtml(c.id)}</td>
        <td><strong>${escapeHtml(c.name)}</strong><br /><span class="text-muted" style="font-size:10.5px;">${escapeHtml(c.email)}</span></td>
        <td>${escapeHtml(c.company)}</td>
        <td><span class="status-badge is-configured">${escapeHtml(c.stage)}</span></td>
      </tr>
    `
    )
    .join('');

  const channelCardsHtml = CHANNELS_STATUS.map(
    (ch) => `
    <article class="connection-card">
      <div class="panel-head">
        <strong>${escapeHtml(ch.name)}</strong>
        <span class="status-badge ${escapeHtml(ch.badgeVariant)}">${escapeHtml(ch.badge)}</span>
      </div>
      <p class="text-muted" style="font-size:12.5px;">${escapeHtml(ch.summary)}</p>
      <span class="tool-chip" style="width:fit-content;">${escapeHtml(ch.endpoint)}</span>
    </article>
  `
  ).join('');

  const wsOptionsHtml = WORKSPACES.map(
    (w) =>
      `<option value="${escapeHtml(w.id)}" ${state.embedConfig.workspaceId === w.id ? 'selected' : ''}>${escapeHtml(w.name)}</option>`
  ).join('');

  const accentOptions = [
    { label: 'Aurelia Teal (#0f766e)', value: '#0f766e' },
    { label: 'Bright Cyan-Teal (#2dd4bf)', value: '#2dd4bf' },
    { label: 'Brushed Gold (#a88443)', value: '#a88443' },
    { label: 'Executive Slate (#334155)', value: '#334155' }
  ]
    .map(
      (opt) =>
        `<option value="${opt.value}" ${state.embedConfig.accentColor === opt.value ? 'selected' : ''}>${opt.label}</option>`
    )
    .join('');

  return `
    <div class="view-stack">
      <div class="view-header">
        <div>
          <h3>Business Connections &amp; Website Embed</h3>
          <p>Bounded operator-reviewed imports for Google Drive &amp; HubSpot, plus live Website Chat Embed customization.</p>
        </div>
        <div class="view-header-actions">
          <span class="status-badge is-configured">Bounded Manual Sync</span>
          <span class="status-badge is-sample">Zero Background Scraping</span>
        </div>
      </div>

      <div class="connections-grid">
        ${channelCardsHtml}
      </div>

      <div class="overview-split" id="connections-split">
        <article class="panel-card">
          <div class="panel-head">
            <h4>Google Drive Manual Import</h4>
            <span class="status-badge ${folderImported ? 'is-ready' : 'is-configured'}">
              ${folderImported ? 'Folder Staged' : 'Folder Browser'}
            </span>
          </div>
          <p class="text-muted" style="font-size:12.5px;">
            Browse an authorized Drive folder and explicitly stage files into the Tier 03 Document Collector.
          </p>
          <div class="filter-group">
            ${driveFolderTabs}
          </div>
          <div class="doc-list">
            ${driveFilesRows}
          </div>
          <div class="view-header-actions">
            <button type="button" class="btn btn-primary" id="drive-import-btn">
              ${iconSvg('folder', 14)}
              <span>${folderImported ? 'Re-Stage Folder Snapshot' : `Stage ${activeFolder.files.length} Files for Ingestion`}</span>
            </button>
          </div>
        </article>

        <article class="panel-card">
          <div class="panel-head">
            <h4>HubSpot Contact Batch Import</h4>
            <span class="status-badge is-sample tabular-nums">Batch Limit: ${state.hubspotBatchSize}</span>
          </div>
          <p class="text-muted" style="font-size:12.5px;">
            Select an explicit batch cap (25, 50, or 100 contacts) to preview before staging into Local CRM.
          </p>
          <div class="filter-group" role="group" aria-label="Select HubSpot batch size">
            ${batchButtons}
          </div>
          <div class="data-table-wrap">
            <table class="data-table data-table-compact">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                ${hubspotRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="panel-head">
            <span class="panel-readout tabular-nums">Showing ${previewSlice.length} of ${state.hubspotBatchSize} selected contacts (${state.hubspotImportedCount} staged)</span>
            <button type="button" class="btn btn-primary" id="hubspot-import-btn">
              Run Bounded Batch (${state.hubspotBatchSize})
            </button>
          </div>
        </article>
      </div>

      <article class="panel-card" id="embed-customizer-panel">
        <div class="panel-head">
          <h4>Website Chat Embed Customizer</h4>
          <span class="panel-readout">Updates snippet &amp; live preview instantaneously</span>
        </div>
        <div class="embed-grid">
          <div class="view-stack" style="gap:10px;">
            <div class="inspector-field">
              <label for="embed-title-input">Widget Header Title</label>
              <input
                type="text"
                id="embed-title-input"
                class="text-input"
                value="${escapeHtml(state.embedConfig.workspaceTitle)}"
              />
            </div>

            <div class="embed-fields-row">
              <div class="inspector-field">
                <label for="embed-workspace-select">Target Workspace</label>
                <select id="embed-workspace-select" class="select-input">
                  ${wsOptionsHtml}
                </select>
              </div>

              <div class="inspector-field">
                <label for="embed-accent-select">Brand Accent</label>
                <select id="embed-accent-select" class="select-input">
                  ${accentOptions}
                </select>
              </div>

              <div class="inspector-field">
                <label for="embed-position-select">Position</label>
                <select id="embed-position-select" class="select-input">
                  <option value="bottom-right" ${state.embedConfig.position === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                  <option value="bottom-left" ${state.embedConfig.position === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                </select>
              </div>
            </div>

            <div class="inspector-field">
              <label for="embed-welcome-input">Welcome Greeting</label>
              <textarea id="embed-welcome-input" class="chat-textarea" rows="2">${escapeHtml(state.embedConfig.welcomeMessage)}</textarea>
            </div>
          </div>

          <div id="embed-preview-region" class="embed-preview-split">
            ${renderEmbedPreviewAndCode(state)}
          </div>
        </div>
      </article>
    </div>
  `;
}
