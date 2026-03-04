<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getStatus, getMailInbox, getReady, connectSSE } from './lib/gt-client';
  import { townStatus, mailInbox, readyItems, connected, addNotification } from './lib/stores';
  import ResourceBar from './components/ResourceBar.svelte';
  import TerrainMap from './components/TerrainMap.svelte';
  import QuestPanel from './components/QuestPanel.svelte';
  import MissionPanel from './components/MissionPanel.svelte';
  import CommandGrid from './components/CommandGrid.svelte';
  import Minimap from './components/Minimap.svelte';
  import AgentPortrait from './components/AgentPortrait.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import Notification from './components/Notification.svelte';

  let eventSource: EventSource | null = null;

  async function refresh() {
    try {
      const [status, mail, ready] = await Promise.all([
        getStatus(),
        getMailInbox(),
        getReady(),
      ]);
      townStatus.set(status);
      mailInbox.set(mail);
      readyItems.set(ready.items ?? []);
      connected.set(true);
    } catch (err: any) {
      console.error('[refresh] Failed:', err);
      connected.set(false);
      addNotification('Failed to connect to Gas Town dashboard', 'error');
    }
  }

  onMount(() => {
    refresh();
    eventSource = connectSSE(
      () => {
        refresh();
      },
      () => {
        connected.set(false);
      }
    );
  });

  onDestroy(() => {
    eventSource?.close();
  });
</script>

<div class="game-container">
  <ResourceBar />

  <div class="main-game-area">
    <QuestPanel />
    <TerrainMap />
    <MissionPanel />
  </div>

  <div class="command-panel">
    <Minimap />
    <AgentPortrait />
    <CommandGrid />
  </div>

  <InfoPanel />
  <Notification />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Cinzel', serif;
    background: #000;
    overflow: hidden;
    color: #f4e4c1;
  }

  .game-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  }

  .main-game-area {
    flex: 1;
    display: flex;
    gap: 0;
    overflow: hidden;
  }

  .command-panel {
    height: 200px;
    background: linear-gradient(180deg, #2d2416 0%, #1a1409 100%);
    border-top: 3px solid #8b7355;
    box-shadow: inset 0 4px 20px rgba(0,0,0,0.8), 0 -4px 12px rgba(0,0,0,0.8);
    display: flex;
    gap: 0;
    position: relative;
  }

  .command-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
</style>
