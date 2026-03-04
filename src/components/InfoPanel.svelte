<script lang="ts">
  import { selectedRig } from '../lib/stores';

  $: rig = $selectedRig;
  $: runningAgents = rig?.agents.filter(a => a.running).length ?? 0;

  const buildingIcons: Record<string, string> = {
    traingame: '\u{1F3F0}',
    thenazerene: '\u{26EA}',
    uiagentrts: '\u{1F5FC}',
    beads: '\u{1F48E}',
    gastown: '\u{26FD}',
    brokerbuster: '\u{1F4B0}',
    intent2software: '\u{1F4A1}',
    giftwebsite: '\u{1F381}',
    ofspcalc: '\u{1F9EE}',
    ofspfarmassistant: '\u{1F33E}',
    slipmap: '\u{1F5FA}',
    lancepoint: '\u{1F3AF}',
  };
</script>

{#if false}
  <!-- InfoPanel disabled: replaced by RigInterior view -->
  <div class="info-panel">
    <div class="info-header">
      <span class="info-icon">{buildingIcons[rig.name] ?? '\u{1F3E0}'}</span>
      <span class="info-name">{rig.name.toUpperCase()}</span>
      <button class="close-btn" on:click={() => selectedRig.set(null)}>&#10006;</button>
    </div>

    <div class="info-body">
      <div class="info-row">
        <span class="label">Agents</span>
        <span class="value">{runningAgents} / {rig.agents.length}</span>
      </div>
      <div class="info-row">
        <span class="label">Polecats</span>
        <span class="value">{rig.polecat_count}</span>
      </div>
      <div class="info-row">
        <span class="label">Crew</span>
        <span class="value">{rig.crew_count}</span>
      </div>
      <div class="info-row">
        <span class="label">Witness</span>
        <span class="value" class:yes={rig.has_witness}>{rig.has_witness ? 'Running' : 'Off'}</span>
      </div>
      <div class="info-row">
        <span class="label">Refinery</span>
        <span class="value" class:yes={rig.has_refinery}>{rig.has_refinery ? 'Running' : 'Off'}</span>
      </div>

      {#if rig.agents.length > 0}
        <div class="agent-section">
          <div class="section-title">AGENTS</div>
          {#each rig.agents as agent}
            <div class="agent-row">
              <span class="agent-dot" class:running={agent.running}></span>
              <span class="agent-name">{agent.name}</span>
              <span class="agent-role">{agent.role}</span>
            </div>
          {/each}
        </div>
      {/if}

      {#if rig.crews && rig.crews.length > 0}
        <div class="agent-section">
          <div class="section-title">CREW</div>
          {#each rig.crews as name}
            <div class="agent-row">
              <span class="agent-dot running"></span>
              <span class="agent-name">{name}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .info-panel {
    position: absolute;
    top: 60px;
    right: 292px;
    width: 280px;
    background: linear-gradient(180deg, #2d2416 0%, #1a1409 100%);
    border: 3px solid #6b5644;
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(139,115,85,0.3);
    z-index: 100;
    overflow: hidden;
  }

  .info-panel::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 4px;
    pointer-events: none;
  }

  .info-header {
    padding: 12px 16px;
    background: linear-gradient(180deg, #3d2e1a 0%, #2d2416 100%);
    border-bottom: 2px solid #6b5644;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }

  .info-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }

  .info-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  }

  .info-name {
    font-size: 14px;
    font-weight: 800;
    color: #d4af37;
    letter-spacing: 2px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    flex: 1;
  }

  .close-btn {
    background: none;
    border: none;
    color: #6b5644;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 3px;
    font-family: inherit;
    transition: all 0.15s;
  }

  .close-btn:hover {
    color: #d4af37;
    background: rgba(212,175,55,0.1);
  }

  .info-body {
    padding: 12px 16px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid rgba(107,86,68,0.3);
  }

  .label {
    font-size: 11px;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  }

  .value {
    font-size: 11px;
    font-weight: 600;
    color: #f4e4c1;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  }

  .value.yes { color: #4ade80; text-shadow: 0 0 6px rgba(74,222,128,0.3); }

  .agent-section {
    margin-top: 12px;
  }

  .section-title {
    font-size: 9px;
    font-weight: 700;
    color: #d4af37;
    letter-spacing: 3px;
    margin-bottom: 8px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .agent-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    font-size: 11px;
    border-left: 3px solid transparent;
    transition: all 0.15s;
    border-radius: 2px;
  }

  .agent-row:hover {
    background: rgba(45, 36, 22, 0.4);
    border-left-color: #d4af37;
    transform: translateX(4px);
  }

  .agent-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6b5644;
    flex-shrink: 0;
  }

  .agent-dot.running {
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80;
  }

  .agent-name {
    color: #f4e4c1;
    flex: 1;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  }

  .agent-role {
    color: #b39c7a;
    font-size: 10px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  }
</style>
