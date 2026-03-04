<script lang="ts">
  import { onMount } from 'svelte';
  import { rigs } from '../lib/stores';
  import type { Rig } from '../lib/gt-client';

  let canvas: HTMLCanvasElement;
  const SIZE = 180;

  const positions = [
    { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 80, y: 22 },
    { x: 15, y: 45 }, { x: 45, y: 40 }, { x: 75, y: 48 },
    { x: 25, y: 70 }, { x: 55, y: 65 }, { x: 82, y: 72 },
    { x: 35, y: 85 }, { x: 65, y: 82 }, { x: 90, y: 88 },
  ];

  function getColor(rig: Rig): string {
    const running = rig.agents.filter(a => a.running).length;
    if (rig.polecat_count > 0) return '#4ade80';
    if (running > 0) return '#ffa500';
    return '#666';
  }

  function draw(rigsList: Rig[]) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const gradient = ctx.createRadialGradient(90, 90, 0, 90, 90, 90);
    gradient.addColorStop(0, '#2d5a2d');
    gradient.addColorStop(1, '#1a4d1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= SIZE; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(SIZE, i);
      ctx.stroke();
    }

    // Rig dots
    rigsList.forEach((rig, i) => {
      const pos = positions[i];
      if (!pos) return;
      const color = getColor(rig);
      const cx = (pos.x / 100) * SIZE;
      const cy = (pos.y / 100) * SIZE;

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Border
    ctx.strokeStyle = '#6b5644';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, SIZE, SIZE);
  }

  // Redraw when rigs change
  $: draw($rigs);

  onMount(() => {
    draw($rigs);
  });
</script>

<div class="minimap-container">
  <div class="minimap-header">TACTICAL MAP</div>
  <canvas bind:this={canvas} width={SIZE} height={SIZE}></canvas>
</div>

<style>
  .minimap-container {
    width: 220px;
    background: linear-gradient(135deg, #2a1f15 0%, #1a1209 100%);
    border-right: 2px solid #6b5644;
    padding: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.7);
  }

  .minimap-header {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #d4af37;
    text-align: center;
    margin-bottom: 8px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  canvas {
    border: 2px solid #6b5644;
    background: #0d260d;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5);
  }
</style>
