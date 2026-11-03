/**
 * Zero-dependency canvas confetti burst for completion moments.
 */
export function triggerCompletionConfetti(): void {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      document.body.removeChild(canvas);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#35E0D0', '#48C8F5', '#C4B5FD', '#A78BFA', '#4ADE80', '#FBBF24'];
    const particleCount = 70;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      vr: number;
      opacity: number;
    }> = [];

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.4;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        opacity: 1,
      });
    }

    let frames = 0;
    const maxFrames = 100;

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.vr;
        p.opacity = Math.max(0, 1 - frames / maxFrames);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      }

      frames++;
      if (frames < maxFrames) {
        requestAnimationFrame(render);
      } else {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    requestAnimationFrame(render);
  } catch (err) {
    console.debug('Confetti suppressed:', err);
  }
}
