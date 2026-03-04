<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Rig } from '../lib/gt-client';

  export let rig: Rig;
  export let icon: string;
  export let status: string; // 'active' | 'idle' | 'docked'
  export let x: number;
  export let y: number;
  export let selected: boolean = false;

  const dispatch = createEventDispatcher();

  function statusLabel(s: string): string {
    if (s === 'active') return 'ACTIVE';
    if (s === 'idle') return 'IDLE';
    return 'DOCKED';
  }

  function statusClass(s: string): string {
    if (s === 'active') return 'active';
    if (s === 'idle') return 'idle';
    return 'docked';
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="agent-building"
  class:selected
  style="left: {x}%; top: {y}%;"
  on:click|stopPropagation={() => dispatch('select')}
>
  <div class="building-model">{icon}</div>
  <div class="building-label">
    {rig.name}
    {#if rig.polecat_count > 0}
      <span class="polecat-badge">{rig.polecat_count}</span>
    {/if}
  </div>
  <div class="building-status {statusClass(status)}">{statusLabel(status)}</div>
  {#if rig.agents.some(a => a.unread_mail > 0)}
    <div class="mail-badge">!</div>
  {/if}
</div>

<style>
  .agent-building {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.3s ease;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.8));
  }

  .agent-building:hover {
    transform: translate(-50%, -50%) scale(1.1);
    filter: drop-shadow(0 12px 24px rgba(212, 175, 55, 0.6));
  }

  .agent-building.selected {
    filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.8));
  }

  .building-model {
    font-size: 64px;
    text-align: center;
    margin-bottom: 8px;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .building-label {
    background: linear-gradient(180deg, rgba(42, 31, 21, 0.95) 0%, rgba(26, 18, 9, 0.95) 100%);
    border: 2px solid #6b5644;
    padding: 6px 12px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0,0,0,0.8);
    position: relative;
  }

  .polecat-badge {
    background: #00bfff;
    color: #000;
    font-size: 10px;
    padding: 1px 5px;
    border-radius: 8px;
    margin-left: 4px;
  }

  .building-status {
    background: rgba(0,0,0,0.8);
    border: 1px solid #6b5644;
    padding: 4px 8px;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .building-status.active {
    color: #4ade80;
    border-color: #4ade80;
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
  }

  .building-status.idle {
    color: #ffa500;
    border-color: #ffa500;
  }

  .building-status.docked {
    color: #666;
    border-color: #444;
  }

  .mail-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    animation: pulse 1.5s infinite;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.9); }
  }
</style>
