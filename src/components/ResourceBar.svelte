<script lang="ts">
  import { totalAgents, unreadMail, runningAgents, totalPolecats, connected } from '../lib/stores';
</script>

<div class="resource-bar">
  <div class="resource-group">
    <div class="resource gold">
      <span class="resource-icon">&#9884;&#65039;</span>
      <span class="resource-value">{$totalAgents}</span>
      <span class="resource-label">Agents</span>
    </div>
    <div class="resource lumber">
      <span class="resource-icon">&#x1F4EC;</span>
      <span class="resource-value">{$unreadMail}</span>
      <span class="resource-label">Unread</span>
    </div>
    <div class="resource food">
      <span class="resource-icon">&#x1F3ED;</span>
      <span class="resource-value">{$runningAgents}/{$totalAgents}</span>
      <span class="resource-label">Active</span>
    </div>
    <div class="resource polecats">
      <span class="resource-icon">&#x2692;&#xFE0F;</span>
      <span class="resource-value">{$totalPolecats}</span>
      <span class="resource-label">Polecats</span>
    </div>
  </div>
  <div class="status-indicator" class:online={$connected} class:offline={!$connected}>
    <span class="status-dot"></span>
    {$connected ? 'ONLINE' : 'OFFLINE'}
  </div>
</div>

<style>
  .resource-bar {
    height: 50px;
    background: linear-gradient(180deg, #2d2416 0%, #1a1409 100%);
    border-bottom: 3px solid #8b7355;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.8);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    position: relative;
  }

  .resource-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }

  .resource-group {
    display: flex;
    gap: 30px;
  }

  .resource {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 14px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    padding: 5px 15px;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }

  .resource-icon { font-size: 18px; }

  .resource.gold .resource-value { color: #ffd700; }
  .resource.lumber .resource-value { color: #4ade80; }
  .resource.food .resource-value { color: #ff6b6b; }
  .resource.polecats .resource-value { color: #00bfff; }

  .resource-label {
    font-size: 10px;
    color: #8b7355;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 14px;
    padding: 8px 20px;
    border-radius: 20px;
    background: rgba(0,0,0,0.4);
  }

  .status-indicator.online {
    border: 2px solid #4ade80;
    color: #4ade80;
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }

  .status-indicator.offline {
    border: 2px solid #ff4444;
    color: #ff4444;
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .online .status-dot {
    background: #4ade80;
    box-shadow: 0 0 15px #4ade80;
  }

  .offline .status-dot {
    background: #ff4444;
    box-shadow: 0 0 15px #ff4444;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
  }
</style>
