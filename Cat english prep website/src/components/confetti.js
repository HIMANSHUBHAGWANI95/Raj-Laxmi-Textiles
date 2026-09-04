// ============================================================
// components/confetti.js — Canvas confetti for celebrations
// ============================================================

export function launchConfetti(duration = 3000) {
  const wrapper = document.getElementById('confetti-canvas-wrapper');
  if (!wrapper) return;

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  wrapper.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = ['#F5A623', '#FFB940', '#7C4DFF', '#00D4AA', '#2ECC71', '#FF5252', '#F0F4FF'];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 8 + 3,
    d: Math.random() * 100 + 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.floor(Math.random() * 12) - 6,
    tiltAngle: 0,
    tiltAngleIncremental: (Math.random() * 0.1) + 0.05,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  let animId;
  let elapsed = 0;
  let lastTime = performance.now();

  function draw(now) {
    elapsed += now - lastTime;
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 2 + p.r / 2) * 0.9;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = elapsed < duration - 800 ? 1 : Math.max(0, 1 - (elapsed - (duration - 800)) / 800);
      if (p.shape === 'rect') {
        ctx.save();
        ctx.translate(p.x + p.r / 2, p.y + p.r / 2);
        ctx.rotate(p.tiltAngle);
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      } else {
        ctx.arc(p.x, p.y, p.r / 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (p.y > canvas.height + 20) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });

    if (elapsed < duration + 800) {
      animId = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  animId = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(animId);
    canvas.remove();
  };
}
