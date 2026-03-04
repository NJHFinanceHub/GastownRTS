<script lang="ts">
  import { selectedRig, addNotification } from '../lib/stores';
  import { runCommand } from '../lib/gt-client';

  interface Command {
    id: string;
    icon: string;
    name: string;
    hotkey: string;
    action: () => void;
    needsRig: boolean;
  }

  const commands: Command[] = [
    {
      id: 'sling', icon: '\u{1F680}', name: 'Deploy', hotkey: 'D',
      needsRig: true,
      action: () => {
        addNotification('Select a quest to sling to this rig', 'info');
      }
    },
    {
      id: 'start', icon: '\u{26A1}', name: 'Boot', hotkey: 'B',
      needsRig: true,
      action: async () => {
        if (!$selectedRig) return;
        const res = await runCommand(`rig start ${$selectedRig.name}`, true);
        addNotification(res.success ? `${$selectedRig.name} booted` : (res.error ?? 'Failed'), res.success ? 'success' : 'error');
      }
    },
    {
      id: 'stop', icon: '\u{1F6D1}', name: 'Stop', hotkey: 'S',
      needsRig: true,
      action: async () => {
        if (!$selectedRig) return;
        const res = await runCommand(`rig stop ${$selectedRig.name}`, true);
        addNotification(res.success ? `${$selectedRig.name} stopped` : (res.error ?? 'Failed'), res.success ? 'success' : 'error');
      }
    },
    {
      id: 'park', icon: '\u{1F17F}\uFE0F', name: 'Park', hotkey: 'P',
      needsRig: true,
      action: async () => {
        if (!$selectedRig) return;
        addNotification(`Park ${$selectedRig.name}?`, 'warning');
      }
    },
    {
      id: 'nudge', icon: '\u{1F4E2}', name: 'Nudge', hotkey: 'N',
      needsRig: false,
      action: () => {
        addNotification('Nudge: select a target agent', 'info');
      }
    },
    {
      id: 'status', icon: '\u{1F50D}', name: 'Refresh', hotkey: 'R',
      needsRig: false,
      action: () => {
        // Triggers SSE refresh cascade
        addNotification('Refreshing status...', 'info');
        window.dispatchEvent(new CustomEvent('gt-refresh'));
      }
    },
  ];

  function handleClick(cmd: Command) {
    if (cmd.needsRig && !$selectedRig) {
      addNotification('Select a rig first!', 'warning');
      return;
    }
    cmd.action();
  }

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toUpperCase();
    const cmd = commands.find(c => c.hotkey === key);
    if (cmd) handleClick(cmd);
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="command-cards">
  {#each commands as cmd}
    <button
      class="command-card"
      class:disabled={cmd.needsRig && !$selectedRig}
      on:click={() => handleClick(cmd)}
    >
      <div class="card-icon">{cmd.icon}</div>
      <div class="card-name">{cmd.name}</div>
      <div class="card-hotkey">{cmd.hotkey}</div>
    </button>
  {/each}
</div>

<style>
  .command-cards {
    width: 280px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    padding: 15px;
    background: linear-gradient(135deg, #2a1f15 0%, #1a1209 100%);
    border-left: 2px solid #6b5644;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.7);
  }

  .command-card {
    background: linear-gradient(135deg, #3a2f1f 0%, #2a1f15 100%);
    border: 2px solid #6b5644;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.6);
    position: relative;
    color: #f4e4c1;
    font-family: 'Cinzel', serif;
  }

  .command-card:hover:not(.disabled) {
    background: linear-gradient(135deg, #4a3f2f 0%, #3a2f1f 100%);
    border-color: #d4af37;
    transform: translateY(-3px);
    box-shadow: inset 0 0 15px rgba(212,175,55,0.3), 0 6px 12px rgba(0,0,0,0.8);
  }

  .command-card:active:not(.disabled) {
    transform: translateY(-1px);
  }

  .command-card.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .card-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
  }

  .card-name {
    font-size: 10px;
    font-weight: 700;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .card-hotkey {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 8px;
    font-weight: 700;
    color: #8b7355;
    background: rgba(0,0,0,0.5);
    padding: 2px 5px;
    border-radius: 3px;
  }
</style>
