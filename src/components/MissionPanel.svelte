<script lang="ts">
  import { townStatus } from '../lib/stores';
  import type { Rig, Agent } from '../lib/gt-client';

  interface Mission {
    name: string;
    rig: string;
    agents: string[];
    polecatCount: number;
    priority: 'high' | 'medium' | 'low';
  }

  // Derive active missions from rigs that have running agents or polecats
  $: missions = ($townStatus?.rigs ?? [])
    .filter(r => r.agents.some(a => a.running) || r.polecat_count > 0)
    .map(r => ({
      name: r.name,
      rig: r.name,
      agents: r.agents.filter(a => a.running).map(a => a.name),
      polecatCount: r.polecat_count,
      priority: r.polecat_count > 0 ? 'high' as const :
                r.agents.some(a => a.has_work) ? 'medium' as const : 'low' as const,
    }));

  function priorityIcon(p: string): string {
    if (p === 'high') return '!';
    if (p === 'medium') return '~';
    return '-';
  }
</script>

<div class="side-panel">
  <div class="panel-header">
    <span class="panel-icon">&#x26A1;</span>
    <span class="panel-title">ACTIVE RIGS</span>
  </div>
  <div class="panel-content">
    {#if missions.length === 0}
      <div class="empty-state">No active rigs</div>
    {:else}
      {#each missions as mission}
        <div class="active-mission">
          <div class="mission-header">
            <span class="mission-priority {mission.priority}">{priorityIcon(mission.priority)}</span>
            <span class="mission-name">{mission.name}</span>
          </div>
          <div class="mission-agents">
            {#each mission.agents as agent}
              <span class="agent-chip">{agent}</span>
            {/each}
            {#if mission.polecatCount > 0}
              <span class="agent-chip polecat">{mission.polecatCount} polecat{mission.polecatCount > 1 ? 's' : ''}</span>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .side-panel {
    width: 280px;
    background: linear-gradient(180deg, #2a1f15 0%, #1a1209 100%);
    border: 3px solid #6b5644;
    border-top: none;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    background: linear-gradient(180deg, #4a3a26 0%, #2d2416 100%);
    border-bottom: 2px solid #8b7355;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 2px;
    color: #d4af37;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }

  .panel-icon { font-size: 18px; }

  .panel-content {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }

  .panel-content::-webkit-scrollbar { width: 8px; }
  .panel-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
  .panel-content::-webkit-scrollbar-thumb { background: #6b5644; border-radius: 4px; }

  .empty-state {
    color: #666;
    text-align: center;
    padding: 20px;
    font-size: 12px;
  }

  .active-mission {
    background: linear-gradient(135deg, rgba(42,31,21,0.8) 0%, rgba(26,18,9,0.8) 100%);
    border: 2px solid #6b5644;
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }

  .mission-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .mission-priority {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
  }

  .mission-priority.high {
    background: #ff0000;
    box-shadow: 0 0 15px rgba(255,0,0,0.5);
  }

  .mission-priority.medium {
    background: #ffa500;
    box-shadow: 0 0 15px rgba(255,165,0,0.5);
  }

  .mission-priority.low {
    background: #4ade80;
    color: #000;
    box-shadow: 0 0 15px rgba(74,222,128,0.5);
  }

  .mission-name {
    font-weight: 700;
    font-size: 13px;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .mission-agents {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .agent-chip {
    background: rgba(0,0,0,0.5);
    border: 1px solid #6b5644;
    padding: 4px 10px;
    font-size: 10px;
    border-radius: 12px;
    color: #d4af37;
  }

  .agent-chip.polecat {
    border-color: #00bfff;
    color: #00bfff;
  }
</style>
