<script lang="ts">
  import { townStatus, selectedRig } from '../lib/stores';
  import type { Rig, Agent } from '../lib/gt-client';

  // Show agents for selected rig, or HQ agents if nothing selected
  $: displayAgents = $selectedRig
    ? $selectedRig.agents
    : ($townStatus?.agents ?? []);

  $: displayLabel = $selectedRig ? $selectedRig.name : 'HQ';

  const roleIcons: Record<string, string> = {
    coordinator: '\u{1F451}',  // crown
    witness: '\u{1F441}',     // eye
    refinery: '\u{2699}\uFE0F', // gear
    'health-check': '\u{1FA7A}', // stethoscope
  };

  function getIcon(agent: Agent): string {
    return roleIcons[agent.role] || '\u{1F464}';
  }

  function statusClass(agent: Agent): string {
    if (!agent.running) return 'offline';
    if (agent.has_work) return 'active';
    return 'idle';
  }

  function statusLabel(agent: Agent): string {
    if (!agent.running) return 'OFF';
    if (agent.has_work) return 'BUSY';
    return 'IDLE';
  }
</script>

<div class="agent-grid">
  <div class="grid-label">{displayLabel}</div>
  {#each displayAgents as agent}
    <div class="agent-portrait">
      <div class="portrait-frame">
        <div class="portrait-image">{getIcon(agent)}</div>
        <div class="portrait-name">{agent.name}</div>
      </div>
      <div class="portrait-status {statusClass(agent)}">{statusLabel(agent)}</div>
      {#if agent.unread_mail > 0}
        <div class="mail-dot"></div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .agent-grid {
    flex: 1;
    display: flex;
    gap: 12px;
    padding: 15px;
    background: rgba(0,0,0,0.3);
    align-items: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
    position: relative;
  }

  .grid-label {
    position: absolute;
    top: 4px;
    left: 15px;
    font-size: 10px;
    font-weight: 700;
    color: #8b7355;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .agent-portrait {
    background: linear-gradient(135deg, #2a1f15 0%, #1a1209 100%);
    border: 3px solid #6b5644;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.6);
    position: relative;
    width: 100px;
    margin-top: 10px;
  }

  .agent-portrait:hover {
    border-color: #d4af37;
    transform: translateY(-3px);
    box-shadow: inset 0 0 20px rgba(212,175,55,0.3), 0 8px 20px rgba(0,0,0,0.8);
  }

  .portrait-frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .portrait-image {
    font-size: 36px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.8));
  }

  .portrait-name {
    font-size: 10px;
    font-weight: 700;
    color: #d4af37;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .portrait-status {
    margin-top: 6px;
    padding: 3px 6px;
    font-size: 9px;
    font-weight: 700;
    text-align: center;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .portrait-status.active {
    background: rgba(74,222,128,0.2);
    color: #4ade80;
    border: 1px solid #4ade80;
  }

  .portrait-status.idle {
    background: rgba(255,165,0,0.2);
    color: #ffa500;
    border: 1px solid #ffa500;
  }

  .portrait-status.offline {
    background: rgba(102,102,102,0.2);
    color: #666;
    border: 1px solid #444;
  }

  .mail-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background: #ff4444;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255,68,68,0.5);
  }
</style>
