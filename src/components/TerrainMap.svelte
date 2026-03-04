<script lang="ts">
  import { onMount } from 'svelte';
  import { rigs, selectedRig } from '../lib/stores';
  import Building from './Building.svelte';
  import type { Rig } from '../lib/gt-client';

  let canvas: HTMLCanvasElement;

  // Predefined building positions for up to 12 rigs
  const positions = [
    { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 80, y: 22 },
    { x: 15, y: 45 }, { x: 45, y: 40 }, { x: 75, y: 48 },
    { x: 25, y: 70 }, { x: 55, y: 65 }, { x: 82, y: 72 },
    { x: 35, y: 85 }, { x: 65, y: 82 }, { x: 90, y: 88 },
  ];

  // Building emoji mapping based on rig name
  const rigIcons: Record<string, string> = {
    traingame: '\u{1F3F0}',     // castle
    thenazerene: '\u{26EA}',    // church
    uiagentrts: '\u{1F5FC}',    // tower
    beads: '\u{1F4BF}',         // disc
    gastown: '\u{26FD}',        // fuel pump
    wyvern: '\u{1F409}',        // dragon
    brokerbuster: '\u{1F4B0}',  // money bag
    intent2software: '\u{1F4A1}', // lightbulb
    lancepoint: '\u{1F3AF}',    // target
  };

  function getRigIcon(name: string): string {
    return rigIcons[name] || '\u{1F3E0}';
  }

  function getRigStatus(rig: Rig): string {
    const running = rig.agents.filter(a => a.running).length;
    if (running === 0) return 'docked';
    if (rig.polecat_count > 0) return 'active';
    if (running > 0) return 'idle';
    return 'docked';
  }

  function selectRig(rig: Rig) {
    selectedRig.set(rig);
  }

  function handleBackgroundClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('terrain-overlay') ||
        (e.target as HTMLElement).tagName === 'CANVAS') {
      selectedRig.set(null);
    }
  }

  onMount(() => {
    if (!canvas) return;
    drawTerrain();
    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawTerrain();
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  });

  function drawTerrain() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Base terrain gradient
    const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.5);
    gradient.addColorStop(0, '#2d5a2d');
    gradient.addColorStop(0.5, '#1a4d1a');
    gradient.addColorStop(1, '#0d260d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Terrain texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    // Use seeded positions so they don't flicker on redraw
    for (let i = 0; i < 50; i++) {
      const seed = i * 137.5;
      const x = (seed * 7.3) % w;
      const y = (seed * 13.7) % h;
      const size = (seed % 30) + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paths connecting buildings
    ctx.strokeStyle = 'rgba(139, 90, 43, 0.4)';
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.3);
    ctx.quadraticCurveTo(w * 0.4, h * 0.5, w * 0.6, h * 0.4);
    ctx.lineTo(w * 0.8, h * 0.7);
    ctx.stroke();

    // Lighting
    const lightGradient = ctx.createRadialGradient(w*0.3, h*0.2, 0, w*0.3, h*0.2, w*0.6);
    lightGradient.addColorStop(0, 'rgba(255, 255, 200, 0.1)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, w, h);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="game-view" on:click={handleBackgroundClick}>
  <canvas bind:this={canvas}></canvas>
  <div class="terrain-overlay">
    {#each $rigs as rig, i}
      <Building
        {rig}
        icon={getRigIcon(rig.name)}
        status={getRigStatus(rig)}
        x={positions[i]?.x ?? 50}
        y={positions[i]?.y ?? 50}
        selected={$selectedRig?.name === rig.name}
        on:select={() => selectRig(rig)}
      />
    {/each}
  </div>
</div>

<style>
  .game-view {
    flex: 1;
    position: relative;
    background:
      linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
      radial-gradient(circle at 50% 50%, #1a4d1a 0%, #0d260d 100%);
    box-shadow: inset 0 0 100px rgba(0,0,0,0.7);
    overflow: hidden;
  }

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .terrain-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.05) 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.05) 51px);
  }
</style>
