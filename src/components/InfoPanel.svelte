<script lang="ts">
  import { selectedRig } from '../lib/stores';
  import type { Rig } from '../lib/gt-client';

  const rigIcons: Record<string, string> = {
    traingame: '\u{1F3F0}',
    thenazerene: '\u{26EA}',
    uiagentrts: '\u{1F5FC}',
    beads: '\u{1F4BF}',
    gastown: '\u{26FD}',
    wyvern: '\u{1F409}',
    brokerbuster: '\u{1F4B0}',
    intent2software: '\u{1F4A1}',
    lancepoint: '\u{1F3AF}',
  };

  function getIcon(name: string): string {
    return rigIcons[name] || '\u{1F3E0}';
  }
</script>

{#if $selectedRig}
  <div class="info-panel">
    <div class="info-header">
      <span class="info-icon">{getIcon($selectedRig.name)}</span>
      <span class="info-title">{$selectedRig.name.toUpperCase()}</span>
    </div>
    <div class="info-content">
      <div class="info-stats">
        <div class="stat-row">
          <span class="stat-label">Agents:</span>
          <span class="stat-value">{$selectedRig.agents.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Running:</span>
          <span class="stat-value" class:active={$selectedRig.agents.some(a => a.running)}>
            {$selectedRig.agents.filter(a => a.running).length}
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Polecats:</span>
          <span class="stat-value">{$selectedRig.polecat_count}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Witness:</span>
          <span class="stat-value" class:active={$selectedRig.has_witness}>
            {$selectedRig.has_witness ? 'YES' : 'NO'}
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Refinery:</span>
          <span class="stat-value" class:active={$selectedRig.has_refinery}>
            {$selectedRig.has_refinery ? 'YES' : 'NO'}
          </span>
        </div>
      </div>
      <div class="info-agents">
        {#each $selectedRig.agents as agent}
          <div class="agent-row">
            <span class="agent-name">{agent.name}</span>
            <span class="agent-status" class:running={agent.running}>
              {agent.running ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .info-panel {
    position: absolute;
    top: 60px;
    right: 300px;
    width: 300px;
    background: linear-gradient(135deg, rgba(42,31,21,0.98) 0%, rgba(26,18,9,0.98) 100%);
    border: 3px solid #6b5644;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5);
    z-index: 1000;
  }

  .info-header {
    background: linear-gradient(180deg, #4a3a26 0%, #2d2416 100%);
    border-bottom: 2px solid #8b7355;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 5px 5px 0 0;
  }

  .info-icon {
    font-size: 32px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.8));
  }

  .info-title {
    font-size: 16px;
    font-weight: 700;
    color: #d4af37;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    letter-spacing: 1px;
  }

  .info-content { padding: 15px; }

  .info-stats { margin-bottom: 15px; }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(107,86,68,0.3);
  }

  .stat-label { font-size: 12px; color: #b39c7a; }

  .stat-value {
    font-size: 12px;
    font-weight: 700;
    color: #d4af37;
  }

  .stat-value.active { color: #4ade80; }

  .info-agents {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .agent-row {
    display: flex;
    justify-content: space-between;
    background: rgba(0,0,0,0.4);
    border: 1px solid #6b5644;
    padding: 8px 10px;
    font-size: 11px;
  }

  .agent-name { color: #d4af37; font-weight: 700; }

  .agent-status {
    color: #666;
    font-weight: 700;
    font-size: 10px;
  }

  .agent-status.running { color: #4ade80; }
</style>
