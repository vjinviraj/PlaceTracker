// src/hooks/useConfetti.js
// Usage:
//   import { useConfetti } from "../hooks/useConfetti"
//   const fireConfetti = useConfetti()
//   fireConfetti()  // call when status changes to "Offer"

import { useCallback } from "react";

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Pure CSS/Canvas confetti — no external lib needed
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none; z-index: 99999;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // PlaceTracker palette
  const COLORS = [
    "#22D3EE","#06B6D4","#5E77C0","#10b981",
    "#F8FAFF","#a78bfa","#34d399","#60a5fa",
  ];

  const pieces = Array.from({ length: 120 }, () => ({
    x: randomInRange(0.2, 0.8) * canvas.width,
    y: randomInRange(-0.1, 0.1) * canvas.height,
    w: randomInRange(6, 14),
    h: randomInRange(4, 9),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: randomInRange(0, Math.PI * 2),
    vx: randomInRange(-4, 4),
    vy: randomInRange(-14, -4),
    vr: randomInRange(-0.15, 0.15),
    gravity: randomInRange(0.25, 0.45),
    opacity: 1,
    shape: Math.random() > 0.6 ? "circle" : "rect",
  }));

  let frame = 0;
  const maxFrames = 160;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.angle += p.vr;
      p.vx *= 0.99;
      if (frame > maxFrames * 0.6) p.opacity -= 0.02;
    });

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  // Second burst from opposite corners for drama
  setTimeout(() => {
    const burst = Array.from({ length: 60 }, () => ({
      x: Math.random() > 0.5 ? randomInRange(0, 0.3) : randomInRange(0.7, 1.0),
      y: randomInRange(0.4, 0.7),
    }));
    // Just reuse main canvas draw cycle handles this — add to pieces
    burst.forEach(b => pieces.push({
      x: b.x * canvas.width,
      y: b.y * canvas.height,
      w: randomInRange(5, 10),
      h: randomInRange(3, 7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: randomInRange(0, Math.PI * 2),
      vx: randomInRange(-3, 3),
      vy: randomInRange(-10, -3),
      vr: randomInRange(-0.1, 0.1),
      gravity: randomInRange(0.2, 0.4),
      opacity: 0.9,
      shape: "rect",
    }));
  }, 250);

  requestAnimationFrame(draw);
}

export function useConfetti() {
  return useCallback(() => {
    launchConfetti();
  }, []);
}