/**
 * Aurelia AI — Reactive Browser Sandbox State Store
 * Zero persistence side effects beyond optional color theme preference.
 */

import {
  WORKSPACES,
  DOCUMENTS,
  SEEDED_CHAT,
  WORKFLOWS,
  AGENT_SKILLS,
  MCP_SERVERS,
  CRM_LEADS,
  DEFAULT_EMBED_CONFIG,
  ACTIVITY_FEED_SEED,
  buildFollowUpDraft,
  DRIVE_FOLDERS
} from './data.js';

export const VALID_VIEWS = ['overview', 'chat', 'workflows', 'agents', 'crm', 'connections'];
export const VALID_WORKSPACES = WORKSPACES.map((w) => w.id);

const THEME_STORAGE_KEY = 'aurelia-ai-theme';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readInitialTheme() {
  try {
    const saved = window.localStorage?.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore restricted storage environments
  }
  const attr = document.documentElement?.dataset?.theme;
  return attr === 'light' ? 'light' : 'dark';
}

function buildInitialWorkflowConfigs() {
  const configs = {};
  for (const flow of WORKFLOWS) {
    configs[flow.id] = {};
    for (const node of flow.nodes) {
      configs[flow.id][node.id] = { ...node.defaultConfig };
    }
  }
  return configs;
}

function buildInitialFlowRuns() {
  const runs = {};
  for (const flow of WORKFLOWS) {
    runs[flow.id] = {
      status: 'idle',
      runningNodeIndex: -1,
      logs: [
        `[${flow.name}] Ready. Click "Simulate Flow Run" to trace all 5 nodes with live inputs.`
      ],
      outputText: '',
      durationMs: 0
    };
  }
  return runs;
}

function buildInitialWorkspaceProviders() {
  const map = {};
  for (const ws of WORKSPACES) {
    map[ws.id] = {
      providerId: ws.defaultProviderId,
      vectorDbId: ws.defaultVectorDbId
    };
  }
  return map;
}

function createInitialState(preserveTheme) {
  return {
    theme: preserveTheme || readInitialTheme(),
    activeWorkspaceId: 'customer-support',
    activeView: 'chat',
    documents: clone(DOCUMENTS),
    chatsByWorkspace: clone(SEEDED_CHAT),
    expandedCitation: null,
    selectedFlowId: WORKFLOWS[0].id,
    selectedNodeId: WORKFLOWS[0].nodes[0].id,
    workflowConfigs: buildInitialWorkflowConfigs(),
    flowRuns: buildInitialFlowRuns(),
    workspaceProviders: buildInitialWorkspaceProviders(),
    skills: clone(AGENT_SKILLS),
    mcpServers: clone(MCP_SERVERS),
    crmLeads: clone(CRM_LEADS),
    crmSearch: '',
    crmStageFilter: 'All',
    crmSort: { key: 'value', dir: 'desc' },
    activeLeadModal: null,
    driveSelectedFolderId: DRIVE_FOLDERS[0].id,
    driveImportedFolderIds: [],
    hubspotBatchSize: 25,
    hubspotImportedCount: 0,
    embedConfig: clone(DEFAULT_EMBED_CONFIG),
    activityFeed: clone(ACTIVITY_FEED_SEED)
  };
}

let state = createInitialState();
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(meta = {}) {
  for (const listener of listeners) {
    listener(state, meta);
  }
}

export function pushActivity(title, meta, badge = 'Sandbox', badgeVariant = 'is-configured') {
  const item = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    meta,
    badge,
    badgeVariant
  };
  state.activityFeed = [item, ...state.activityFeed].slice(0, 7);
}

export function setTheme(nextTheme) {
  const normalized = nextTheme === 'light' ? 'light' : 'dark';
  state.theme = normalized;
  try {
    window.localStorage?.setItem(THEME_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage errors
  }
  notify({ type: 'theme' });
}

export function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}

export function setActiveView(viewId, options = {}) {
  if (!VALID_VIEWS.includes(viewId)) return false;
  if (state.activeView === viewId && !options.force) return false;
  state.activeView = viewId;
  notify({ type: 'view', viewId });
  return true;
}

export function setActiveWorkspace(workspaceId) {
  if (!VALID_WORKSPACES.includes(workspaceId)) return;
  if (state.activeWorkspaceId === workspaceId) return;
  state.activeWorkspaceId = workspaceId;
  state.expandedCitation = null;

  const matchingFlow = WORKFLOWS.find((f) => f.workspaceId === workspaceId);
  if (matchingFlow) {
    state.selectedFlowId = matchingFlow.id;
    state.selectedNodeId = matchingFlow.nodes[0].id;
  }

  const ws = WORKSPACES.find((w) => w.id === workspaceId);
  if (ws) {
    pushActivity(
      `Switched active workspace to ${ws.name}`,
      `${ws.industryTag} · Precision ${ws.retrievalPrecision}%`,
      'Workspace',
      'is-sample'
    );
  }
  notify({ type: 'workspace', workspaceId });
}

export function resetSandbox() {
  const currentTheme = state.theme;
  const currentView = state.activeView;
  state = createInitialState(currentTheme);
  state.activeView = currentView;
  notify({ type: 'reset' });
}

export function toggleDocumentAttachment(docId) {
  const doc = state.documents.find((d) => d.id === docId);
  if (!doc) return null;
  doc.attached = !doc.attached;
  if (!doc.attached && state.expandedCitation?.docId === docId) {
    state.expandedCitation = null;
  }
  pushActivity(
    `${doc.attached ? 'Attached' : 'Detached'} ${doc.title}`,
    `Workspace context updated (${doc.chunks} chunks)`,
    doc.attached ? 'Attached' : 'Library',
    doc.attached ? 'is-ready' : 'is-warning'
  );
  notify({ type: 'documents', docId });
  return doc;
}

export function setAllWorkspaceDocsAttached(workspaceId, attached) {
  for (const doc of state.documents) {
    if (doc.workspaceId === workspaceId) {
      doc.attached = Boolean(attached);
    }
  }
  if (!attached) state.expandedCitation = null;
  pushActivity(
    attached ? 'Attached all workspace documents' : 'Detached all workspace documents',
    `Context scope updated for ${workspaceId}`,
    attached ? 'Attached' : 'Zero Context',
    attached ? 'is-ready' : 'is-warning'
  );
  notify({ type: 'documents' });
}

export function appendChatTurn(workspaceId, userText, assistantReply) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const list = state.chatsByWorkspace[workspaceId] || [];

  const userMsg = {
    id: `msg-u-${Date.now()}`,
    role: 'user',
    author: 'Operator',
    timestamp: timeStr,
    text: userText
  };

  const assistantMsg = {
    id: `msg-a-${Date.now() + 1}`,
    role: 'assistant',
    author: 'Aurelia Workspace Assistant',
    timestamp: timeStr,
    text: assistantReply.text,
    citations: assistantReply.citations,
    modelLabel: assistantReply.modelLabel,
    latencyMs: assistantReply.latencyMs
  };

  state.chatsByWorkspace[workspaceId] = [...list, userMsg, assistantMsg];
  state.expandedCitation =
    assistantReply.citations.length > 0
      ? { messageId: assistantMsg.id, docId: assistantReply.citations[0] }
      : null;

  pushActivity(
    `Grounded chat query (${assistantReply.citations.length} citations)`,
    `${assistantReply.modelLabel} · ${assistantReply.latencyMs}ms`,
    assistantReply.citations.length > 0 ? 'Cited RAG' : 'No Context',
    assistantReply.citations.length > 0 ? 'is-configured' : 'is-warning'
  );

  notify({ type: 'chat', workspaceId });
}

export function toggleCitationExcerpt(messageId, docId) {
  if (
    state.expandedCitation &&
    state.expandedCitation.messageId === messageId &&
    state.expandedCitation.docId === docId
  ) {
    state.expandedCitation = null;
  } else {
    state.expandedCitation = { messageId, docId };
  }
  notify({ type: 'citation' });
}

export function selectFlow(flowId) {
  const flow = WORKFLOWS.find((f) => f.id === flowId);
  if (!flow) return;
  state.selectedFlowId = flow.id;
  state.selectedNodeId = flow.nodes[0].id;
  notify({ type: 'flow' });
}

export function selectFlowNode(nodeId) {
  const flow = WORKFLOWS.find((f) => f.id === state.selectedFlowId);
  if (!flow || !flow.nodes.some((n) => n.id === nodeId)) return;
  state.selectedNodeId = nodeId;
  notify({ type: 'flow-node' });
}

export function updateFlowNodeField(flowId, nodeId, fieldKey, value) {
  if (!state.workflowConfigs[flowId]?.[nodeId]) return;
  state.workflowConfigs[flowId][nodeId][fieldKey] = value;
  notify({ type: 'flow-config-input', flowId, nodeId, fieldKey });
}

export function setFlowRunState(flowId, patch) {
  state.flowRuns[flowId] = {
    ...state.flowRuns[flowId],
    ...patch
  };
  notify({ type: 'flow-run', flowId });
}

export function selectWorkspaceProvider(providerId) {
  state.workspaceProviders[state.activeWorkspaceId].providerId = providerId;
  pushActivity(
    `Routed ${state.activeWorkspaceId} to ${providerId}`,
    'Updated active model adapter configuration',
    providerId.includes('ollama') ? 'Local Privacy' : 'Cloud API',
    providerId.includes('ollama') ? 'is-sample' : 'is-configured'
  );
  notify({ type: 'agents-provider' });
}

export function selectWorkspaceVectorDb(vectorDbId) {
  state.workspaceProviders[state.activeWorkspaceId].vectorDbId = vectorDbId;
  notify({ type: 'agents-vector' });
}

export function toggleAgentSkill(skillId) {
  const skill = state.skills.find((s) => s.id === skillId);
  if (!skill) return null;
  skill.enabled = !skill.enabled;
  notify({ type: 'agents-skill', skillId });
  return skill;
}

export function toggleMcpServer(mcpId) {
  const srv = state.mcpServers.find((m) => m.id === mcpId);
  if (!srv) return null;
  srv.enabled = !srv.enabled;
  notify({ type: 'agents-mcp', mcpId });
  return srv;
}

export function setCrmSearch(query) {
  state.crmSearch = query;
  notify({ type: 'crm-filter-input' });
}

export function setCrmStageFilter(stage) {
  state.crmStageFilter = stage;
  notify({ type: 'crm-filter' });
}

export function toggleCrmSort(key) {
  if (state.crmSort.key === key) {
    state.crmSort.dir = state.crmSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    state.crmSort = { key, dir: key === 'value' ? 'desc' : 'asc' };
  }
  notify({ type: 'crm-sort' });
}

export function openLeadModal(leadId) {
  const lead = state.crmLeads.find((l) => l.id === leadId);
  if (!lead) return null;
  state.activeLeadModal = {
    leadId,
    draftVariant: 0,
    draftText: buildFollowUpDraft(lead, 0)
  };
  notify({ type: 'lead-modal-open', leadId });
  return lead;
}

export function regenerateLeadDraft() {
  if (!state.activeLeadModal) return null;
  const lead = state.crmLeads.find((l) => l.id === state.activeLeadModal.leadId);
  if (!lead) return null;
  const nextVariant = state.activeLeadModal.draftVariant + 1;
  state.activeLeadModal.draftVariant = nextVariant;
  state.activeLeadModal.draftText = buildFollowUpDraft(lead, nextVariant);
  notify({ type: 'lead-modal-draft' });
  return state.activeLeadModal.draftText;
}

export function updateLeadStage(leadId, nextStage) {
  const lead = state.crmLeads.find((l) => l.id === leadId);
  if (!lead) return null;
  lead.stage = nextStage;
  lead.lastTouch = 'Just now';
  if (state.activeLeadModal && state.activeLeadModal.leadId === leadId) {
    state.activeLeadModal.draftText = buildFollowUpDraft(lead, state.activeLeadModal.draftVariant);
  }
  pushActivity(
    `Updated ${lead.company} to ${nextStage}`,
    `Local CRM · $${Number(lead.value).toLocaleString('en-US')}`,
    'CRM Updated',
    'is-ready'
  );
  notify({ type: 'crm-stage', leadId });
  return lead;
}

export function closeLeadModal() {
  state.activeLeadModal = null;
  notify({ type: 'lead-modal-close' });
}

export function setDriveFolder(folderId) {
  state.driveSelectedFolderId = folderId;
  notify({ type: 'connections-drive' });
}

export function markDriveFolderImported(folderId) {
  if (!state.driveImportedFolderIds.includes(folderId)) {
    state.driveImportedFolderIds = [...state.driveImportedFolderIds, folderId];
  }
  const folder = DRIVE_FOLDERS.find((f) => f.id === folderId);
  pushActivity(
    `Staged Google Drive folder ${folder?.name || folderId}`,
    `Manual operator import (${folder?.files.length || 3} files queued)`,
    'Drive Import',
    'is-ready'
  );
  notify({ type: 'connections-drive-import' });
}

export function setHubspotBatchSize(size) {
  const allowed = [25, 50, 100];
  if (!allowed.includes(size)) return;
  state.hubspotBatchSize = size;
  notify({ type: 'connections-hubspot' });
}

export function runHubspotBatchImport() {
  state.hubspotImportedCount = state.hubspotBatchSize;
  pushActivity(
    `Validated bounded HubSpot batch (${state.hubspotBatchSize} contacts)`,
    'Operator-reviewed import preview staged to Local CRM',
    'HubSpot Batch',
    'is-ready'
  );
  notify({ type: 'connections-hubspot-import' });
}

export function updateEmbedConfig(patch) {
  state.embedConfig = {
    ...state.embedConfig,
    ...patch
  };
  notify({ type: 'connections-embed-input' });
}
