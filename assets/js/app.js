/**
 * Aurelia AI — Main Browser Sandbox Controller (ES Module)
 * Coordinates routing, theme toggle, mobile drawer, chrome sync, modal focus, and view events.
 */

import {
  WORKSPACES,
  OVERVIEW_TEMPLATES,
  WORKFLOWS,
  generateGroundedReply
} from './data.js';
import {
  VALID_VIEWS,
  getState,
  subscribe,
  toggleTheme,
  setActiveView,
  setActiveWorkspace,
  resetSandbox,
  toggleDocumentAttachment,
  setAllWorkspaceDocsAttached,
  appendChatTurn,
  toggleCitationExcerpt,
  selectFlow,
  selectFlowNode,
  updateFlowNodeField,
  setFlowRunState,
  selectWorkspaceProvider,
  selectWorkspaceVectorDb,
  toggleAgentSkill,
  toggleMcpServer,
  setCrmSearch,
  setCrmStageFilter,
  toggleCrmSort,
  openLeadModal,
  regenerateLeadDraft,
  updateLeadStage,
  closeLeadModal,
  setDriveFolder,
  markDriveFolderImported,
  setHubspotBatchSize,
  runHubspotBatchImport,
  updateEmbedConfig,
  pushActivity
} from './state.js';
import {
  getActiveWorkspace,
  getWorkspaceDocuments,
  getActiveProvider,
  escapeHtml,
  renderOverviewView,
  renderChatView,
  renderWorkflowsView,
  renderFlowConsoleHtml,
  renderAgentsView,
  renderCrmView,
  renderCrmResultsRegion,
  renderLeadModalBody,
  renderConnectionsView,
  renderEmbedPreviewAndCode
} from './renderers.js';

const VIEW_LABELS = {
  overview: 'Overview',
  chat: 'AI Chat & Docs',
  workflows: 'Visual Flows',
  agents: 'Agents & Models',
  crm: 'Local CRM',
  connections: 'Connections'
};

let flowTimers = [];
let lastLeadModalTrigger = null;

function clearFlowTimers() {
  for (const t of flowTimers) {
    window.clearTimeout(t);
  }
  flowTimers = [];
}

function parseViewFromHash() {
  const hash = window.location.hash || '';
  const match = hash.match(/^#view=([a-z-]+)$/i);
  if (match && VALID_VIEWS.includes(match[1])) {
    return match[1];
  }
  return null;
}

function syncUrlHash(viewId) {
  const targetHash = `#view=${viewId}`;
  if (window.location.hash === targetHash) return;
  try {
    window.history.pushState(null, '', targetHash);
  } catch {
    window.location.hash = targetHash;
  }
}

/**
 * Displays an accessible non-blocking toast inside #toast-region.
 */
function showToast(message, variant = 'info') {
  const region = document.getElementById('toast-region');
  if (!region) return;

  const toast = document.createElement('div');
  const typeClass =
    variant === 'success'
      ? 'toast-success'
      : variant === 'warning'
        ? 'toast-warning'
        : 'toast-info';
  toast.className = `toast-item ${typeClass}`;
  toast.setAttribute('role', 'status');

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  const dismissBtn = document.createElement('button');
  dismissBtn.type = 'button';
  dismissBtn.className = 'copy-btn';
  dismissBtn.style.minHeight = '30px';
  dismissBtn.style.padding = '0 8px';
  dismissBtn.textContent = 'Dismiss';
  dismissBtn.addEventListener('click', () => toast.remove());

  toast.append(textSpan, dismissBtn);
  region.appendChild(toast);

  // Keep toast stack clean
  while (region.children.length > 3) {
    region.firstElementChild?.remove();
  }

  window.setTimeout(() => {
    if (toast.isConnected) toast.remove();
  }, 3600);
}

/**
 * Copies text safely using Clipboard API with textarea fallback.
 */
async function copyTextSafe(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  helper.style.pointerEvents = 'none';
  document.body.appendChild(helper);
  helper.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  helper.remove();
  return ok;
}

/**
 * Syncs <html data-theme> and theme toggle buttons.
 */
function syncThemeDom(state) {
  const root = document.documentElement;
  root.dataset.theme = state.theme;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', state.theme === 'light' ? '#f7f8fa' : '#0b1120');
  }

  const toggleBtn = document.getElementById('theme-toggle');
  const toggleLabel = document.getElementById('theme-toggle-label');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  const isLight = state.theme === 'light';

  if (toggleBtn) toggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  if (toggleLabel) toggleLabel.textContent = isLight ? 'Dark Mode' : 'Light Mode';
  if (mobileToggle) mobileToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
}

/**
 * Syncs Hero Snapshot, Workspace Switcher, Sidebar Nav, Scope Pill, and Sidebar Summary.
 */
function syncChromeDom(state) {
  const ws = getActiveWorkspace(state);
  const wsDocs = getWorkspaceDocuments(state);
  const attachedCount = wsDocs.filter((d) => d.attached).length;
  const provider = getActiveProvider(state);
  const viewLabel = VIEW_LABELS[state.activeView] || 'Overview';

  // Topbar Workspace & Doc badge sync
  const topbarWsName = document.getElementById('topbar-workspace-name');
  if (topbarWsName) {
    topbarWsName.textContent = ws.name || ws.shortName;
  }
  const topbarWs = document.getElementById('topbar-ws-pill');
  if (topbarWs) {
    topbarWs.textContent = ws.shortName;
  }
  const topbarDocText = document.getElementById('topbar-doc-text');
  if (topbarDocText) {
    topbarDocText.textContent = `${attachedCount} / ${wsDocs.length} Docs`;
  }
  const topbarModelName = document.getElementById('topbar-model-name');
  if (topbarModelName) {
    topbarModelName.textContent = provider.name;
  }

  // Workspace switcher pills
  const pills = document.querySelectorAll('#workspace-switcher .workspace-pill[data-workspace-id]');
  for (const pill of pills) {
    const isActive = pill.dataset.workspaceId === ws.id;
    pill.classList.toggle('is-active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  }

  // Workspace meta bar
  const metaBar = document.getElementById('active-workspace-meta');
  if (metaBar) {
    const isLocal = provider.routing.toLowerCase().includes('local');
    metaBar.innerHTML = `
      <span class="status-badge ${isLocal ? 'is-sample' : 'is-configured'}">
        Adapter: ${escapeHtml(provider.name)} (${escapeHtml(provider.routing)})
      </span>
      <span class="status-badge ${attachedCount > 0 ? 'is-ready' : 'is-warning'}">
        ${attachedCount}/${wsDocs.length} Docs Attached
      </span>
    `;
  }

  // Sidebar nav links
  const navLinks = document.querySelectorAll('#workspace-nav a.sidebar-nav-item[data-view]');
  for (const link of navLinks) {
    const isCurrent = link.dataset.view === state.activeView;
    link.classList.toggle('is-active', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  // Sidebar summary card
  const sumName = document.getElementById('sidebar-summary-name');
  const sumModel = document.getElementById('sidebar-summary-model');
  const sumDocs = document.getElementById('sidebar-summary-docs');
  const sumMode = document.getElementById('sidebar-summary-mode');
  if (sumName) sumName.textContent = ws.shortName;
  if (sumModel) sumModel.textContent = provider.name;
  if (sumDocs) sumDocs.textContent = `${attachedCount} attached`;
  if (sumMode) {
    sumMode.textContent = provider.routing.includes('Local') ? 'Local Privacy' : 'Browser Sandbox';
  }
}

/**
 * Renders the active view inside #view-stage.
 */
function renderActiveView(state) {
  const stage = document.getElementById('view-stage');
  if (!stage) return;

  switch (state.activeView) {
    case 'chat':
      stage.innerHTML = renderChatView(state);
      break;
    case 'workflows':
      stage.innerHTML = renderWorkflowsView(state);
      break;
    case 'agents':
      stage.innerHTML = renderAgentsView(state);
      break;
    case 'crm':
      stage.innerHTML = renderCrmView(state);
      break;
    case 'connections':
      stage.innerHTML = renderConnectionsView(state);
      break;
    case 'overview':
    default:
      stage.innerHTML = renderOverviewView(state);
      break;
  }
}

/**
 * Syncs native <dialog id="lead-modal">.
 */
function syncLeadModal(state) {
  const dialog = document.getElementById('lead-modal');
  const titleEl = document.getElementById('lead-modal-title');
  const bodyEl = document.getElementById('lead-modal-body');
  if (!dialog || !bodyEl) return;

  if (!state.activeLeadModal) {
    if (dialog.open) {
      dialog.close();
    }
    return;
  }

  const lead = state.crmLeads.find((l) => l.id === state.activeLeadModal.leadId);
  if (!lead) return;

  if (titleEl) {
    titleEl.textContent = `${lead.company} — Lead & Follow-Up Record`;
  }
  bodyEl.innerHTML = renderLeadModalBody(state);

  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }
}

/**
 * Triggers a grounded chat message and refreshes chat thread smoothly.
 */
function submitGroundedChatPrompt(promptText) {
  const trimmed = (promptText || '').trim();
  if (!trimmed) return;

  const state = getState();
  const ws = getActiveWorkspace(state);
  const attachedDocs = getWorkspaceDocuments(state, ws.id).filter((d) => d.attached);
  const provider = getActiveProvider(state);

  const reply = generateGroundedReply({
    workspace: ws,
    attachedDocs,
    promptText: trimmed,
    providerName: provider.name
  });

  appendChatTurn(ws.id, trimmed, reply);

  const thread = document.getElementById('chat-thread');
  if (thread) {
    thread.scrollTop = thread.scrollHeight;
  }
  const input = document.getElementById('chat-prompt-input');
  if (input) {
    input.focus({ preventScroll: true });
  }
}

/**
 * Animates a 5-node Visual Flow Simulation sequentially without blocking UI.
 */
function runVisualFlowSimulation(flowId) {
  clearFlowTimers();
  const flow = WORKFLOWS.find((f) => f.id === flowId);
  if (!flow) return;

  const configs = getState().workflowConfigs[flow.id] || {};
  const initialLogs = [`[START] ${flow.name} · Dispatching 5-node execution pipeline...`];
  setFlowRunState(flow.id, {
    status: 'running',
    runningNodeIndex: 0,
    logs: initialLogs,
    durationMs: 0
  });

  let cumulativeMs = 0;
  flow.nodes.forEach((node, index) => {
    const stepDelay = index * 320;
    const timer = window.setTimeout(() => {
      const current = getState();
      if (current.activeView !== 'workflows' || current.selectedFlowId !== flow.id) {
        return;
      }
      cumulativeMs += node.latencyMs;
      const nodeCfg = configs[node.id] || node.defaultConfig;
      const cfgPreview = Object.entries(nodeCfg)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      const prevLogs = current.flowRuns[flow.id]?.logs || [];
      const nextLogs = [
        ...prevLogs,
        `[NODE ${index + 1}/5 · ${node.type}] ${node.title} (${node.latencyMs}ms · ${node.tokens} tok) -> ${cfgPreview}`
      ];

      const isFinal = index === flow.nodes.length - 1;
      if (isFinal) {
        nextLogs.push(
          `[DONE] Pipeline completed in ${cumulativeMs}ms · Structured output verified.`
        );
        pushActivity(
          `Simulated ${flow.name} (${cumulativeMs}ms)`,
          '5/5 visual flow nodes verified',
          'Flow Run',
          'is-ready'
        );
        setFlowRunState(flow.id, {
          status: 'completed',
          runningNodeIndex: -1,
          logs: nextLogs,
          durationMs: cumulativeMs
        });
        const consoleEl = document.querySelector('#flow-console-region .flow-console');
        if (consoleEl) {
          consoleEl.scrollTop = Math.max(0, consoleEl.scrollHeight - consoleEl.clientHeight);
        }
        showToast(`${flow.name} simulation completed (${cumulativeMs}ms).`, 'success');
      } else {
        setFlowRunState(flow.id, {
          status: 'running',
          runningNodeIndex: index + 1,
          logs: nextLogs,
          durationMs: cumulativeMs
        });
      }
    }, stepDelay + 180);

    flowTimers.push(timer);
  });
}

/**
 * Sets up accessible Mobile Drawer with inert main-content isolation & focus restore.
 */
function setupMobileDrawer() {
  const triggerBtn = document.getElementById('mobile-nav-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-nav-close');
  const mainContent = document.getElementById('main-content');
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  const mobileLaunchBtn = document.getElementById('mobile-launch-cta');

  if (!triggerBtn || !drawer || !mainContent) return;

  const openDrawer = () => {
    drawer.hidden = false;
    triggerBtn.setAttribute('aria-expanded', 'true');
    mainContent.inert = true;
    closeBtn?.focus();
  };

  const closeDrawer = (restoreFocus = true) => {
    if (drawer.hidden) return;
    drawer.hidden = true;
    triggerBtn.setAttribute('aria-expanded', 'false');
    mainContent.inert = false;
    if (restoreFocus) {
      triggerBtn.focus();
    }
  };

  triggerBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', () => closeDrawer(true));

  drawer.addEventListener('click', (event) => {
    if (event.target === drawer) {
      closeDrawer(true);
    }
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer(false);
    });
  });

  mobileLaunchBtn?.addEventListener('click', () => {
    closeDrawer(false);
  });

  mobileThemeBtn?.addEventListener('click', () => {
    toggleTheme();
    const next = getState().theme;
    showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} Executive theme.`, 'info');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) {
      closeDrawer(true);
    }
  });
}

/**
 * Sets up Lead Inspection native <dialog> close & focus restoration.
 */
function setupLeadModalEvents() {
  const dialog = document.getElementById('lead-modal');
  const closeBtn = document.getElementById('lead-modal-close');
  if (!dialog) return;

  const handleClose = () => {
    closeLeadModal();
    if (lastLeadModalTrigger && document.contains(lastLeadModalTrigger)) {
      lastLeadModalTrigger.focus({ preventScroll: true });
    }
    lastLeadModalTrigger = null;
  };

  closeBtn?.addEventListener('click', handleClose);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      handleClose();
    }
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    handleClose();
  });

  dialog.addEventListener('change', (event) => {
    const stageSelect = event.target.closest('#modal-lead-stage');
    if (stageSelect) {
      const leadId = stageSelect.dataset.modalLeadId;
      const nextStage = stageSelect.value;
      const updated = updateLeadStage(leadId, nextStage);
      if (updated) {
        showToast(`${updated.company} stage updated to ${nextStage}.`, 'success');
      }
    }
  });

  dialog.addEventListener('click', (event) => {
    const regenBtn = event.target.closest('#modal-regenerate-draft');
    if (regenBtn) {
      regenerateLeadDraft();
      showToast('Generated an alternate AI follow-up draft (not sent).', 'info');
    }
  });
}

/**
 * Wires delegated click, input, change, and submit handlers inside #view-stage.
 */
function setupViewStageDelegation() {
  const stage = document.getElementById('view-stage');
  if (!stage) return;

  stage.addEventListener('click', (event) => {
    // 1. Overview prompt template -> switch workspace & view to chat + run prompt
    const tplBtn = event.target.closest('[data-run-template]');
    if (tplBtn) {
      const tpl = OVERVIEW_TEMPLATES.find((t) => t.id === tplBtn.dataset.runTemplate);
      if (!tpl) return;
      if (getState().activeWorkspaceId !== tpl.workspaceId) {
        setActiveWorkspace(tpl.workspaceId);
      }
      setActiveView('chat');
      syncUrlHash('chat');
      submitGroundedChatPrompt(tpl.prompt);
      showToast(`Executed "${tpl.title}" template in AI Chat.`, 'success');
      return;
    }

    // 2. Quick jump buttons
    const jumpBtn = event.target.closest('[data-jump-view]');
    if (jumpBtn) {
      const targetView = jumpBtn.dataset.jumpView;
      if (VALID_VIEWS.includes(targetView)) {
        setActiveView(targetView);
        syncUrlHash(targetView);
      }
      return;
    }

    // 3. Chat citation chip expand/collapse
    const citeChip = event.target.closest('[data-cite-msg][data-cite-doc]');
    if (citeChip) {
      toggleCitationExcerpt(citeChip.dataset.citeMsg, citeChip.dataset.citeDoc);
      return;
    }

    // 4. Chat suggested prompt chip
    const promptChip = event.target.closest('[data-suggested-prompt]');
    if (promptChip) {
      const idx = Number(promptChip.dataset.suggestedPrompt);
      const ws = getActiveWorkspace(getState());
      const prompt = ws.suggestedPrompts[idx];
      if (prompt) {
        submitGroundedChatPrompt(prompt);
      }
      return;
    }

    // 5. Chat bulk document attach/detach
    const bulkBtn = event.target.closest('[data-docs-bulk]');
    if (bulkBtn) {
      const attach = bulkBtn.dataset.docsBulk === 'attach';
      const wsId = getState().activeWorkspaceId;
      setAllWorkspaceDocsAttached(wsId, attach);
      showToast(
        attach
          ? 'All 4 workspace documents attached to retrieval context.'
          : 'All workspace documents detached (zero-context fallback active).',
        attach ? 'success' : 'warning'
      );
      return;
    }

    // 6. Workflow preset selector
    const flowBtn = event.target.closest('.flow-preset-btn[data-flow-id]');
    if (flowBtn) {
      clearFlowTimers();
      selectFlow(flowBtn.dataset.flowId);
      return;
    }

    // 7. Workflow node selector
    const nodeBtn = event.target.closest('.flow-node[data-node-id]');
    if (nodeBtn) {
      selectFlowNode(nodeBtn.dataset.nodeId);
      return;
    }

    // 8. Simulate Flow Run button
    const runFlowBtn = event.target.closest('#run-flow-btn');
    if (runFlowBtn) {
      runVisualFlowSimulation(getState().selectedFlowId);
      return;
    }

    // 9. Agents: Provider selector
    const providerBtn = event.target.closest('[data-provider-id]');
    if (providerBtn) {
      selectWorkspaceProvider(providerBtn.dataset.providerId);
      const provider = getActiveProvider(getState());
      showToast(`Active model routed to ${provider.name} (${provider.routing}).`, 'info');
      return;
    }

    // 10. Agents: Vector DB selector
    const vectorBtn = event.target.closest('[data-vector-id]');
    if (vectorBtn) {
      selectWorkspaceVectorDb(vectorBtn.dataset.vectorId);
      showToast('Updated active workspace vector database store.', 'info');
      return;
    }

    // 11. Agents: Skill toggle
    const skillBtn = event.target.closest('[data-skill-id]');
    if (skillBtn) {
      const skill = toggleAgentSkill(skillBtn.dataset.skillId);
      if (skill) {
        showToast(`${skill.name} ${skill.enabled ? 'enabled' : 'disabled'}.`, 'info');
      }
      return;
    }

    // 12. Agents: MCP server toggle
    const mcpBtn = event.target.closest('[data-mcp-id]');
    if (mcpBtn) {
      const srv = toggleMcpServer(mcpBtn.dataset.mcpId);
      if (srv) {
        showToast(
          `${srv.name} MCP server ${srv.enabled ? 'added to' : 'removed from'} aurelia_mcp_servers.json.`,
          srv.enabled ? 'success' : 'warning'
        );
      }
      return;
    }

    // 13. CRM: Stage filter chips
    const stageChip = event.target.closest('[data-stage-filter]');
    if (stageChip) {
      setCrmStageFilter(stageChip.dataset.stageFilter);
      return;
    }

    // 14. CRM: Sort headers
    const sortBtn = event.target.closest('[data-crm-sort]');
    if (sortBtn) {
      toggleCrmSort(sortBtn.dataset.crmSort);
      return;
    }

    // 15. CRM: Clear filters
    if (event.target.closest('#crm-clear-filters-btn')) {
      setCrmSearch('');
      setCrmStageFilter('All');
      const input = document.getElementById('crm-search-input');
      if (input) input.value = '';
      return;
    }

    // 16. CRM: Inspect & Draft modal trigger
    const inspectBtn = event.target.closest('[data-inspect-lead]');
    if (inspectBtn) {
      lastLeadModalTrigger = inspectBtn;
      openLeadModal(inspectBtn.dataset.inspectLead);
      return;
    }

    // 17. Connections: Google Drive folder browse
    const driveFolderBtn = event.target.closest('[data-drive-folder]');
    if (driveFolderBtn) {
      setDriveFolder(driveFolderBtn.dataset.driveFolder);
      return;
    }

    // 18. Connections: Stage Drive folder import
    if (event.target.closest('#drive-import-btn')) {
      const folderId = getState().driveSelectedFolderId;
      markDriveFolderImported(folderId);
      showToast('Staged Google Drive folder files into Collector queue.', 'success');
      return;
    }

    // 19. Connections: HubSpot batch size selector
    const batchBtn = event.target.closest('[data-hubspot-batch]');
    if (batchBtn) {
      setHubspotBatchSize(Number(batchBtn.dataset.hubspotBatch));
      return;
    }

    // 20. Connections: Run bounded HubSpot batch
    if (event.target.closest('#hubspot-import-btn')) {
      runHubspotBatchImport();
      showToast(
        `Bounded import preview validated (${getState().hubspotBatchSize} HubSpot contacts).`,
        'success'
      );
    }
  });

  // Checkbox & select change handlers inside #view-stage
  stage.addEventListener('change', (event) => {
    const docCheckbox = event.target.closest('input[type="checkbox"][data-toggle-doc]');
    if (docCheckbox) {
      const doc = toggleDocumentAttachment(docCheckbox.dataset.toggleDoc);
      if (doc) {
        showToast(
          `${doc.title} ${doc.attached ? 'attached to' : 'detached from'} workspace context.`,
          doc.attached ? 'success' : 'warning'
        );
      }
      return;
    }

    if (event.target.id === 'embed-workspace-select') {
      updateEmbedConfig({ workspaceId: event.target.value });
      return;
    }
    if (event.target.id === 'embed-accent-select') {
      updateEmbedConfig({ accentColor: event.target.value });
      return;
    }
    if (event.target.id === 'embed-position-select') {
      updateEmbedConfig({ position: event.target.value });
    }
  });

  // Live typing input handlers (preserve cursor & focus!)
  stage.addEventListener('input', (event) => {
    if (event.target.id === 'crm-search-input') {
      setCrmSearch(event.target.value);
      return;
    }

    const flowFieldKey = event.target.dataset?.flowInput;
    if (flowFieldKey) {
      const state = getState();
      updateFlowNodeField(state.selectedFlowId, state.selectedNodeId, flowFieldKey, event.target.value);
      return;
    }

    if (event.target.id === 'embed-title-input') {
      updateEmbedConfig({ workspaceTitle: event.target.value });
      return;
    }
    if (event.target.id === 'embed-welcome-input') {
      updateEmbedConfig({ welcomeMessage: event.target.value });
    }
  });

  // Chat composer submit + Enter-to-send
  stage.addEventListener('submit', (event) => {
    if (event.target.id === 'chat-composer-form') {
      event.preventDefault();
      const textarea = document.getElementById('chat-prompt-input');
      if (textarea) {
        submitGroundedChatPrompt(textarea.value);
      }
    }
  });

  stage.addEventListener('keydown', (event) => {
    if (
      event.target.id === 'chat-prompt-input' &&
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      submitGroundedChatPrompt(event.target.value);
    }
  });
}

/**
 * Global copy button handler for static #self-host buttons and dynamic view copy buttons.
 */
function setupCopyButtonsDelegation() {
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-copy-btn]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy-text') || '';
    if (!text) return;

    const ok = await copyTextSafe(text);
    const labelSpan = btn.querySelector('span');
    if (!btn.dataset.originalLabel) {
      btn.dataset.originalLabel = (labelSpan ? labelSpan.textContent : btn.textContent).trim();
    }
    const prevLabel = btn.dataset.originalLabel;

    btn.classList.add('is-copied');
    if (labelSpan) {
      labelSpan.textContent = 'Copied';
    } else {
      btn.textContent = 'Copied';
    }

    showToast(
      ok ? 'Copied snippet to clipboard.' : 'Clipboard restricted — snippet ready to copy manually.',
      ok ? 'success' : 'warning'
    );

    if (btn._copyTimer) {
      window.clearTimeout(btn._copyTimer);
    }
    btn._copyTimer = window.setTimeout(() => {
      if (!btn.isConnected) return;
      btn.classList.remove('is-copied');
      if (labelSpan) {
        labelSpan.textContent = prevLabel;
      } else {
        btn.textContent = prevLabel;
      }
    }, 1800);
  });
}

/**
 * Wires top-level shell controls, theme toggle, workspace switcher, sidebar nav, and hash routing.
 */
function setupShellControls() {
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    toggleTheme();
    const next = getState().theme;
    showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} Executive theme.`, 'info');
  });

  const resetBtn = document.getElementById('sandbox-reset-btn');
  resetBtn?.addEventListener('click', () => {
    clearFlowTimers();
    resetSandbox();
    showToast('Sandbox state reset to deterministic sample defaults.', 'info');
  });

  const switcher = document.getElementById('workspace-switcher');
  switcher?.addEventListener('click', (event) => {
    const pill = event.target.closest('.workspace-pill[data-workspace-id]');
    if (!pill) return;
    clearFlowTimers();
    const nextWsId = pill.dataset.workspaceId;
    if (nextWsId !== getState().activeWorkspaceId) {
      setActiveWorkspace(nextWsId);
      const ws = WORKSPACES.find((w) => w.id === nextWsId);
      if (ws) {
        showToast(`Switched workspace to ${ws.name}.`, 'info');
      }
    }
  });

  // Application Modals & Topbar Controls
  const docModal = document.getElementById('doc-modal');
  const settingsModal = document.getElementById('settings-modal');
  const modelModal = document.getElementById('model-picker-modal');
  const newWsModal = document.getElementById('new-workspace-modal');

  document.getElementById('topbar-doc-counter')?.addEventListener('click', () => {
    docModal?.showModal();
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#composer-attach-btn')) {
      e.preventDefault();
      docModal?.showModal();
    }
  });
  document.getElementById('doc-modal-close')?.addEventListener('click', () => docModal?.close());
  document.getElementById('doc-modal-dismiss')?.addEventListener('click', () => docModal?.close());
  document.getElementById('doc-upload-trigger')?.addEventListener('click', () => {
    docModal?.close();
    showToast('Document indexed into pgvector (1,536-dim embeddings synchronized).', 'success');
  });

  document.getElementById('topbar-settings-btn')?.addEventListener('click', () => settingsModal?.showModal());
  document.getElementById('sidebar-settings-btn')?.addEventListener('click', () => settingsModal?.showModal());
  document.getElementById('settings-modal-close')?.addEventListener('click', () => settingsModal?.close());
  document.getElementById('settings-modal-save')?.addEventListener('click', () => {
    settingsModal?.close();
    showToast('Workspace configuration saved successfully.', 'success');
  });

  document.getElementById('topbar-model-picker')?.addEventListener('click', () => modelModal?.showModal());
  document.getElementById('model-modal-close')?.addEventListener('click', () => modelModal?.close());
  modelModal?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-select-model]');
    if (!btn) return;
    const model = btn.dataset.selectModel;
    const labelEl = document.getElementById('topbar-model-name');
    if (labelEl) labelEl.textContent = model;
    modelModal.close();
    showToast(`Active model set to ${model}.`, 'info');
  });

  document.getElementById('new-workspace-btn')?.addEventListener('click', () => newWsModal?.showModal());
  document.getElementById('new-ws-close')?.addEventListener('click', () => newWsModal?.close());
  document.getElementById('new-ws-cancel')?.addEventListener('click', () => newWsModal?.close());
  document.getElementById('new-ws-submit')?.addEventListener('click', () => {
    const input = document.getElementById('new-ws-name-input');
    const name = input?.value || 'New Workspace';
    newWsModal?.close();
    showToast(`Workspace "${name}" created.`, 'success');
  });

  // Workspace search filter
  document.getElementById('workspace-search-input')?.addEventListener('input', (e) => {
    const term = (e.target.value || '').toLowerCase().trim();
    const navItems = document.querySelectorAll('#workspace-nav a.sidebar-nav-item');
    for (const item of navItems) {
      const match = !term || item.textContent.toLowerCase().includes(term);
      item.style.display = match ? '' : 'none';
    }
  });

  const nav = document.getElementById('workspace-nav');
  nav?.addEventListener('click', (event) => {
    const link = event.target.closest('a.sidebar-nav-item[data-view]');
    if (!link) return;
    event.preventDefault();
    const targetView = link.dataset.view;
    if (!VALID_VIEWS.includes(targetView)) return;

    clearFlowTimers();
    setActiveView(targetView, { force: true });
    syncUrlHash(targetView);

    const stage = document.getElementById('view-stage');
    stage?.focus({ preventScroll: true });
  });

  const handleHashOrPop = () => {
    const hashView = parseViewFromHash();
    if (hashView && hashView !== getState().activeView) {
      clearFlowTimers();
      setActiveView(hashView);
    }
  };

  window.addEventListener('hashchange', handleHashOrPop);
  window.addEventListener('popstate', handleHashOrPop);
}

/**
 * Reactive store subscriber performing minimal targeted DOM updates where inputs are focused.
 */
function handleStateUpdate(state, meta) {
  syncThemeDom(state);
  syncChromeDom(state);

  if (meta.type === 'theme') {
    return;
  }

  if (meta.type === 'crm-filter-input') {
    const region = document.getElementById('crm-results-region');
    if (region) {
      region.innerHTML = renderCrmResultsRegion(state);
      return;
    }
  }

  if (meta.type === 'flow-config-input') {
    const consoleRegion = document.getElementById('flow-console-region');
    const flow = WORKFLOWS.find((f) => f.id === state.selectedFlowId);
    if (consoleRegion && flow) {
      consoleRegion.innerHTML = renderFlowConsoleHtml(state, flow);
      return;
    }
  }

  if (meta.type === 'connections-embed-input') {
    const previewRegion = document.getElementById('embed-preview-region');
    if (previewRegion) {
      previewRegion.innerHTML = renderEmbedPreviewAndCode(state);
      return;
    }
  }

  if (
    meta.type === 'lead-modal-open' ||
    meta.type === 'lead-modal-draft' ||
    meta.type === 'lead-modal-close'
  ) {
    syncLeadModal(state);
    return;
  }

  if (meta.type === 'crm-stage') {
    syncLeadModal(state);
    if (state.activeView === 'crm') {
      const region = document.getElementById('crm-results-region');
      if (region) {
        region.innerHTML = renderCrmResultsRegion(state);
        return;
      }
    }
  }

  if (meta.type === 'view') {
    document.getElementById('toast-region')?.replaceChildren();
  }

  if (meta.type === 'reset') {
    syncLeadModal(state);
  }

  renderActiveView(state);
}

function initSponsorwareProtection() {
  console.log(
    '%c🔒 AURELIA AI — Protected Commercial & Sponsorware Build\n%cTo unlock full editable 3-tier source code (annoris/aurelia-pro-source), contribute via Solana: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
    'background:#0f766e;color:#f8fafc;padding:8px 14px;font-family:sans-serif;font-weight:700;font-size:12px;letter-spacing:0.06em;border-left:4px solid #2dd4bf;',
    'background:#0b1120;color:#ddbf80;padding:6px 14px;font-family:monospace;font-size:11px;'
  );

  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.closest('img, svg, canvas, .welcome-hero, .snapshot-card')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.closest('img, svg')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    const isViewSource = (e.ctrlKey || e.metaKey) && key === 'u';
    const isDevTools =
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.altKey && (key === 'i' || key === 'j' || key === 'c')) ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'));

    if (isViewSource || isDevTools) {
      e.preventDefault();
    }
  });
}

function bootstrap() {
  initSponsorwareProtection();
  const initialView = parseViewFromHash();
  if (initialView) {
    setActiveView(initialView, { force: true });
  }

  subscribe(handleStateUpdate);
  setupThemeAndInit();
  setupMobileDrawer();
  setupLeadModalEvents();
  setupViewStageDelegation();
  setupCopyButtonsDelegation();
  setupShellControls();
}

function setupThemeAndInit() {
  const state = getState();
  syncThemeDom(state);
  syncChromeDom(state);
  renderActiveView(state);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
