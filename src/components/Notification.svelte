<script lang="ts">
  import { notifications } from '../lib/stores';

  const typeColors: Record<string, string> = {
    info: 'rgba(212, 175, 55, 0.95)',
    success: 'rgba(74, 222, 128, 0.95)',
    warning: 'rgba(255, 165, 0, 0.95)',
    error: 'rgba(255, 68, 68, 0.95)',
  };
</script>

<div class="notification-container">
  {#each $notifications as notif (notif.id)}
    <div
      class="notification {notif.type}"
      style="background: {typeColors[notif.type]}"
    >
      {notif.message}
    </div>
  {/each}
</div>

<style>
  .notification-container {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .notification {
    color: #1a1209;
    padding: 12px 30px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 14px;
    font-family: 'Cinzel', serif;
    box-shadow: 0 8px 24px rgba(0,0,0,0.8);
    border: 2px solid #8b7355;
    animation: slideDown 0.3s ease;
    white-space: nowrap;
  }

  .notification.error {
    color: #fff;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
