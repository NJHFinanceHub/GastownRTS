// Gas Town API Client
// Talks to the proxy server which handles CSRF and Dolt queries

const API_BASE = '/api';

export interface TownStatus {
  name: string;
  location: string;
  overseer: {
    name: string;
    username: string;
    unread_mail: number;
  };
  daemon: { running: boolean; pid: number };
  dolt: { running: boolean; pid: number; port: number };
  tmux: { running: boolean; session_count: number };
  agents: Agent[];
  rigs: Rig[];
}

export interface Agent {
  name: string;
  address: string;
  session: string;
  role: string;
  running: boolean;
  has_work: boolean;
  unread_mail: number;
  first_subject?: string;
  agent_alias?: string;
}

export interface Rig {
  name: string;
  polecat_count: number;
  crew_count: number;
  has_witness: boolean;
  has_refinery: boolean;
  polecats: Polecat[] | null;
  crews: CrewMember[] | null;
  hooks: HookInfo[];
  agents: Agent[];
}

export interface Polecat {
  name: string;
  rig: string;
  status: string;
  hook?: string;
}

export interface CrewMember {
  name: string;
  rig: string;
  state: string;
  hook?: string;
  hook_title?: string;
  session: string;
  last_active: string;
}

export interface HookInfo {
  agent: string;
  role: string;
  has_work: boolean;
}

export interface MailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body?: string;
  timestamp: string;
  read: boolean;
  priority?: string;
}

export interface MailInbox {
  messages: MailMessage[];
  unread_count: number;
  total: number;
}

export interface ReadyItem {
  id: string;
  title: string;
  priority: number;
  source: string;
  type: string;
}

export interface ReadyResponse {
  items: ReadyItem[];
  by_source: Record<string, ReadyItem[]>;
  summary: {
    total: number;
    p1_count: number;
    p2_count: number;
    p3_count: number;
  };
}

export interface CommandResponse {
  success: boolean;
  output?: string;
  error?: string;
  duration_ms: number;
  command: string;
}

export interface OptionsResponse {
  rigs?: string[];
  polecats?: string[];
  convoys?: string[];
  agents?: Array<{ name: string; status?: string; running?: boolean }>;
  hooks?: string[];
  messages?: string[];
  crew?: string[];
  escalations?: string[];
}

// Fetch town status
export async function getStatus(): Promise<TownStatus> {
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: 'status --json' }),
  });
  const data: CommandResponse = await res.json();
  if (data.success && data.output) {
    return JSON.parse(data.output);
  }
  throw new Error(data.error || 'Failed to get status');
}

// Fetch mail inbox
export async function getMailInbox(): Promise<MailInbox> {
  const res = await fetch(`${API_BASE}/mail/inbox`);
  return res.json();
}

// Read a specific mail message
export async function readMail(id: string): Promise<MailMessage> {
  const res = await fetch(`${API_BASE}/mail/read?id=${encodeURIComponent(id)}`);
  return res.json();
}

// Get ready work items
export async function getReady(): Promise<ReadyResponse> {
  const res = await fetch(`${API_BASE}/ready`);
  return res.json();
}

// Get autocomplete options (rigs, polecats, etc)
export async function getOptions(): Promise<OptionsResponse> {
  const res = await fetch(`${API_BASE}/options`);
  return res.json();
}

// Get crew status
export async function getCrew(): Promise<{ crew: CrewMember[]; by_rig: Record<string, CrewMember[]>; total: number }> {
  const res = await fetch(`${API_BASE}/crew`);
  return res.json();
}

// Execute a whitelisted gt command
export async function runCommand(command: string, confirmed = false): Promise<CommandResponse> {
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, confirmed }),
  });
  return res.json();
}

// Connect to SSE event stream
export function connectSSE(onUpdate: () => void, onError?: (err: Event) => void): EventSource {
  const es = new EventSource(`${API_BASE}/events`);

  es.addEventListener('dashboard-update', () => {
    onUpdate();
  });

  es.addEventListener('connected', () => {
    console.log('[sse] Connected to Gas Town dashboard');
  });

  es.onerror = (err) => {
    console.warn('[sse] Connection error, will auto-reconnect');
    onError?.(err);
  };

  return es;
}
