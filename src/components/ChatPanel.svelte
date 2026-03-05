<script lang="ts">
  import { chatMessages, addChatMessage, addNotification } from '../lib/stores';
  import { runCommand, sendMail } from '../lib/gt-client';
  import { tick } from 'svelte';

  let input = '';
  let messagesEl: HTMLDivElement;
  let mayorTalking = false;
  let talkTimer: ReturnType<typeof setTimeout> | null = null;

  $: msgs = $chatMessages;

  // Auto-scroll on new messages
  $: if (msgs.length && messagesEl) {
    tick().then(() => {
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  // Trigger mayor talking animation
  function mayorSpeak(durationMs = 2500) {
    mayorTalking = true;
    if (talkTimer) clearTimeout(talkTimer);
    talkTimer = setTimeout(() => { mayorTalking = false; }, durationMs);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    input = '';

    addChatMessage('user', text);

    // Detect if it's a gt command
    if (text.startsWith('gt ') || text.startsWith('bd ')) {
      const cmd = text.startsWith('gt ') ? text.slice(3) : text;
      addChatMessage('system', `Executing: ${text}`);
      try {
        const res = await runCommand(cmd, true);
        if (res.success) {
          const output = res.output?.trim() || 'Command completed.';
          mayorSpeak(Math.min(output.length * 30, 4000));
          addChatMessage('mayor', output);
        } else {
          addChatMessage('system', `Error: ${res.error ?? 'Command failed'}`);
        }
      } catch (err: any) {
        addChatMessage('system', `Error: ${err.message}`);
      }
    } else if (text.startsWith('/')) {
      // Slash commands
      const parts = text.slice(1).split(' ');
      const cmd = parts[0];
      if (cmd === 'status') {
        addChatMessage('system', 'Fetching status...');
        try {
          const res = await runCommand('status --json', false);
          if (res.success && res.output) {
            mayorSpeak(1500);
            addChatMessage('mayor', 'Status refreshed. Check the map.');
            window.dispatchEvent(new CustomEvent('gt-refresh'));
          }
        } catch { addChatMessage('system', 'Failed to get status'); }
      } else if (cmd === 'help') {
        mayorSpeak(3000);
        addChatMessage('mayor', [
          'Available commands:',
          '  gt <command>  — Run any gt command',
          '  bd <command>  — Run any bd command',
          '  /status       — Refresh dashboard',
          '  /help         — Show this help',
          '  /clear        — Clear chat',
          '',
          'Or just type a message to chat.',
        ].join('\n'));
      } else if (cmd === 'clear') {
        chatMessages.set([]);
        addChatMessage('system', 'Chat cleared.');
      } else {
        addChatMessage('system', `Unknown command: /${cmd}. Try /help`);
      }
    } else {
      // Regular chat message — send as mail via JSON endpoint
      addChatMessage('system', 'Sending to Mayor...');
      try {
        const res = await sendMail('mayor/', 'Chat', text);
        if (res.success) {
          mayorSpeak(2000);
          addChatMessage('mayor', 'Message received. I\'ll look into it.');
        } else {
          addChatMessage('system', res.error ?? 'Failed to send');
        }
      } catch (err: any) {
        addChatMessage('system', `Send failed: ${err.message}`);
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<div class="chat-panel">
  <!-- Mayor Portrait + Header -->
  <div class="chat-header">
    <div class="mayor-portrait-frame" class:talking={mayorTalking}>
      <div class="portrait-border">
        <img src="/portraits/thrall.png" alt="Mayor" class="mayor-portrait-img" />
        <!-- Animated talk overlay -->
        {#if mayorTalking}
          <div class="talk-overlay"></div>
        {/if}
      </div>
      <!-- Gem indicator at bottom of frame -->
      <div class="portrait-gem" class:active={mayorTalking}></div>
    </div>
    <div class="header-info">
      <span class="chat-title">TOWN HALL</span>
      <span class="mayor-name" class:talking={mayorTalking}>
        {mayorTalking ? 'Mayor is speaking...' : 'Mayor — Idle'}
      </span>
    </div>
  </div>

  <div class="chat-messages" bind:this={messagesEl}>
    {#if msgs.length === 0}
      <div class="chat-empty">Type a command or message. Try /help</div>
    {:else}
      {#each msgs as msg}
        <div class="chat-msg {msg.from}">
          <span class="msg-prefix">
            {#if msg.from === 'user'}&#9654;
            {:else if msg.from === 'mayor'}&#128081;
            {:else}&#9881;{/if}
          </span>
          <span class="msg-text">{msg.text}</span>
          <span class="msg-time">{formatTime(msg.timestamp)}</span>
        </div>
      {/each}
    {/if}
  </div>
  <div class="chat-input-area">
    <input
      type="text"
      class="chat-input"
      placeholder="gt sling ui-nfl uiagentrts"
      bind:value={input}
      on:keydown={handleKeydown}
    />
    <button class="chat-send" on:click={send}>&#9654;</button>
  </div>
</div>

<style>
  .chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #2d2416 0%, #1a1409 100%);
    border-left: 3px solid #6b5644;
    min-width: 0;
    position: relative;
  }

  .chat-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent, #d4af37 50%, transparent);
    pointer-events: none;
  }

  /* ---- Mayor Portrait ---- */
  .chat-header {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(107,86,68,0.5);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mayor-portrait-frame {
    position: relative;
    flex-shrink: 0;
  }

  .portrait-border {
    width: 52px;
    height: 52px;
    border: 2px solid #6b5644;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    background: #0d0a05;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.8);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .mayor-portrait-frame.talking .portrait-border {
    border-color: #d4af37;
    box-shadow:
      inset 0 0 8px rgba(0,0,0,0.8),
      0 0 12px rgba(212,175,55,0.4),
      0 0 24px rgba(212,175,55,0.15);
  }

  .mayor-portrait-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }

  /* Talking mouth animation overlay — subtle brightness pulse on lower half */
  .talk-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(0deg, rgba(212,175,55,0.15) 0%, transparent 100%);
    animation: talk-pulse 0.3s ease-in-out infinite alternate;
    pointer-events: none;
  }

  @keyframes talk-pulse {
    0% { opacity: 0.3; transform: scaleY(0.8); }
    100% { opacity: 1; transform: scaleY(1.1); }
  }

  .portrait-gem {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3a3020;
    border: 1px solid #6b5644;
    transition: all 0.3s;
  }

  .portrait-gem.active {
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
    border-color: #4ade80;
  }

  .header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .chat-title {
    font-size: 10px;
    font-weight: 700;
    color: #d4af37;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }

  .mayor-name {
    font-size: 9px;
    color: #6b5644;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    transition: color 0.3s;
  }

  .mayor-name.talking {
    color: #4ade80;
    animation: name-glow 0.6s ease-in-out infinite alternate;
  }

  @keyframes name-glow {
    0% { text-shadow: 1px 1px 2px rgba(0,0,0,0.6); }
    100% { text-shadow: 0 0 6px rgba(74,222,128,0.4), 1px 1px 2px rgba(0,0,0,0.6); }
  }

  /* ---- Chat Messages ---- */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-height: 0;
  }

  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: #6b5644; border-radius: 2px; }

  .chat-empty {
    color: #6b5644;
    font-size: 10px;
    font-style: italic;
    text-align: center;
    padding: 20px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .chat-msg {
    display: flex;
    gap: 6px;
    align-items: flex-start;
    font-size: 10px;
    line-height: 1.4;
    padding: 3px 6px;
    border-radius: 3px;
  }

  .chat-msg.user {
    color: #4fc3f7;
  }

  .chat-msg.mayor {
    color: #4ade80;
    background: rgba(74,222,128,0.05);
  }

  .chat-msg.system {
    color: #6b5644;
    font-style: italic;
  }

  .msg-prefix {
    flex-shrink: 0;
    font-size: 9px;
    margin-top: 1px;
  }

  .msg-text {
    flex: 1;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Cinzel', serif;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  }

  .msg-time {
    flex-shrink: 0;
    font-size: 8px;
    color: #6b5644;
    font-family: monospace;
  }

  .chat-input-area {
    display: flex;
    gap: 0;
    border-top: 1px solid rgba(107,86,68,0.5);
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    background: rgba(13,10,5,0.6);
    border: none;
    color: #f4e4c1;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    padding: 8px 10px;
    outline: none;
  }

  .chat-input::placeholder {
    color: #6b5644;
    font-style: italic;
  }

  .chat-input:focus {
    background: rgba(13,10,5,0.8);
  }

  .chat-send {
    background: rgba(107,86,68,0.3);
    border: none;
    border-left: 1px solid rgba(107,86,68,0.5);
    color: #d4af37;
    font-size: 12px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .chat-send:hover {
    background: rgba(212,175,55,0.2);
  }
</style>
