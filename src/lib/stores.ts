import { writable, derived } from 'svelte/store';
import type { TownStatus, Rig, MailInbox, ReadyItem, MailMessage } from './gt-client';

// Core state
export const townStatus = writable<TownStatus | null>(null);
export const mailInbox = writable<MailInbox | null>(null);
export const readyItems = writable<ReadyItem[]>([]);
export const selectedRig = writable<Rig | null>(null);
export const connected = writable(false);

// Notification system
export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

let notifId = 0;
export const notifications = writable<Notification[]>([]);

export function addNotification(message: string, type: Notification['type'] = 'info') {
  const id = ++notifId;
  notifications.update(n => [...n, { id, message, type, timestamp: Date.now() }]);
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.update(n => n.filter(x => x.id !== id));
  }, 3000);
}

// Derived stores
export const rigs = derived(townStatus, $s => $s?.rigs ?? []);
export const agents = derived(townStatus, $s => $s?.agents ?? []);
export const unreadMail = derived(mailInbox, $m => $m?.unread_count ?? 0);
export const totalAgents = derived(townStatus, $s => {
  if (!$s) return 0;
  let count = $s.agents.length;
  for (const rig of $s.rigs) {
    count += rig.agents.length;
    count += rig.polecat_count;
  }
  return count;
});
export const runningAgents = derived(townStatus, $s => {
  if (!$s) return 0;
  let count = $s.agents.filter(a => a.running).length;
  for (const rig of $s.rigs) {
    count += rig.agents.filter(a => a.running).length;
    count += rig.polecat_count;
  }
  return count;
});
export const totalPolecats = derived(townStatus, $s => {
  if (!$s) return 0;
  return $s.rigs.reduce((sum, r) => sum + r.polecat_count, 0);
});
