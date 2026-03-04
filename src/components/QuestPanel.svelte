<script lang="ts">
  import { readyItems } from '../lib/stores';
  import type { ReadyItem } from '../lib/gt-client';

  function priorityColor(p: number): string {
    if (p <= 1) return '#ff0000';
    if (p === 2) return '#ffa500';
    if (p === 3) return '#4ade80';
    return '#666';
  }

  function priorityLabel(p: number): string {
    if (p <= 1) return '!';
    if (p === 2) return '~';
    return '-';
  }
</script>

<div class="side-panel">
  <div class="panel-header">
    <span class="panel-icon">&#x1F4DC;</span>
    <span class="panel-title">QUESTS</span>
    <span class="quest-count">{$readyItems.length}</span>
  </div>
  <div class="panel-content">
    {#if $readyItems.length === 0}
      <div class="empty-state">No quests available</div>
    {:else}
      {#each $readyItems as item}
        <div class="quest-item">
          <div class="quest-header">
            <span class="quest-priority" style="background: {priorityColor(item.priority)}">
              {priorityLabel(item.priority)}
            </span>
            <span class="quest-name">{item.title}</span>
          </div>
          <div class="quest-meta">
            <span class="quest-source">{item.source}</span>
            <span class="quest-id">{item.id}</span>
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
    position: relative;
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

  .quest-count {
    margin-left: auto;
    background: rgba(0,0,0,0.5);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    color: #ffd700;
  }

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

  .quest-item {
    background: rgba(0,0,0,0.4);
    border: 1px solid #6b5644;
    border-left: 3px solid #d4af37;
    padding: 10px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .quest-item:hover {
    background: rgba(212, 175, 55, 0.1);
    border-left-color: #ffd700;
    transform: translateX(3px);
  }

  .quest-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .quest-priority {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    color: #fff;
    flex-shrink: 0;
  }

  .quest-name {
    font-weight: 700;
    font-size: 12px;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quest-meta {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #8b7355;
  }

  .quest-source { color: #b39c7a; }
  .quest-id { color: #666; font-family: monospace; }
</style>
