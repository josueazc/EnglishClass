// ──────────────────────────────────────────────────────────────────────────────
// PochisClass Classroom Map  ·  Habbo / Gather style
// World 1440 × 900  ·  Viewport 960 × 720  ·  Top-down view
// Inspired by: warm wood floor, colorful furniture, cozy school vibe
// ──────────────────────────────────────────────────────────────────────────────
export const WORLD_W = 1440;
export const WORLD_H = 900;
export const TILE    = 32;

const FW = 110; // front wall height
const SW = 60;  // side wall width
const BW = 50;  // bottom wall height

export const WHITEBOARD  = { x: 150, y: 12, w: 580, h: 80 };
export const TEACHER_DESK = { x: 70, y: 122, w: 150, h: 90 };
export const BULLETIN    = { x: 1100, y: 14, w: 280, h: 82 };
export const SCREEN_ZONE = { x: 1100, y: 14, w: 280, h: 82 }; // alias

// ── Pickable world objects ────────────────────────────────────────────────────
export const WORLD_OBJECTS = [
  { id:"basketball",  type:"basketball",   x:1360, y:600, label:"🏀 Balón de basket",  color:"#E87020", radius:14 },
  { id:"volleyball",  type:"volleyball",   x:1290, y:720, label:"🏐 Balón de voley",   color:"#F0F0F0", radius:13 },
  { id:"football",    type:"football",     x:1360, y:750, label:"⚽ Balón de fútbol",  color:"#1A1A1A", radius:13 },
  { id:"marker_red",  type:"marker",       x:175,  y:105, label:"🖊 Marcador",         color:"#DD2020", radius:8  },
  { id:"marker_blue", type:"marker",       x:192,  y:105, label:"🖊 Marcador azul",    color:"#2040EE", radius:8  },
  { id:"saxophone",   type:"saxophone",    x:130,  y:740, label:"🎷 Saxofón",          color:"#D4A020", radius:12 },
  { id:"crown",       type:"crown",        x:870,  y:106, label:"👑 Corona",           color:"#FFD700", radius:10 },
  { id:"paper_plane", type:"paper_plane",  x:600,  y:180, label:"✈ Avión de papel",   color:"#F0F0F0", radius:10 },
  { id:"eraser",      type:"eraser",       x:205,  y:105, label:"🧹 Borrador",         color:"#F0D0A0", radius:8  },
];

export const BOUNDS = {
  x: SW, y: FW,
  w: WORLD_W - SW * 2,
  h: WORLD_H - FW - BW,
};

// ── Student desks: 5 cols × 4 rows = 20 ──────────────────────────────────────
const COLS = [290, 490, 690, 890, 1090];
const ROWS = [310, 440, 570, 700];
export const DW = 60, DH = 44;
export const DESKS = [];
for (const cy of ROWS) {
  for (const cx of COLS) {
    DESKS.push({
      x: cx - DW/2, y: cy - DH/2, w: DW, h: DH,
      seatX: cx, seatY: cy + DH/2 + 24,
    });
  }
}

// ── Coins (deterministic positions in aisles, away from desks) ────────────────
export const COIN_DEFS = [
  { id:"cn0",  x:180,  y:300  }, { id:"cn1",  x:180,  y:460  },
  { id:"cn2",  x:180,  y:620  }, { id:"cn3",  x:180,  y:770  },
  { id:"cn4",  x:390,  y:375  }, { id:"cn5",  x:390,  y:505  },
  { id:"cn6",  x:590,  y:375  }, { id:"cn7",  x:590,  y:635  },
  { id:"cn8",  x:790,  y:375  }, { id:"cn9",  x:790,  y:505  },
  { id:"cn10", x:990,  y:375  }, { id:"cn11", x:990,  y:635  },
  { id:"cn12", x:1220, y:300  }, { id:"cn13", x:1220, y:460  },
  { id:"cn14", x:1220, y:620  }, { id:"cn15", x:1220, y:770  },
  { id:"cn16", x:490,  y:190  }, { id:"cn17", x:790,  y:190  },
  { id:"cn18", x:450,  y:790  }, { id:"cn19", x:850,  y:790  },
];

// ── Interactive books (on specific desks) ─────────────────────────────────────
export const BOOK_DEFS = [
  { id:"bk0", x:290,  y:310,  color:"#DD3030", emoji:"📕", title:"Diario de Clase"      },
  { id:"bk1", x:890,  y:440,  color:"#3060CC", emoji:"📘", title:"Libro de Ideas"       },
  { id:"bk2", x:490,  y:570,  color:"#30AA50", emoji:"📗", title:"Chistes & Memes"      },
  { id:"bk3", x:1090, y:700,  color:"#BB7020", emoji:"📙", title:"Libro de los Sueños"  },
];

export function isNearBook(px, py) {
  return BOOK_DEFS.find(b => Math.hypot(b.x - px, b.y - py) < 48) || null;
}

// ── Interaction zones ─────────────────────────────────────────────────────────
export function isNearWhiteboard(px, py) {
  return py < WHITEBOARD.y + WHITEBOARD.h + 110
      && px > WHITEBOARD.x - 40
      && px < WHITEBOARD.x + WHITEBOARD.w + 40;
}
export function isNearBulletin(px, py) {
  return py < BULLETIN.y + BULLETIN.h + 110
      && px > BULLETIN.x - 40
      && px < BULLETIN.x + BULLETIN.w + 40;
}
export function getNearbyDesk(px, py) {
  for (let i = 0; i < DESKS.length; i++) {
    const d = DESKS[i];
    const cx = d.x + d.w/2, cy = d.y + d.h/2;
    if (Math.abs(px-cx) < 60 && Math.abs(py-cy) < 60) return i;
  }
  return -1;
}
export function clampToBounds(x, y) {
  return {
    x: Math.max(BOUNDS.x + 18, Math.min(BOUNDS.x + BOUNDS.w - 18, x)),
    y: Math.max(BOUNDS.y + 26, Math.min(BOUNDS.y + BOUNDS.h - 26, y)),
  };
}

// ── MAIN DRAW ─────────────────────────────────────────────────────────────────
export function drawClassroom(ctx) {
  _floor(ctx);
  _frontWall(ctx);
  _sideWalls(ctx);
  _bottomWall(ctx);
  _whiteboardFrame(ctx);
  _bulletinBoard(ctx);
  _teacherDesk(ctx);
  _studentDesks(ctx);
  _bookshelf(ctx);
  _windows(ctx);
  _door(ctx);
  _plants(ctx);
  _clock(ctx);
  _trophyCase(ctx);
  _computerCorner(ctx);
  _musicCorner(ctx);
  _lockers(ctx);
  _rug(ctx);
}

// ── FLOOR ─────────────────────────────────────────────────────────────────────
function _floor(ctx) {
  const x = SW, y = FW, w = WORLD_W - SW*2, h = WORLD_H - FW - BW;

  // Base warm wood colour
  ctx.fillStyle = "#D4955A";
  ctx.fillRect(x, y, w, h);

  // Horizontal planks (wood grain direction)
  for (let row = 0; row * 24 < h; row++) {
    const py = y + row * 24;
    // Alternate plank shades
    ctx.fillStyle = row % 2 === 0 ? "rgba(200,130,60,0.18)" : "rgba(255,180,100,0.1)";
    ctx.fillRect(x, py, w, 24);
    // Plank line
    ctx.strokeStyle = "rgba(140,80,30,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke();
  }

  // Vertical tile joints (every TILE)
  ctx.strokeStyle = "rgba(140,80,30,0.18)";
  ctx.lineWidth = 1;
  for (let col = 0; col * TILE < w; col++) {
    ctx.beginPath();
    ctx.moveTo(x + col*TILE, y);
    ctx.lineTo(x + col*TILE, y + h);
    ctx.stroke();
  }

  // Corner shadow vignette
  const vgW = 80;
  const gL = ctx.createLinearGradient(x, y, x + vgW, y);
  gL.addColorStop(0, "rgba(0,0,0,0.22)"); gL.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gL; ctx.fillRect(x, y, vgW, h);
  const gR = ctx.createLinearGradient(x+w-vgW, y, x+w, y);
  gR.addColorStop(0, "rgba(0,0,0,0)"); gR.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = gR; ctx.fillRect(x+w-vgW, y, vgW, h);
}

// ── WALLS ─────────────────────────────────────────────────────────────────────
function _frontWall(ctx) {
  // Gradient green wall
  const g = ctx.createLinearGradient(0, 0, 0, FW);
  g.addColorStop(0, "#2E7020"); g.addColorStop(1, "#3A8A28");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD_W, FW);

  // Wall texture (subtle horizontal lines)
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let y = 10; y < FW; y += 18) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WORLD_W, y); ctx.stroke();
  }
  // Baseboard
  ctx.fillStyle = "#5A3A18";
  ctx.fillRect(0, FW-10, WORLD_W, 10);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, FW-10, WORLD_W, 2);
}

function _sideWalls(ctx) {
  const h = WORLD_H - FW;
  // Left wall
  const gL = ctx.createLinearGradient(0, FW, SW, FW);
  gL.addColorStop(0, "#7A4A20"); gL.addColorStop(1, "#AA7040");
  ctx.fillStyle = gL;
  ctx.fillRect(0, FW, SW, h);
  // Right wall
  const gR = ctx.createLinearGradient(WORLD_W-SW, FW, WORLD_W, FW);
  gR.addColorStop(0, "#AA7040"); gR.addColorStop(1, "#7A4A20");
  ctx.fillStyle = gR;
  ctx.fillRect(WORLD_W-SW, FW, SW, h);
  // Side baseboards
  ctx.fillStyle = "#5A3A18";
  ctx.fillRect(0, FW-6, SW, 6);
  ctx.fillRect(WORLD_W-SW, FW-6, SW, 6);
}

function _bottomWall(ctx) {
  const g = ctx.createLinearGradient(0, WORLD_H-BW, 0, WORLD_H);
  g.addColorStop(0, "#AA7040"); g.addColorStop(1, "#7A4A20");
  ctx.fillStyle = g;
  ctx.fillRect(0, WORLD_H-BW, WORLD_W, BW);
  ctx.fillStyle = "#5A3A18";
  ctx.fillRect(0, WORLD_H-BW, WORLD_W, 8);
}

// ── WHITEBOARD (large, front wall) ───────────────────────────────────────────
function _whiteboardFrame(ctx) {
  const wb = WHITEBOARD;
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(wb.x+4, wb.y+4, wb.w+2, wb.h+2);
  // Frame (dark wood)
  ctx.fillStyle = "#2A1808";
  ctx.fillRect(wb.x-6, wb.y-6, wb.w+12, wb.h+12);
  // White board surface
  ctx.fillStyle = "#F4F4F8";
  ctx.fillRect(wb.x, wb.y, wb.w, wb.h);
  // Blue ruled lines
  ctx.strokeStyle = "rgba(100,140,210,0.18)";
  ctx.lineWidth = 1;
  for (let y = wb.y+22; y < wb.y+wb.h-6; y += 20) {
    ctx.beginPath(); ctx.moveTo(wb.x+8, y); ctx.lineTo(wb.x+wb.w-8, y); ctx.stroke();
  }
  // Marker tray
  ctx.fillStyle = "#222233";
  ctx.fillRect(wb.x, wb.y+wb.h, wb.w, 8);
  // Marker dots in tray
  const trayColors = ["#E02020","#2050DD","#20AA40","#FF8800","#8020CC"];
  trayColors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(wb.x + 8 + i*14, wb.y+wb.h+2, 6, 4);
  });
  // Label shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.font = "bold 10px monospace";
  ctx.fillText("PIZARRÓN DIGITAL", wb.x+8, wb.y+wb.h+7);
}

// ── BULLETIN BOARD (right of front wall) ─────────────────────────────────────
function _bulletinBoard(ctx) {
  const b = BULLETIN;
  // Frame
  ctx.fillStyle = "#3A2008";
  ctx.fillRect(b.x-6, b.y-6, b.w+12, b.h+12);
  // Cork surface
  const corkG = ctx.createLinearGradient(b.x, b.y, b.x+b.w, b.y+b.h);
  corkG.addColorStop(0, "#C89050"); corkG.addColorStop(1, "#A87030");
  ctx.fillStyle = corkG;
  ctx.fillRect(b.x, b.y, b.w, b.h);
  // Cork texture
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${100+i%30},${60+i%20},${20+i%15},0.22)`;
    ctx.fillRect(b.x + (i*41)%b.w, b.y + (i*29)%(b.h), 3, 3);
  }
  // Header banner
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(b.x, b.y, b.w, 18);
  ctx.fillStyle = "#FFE080";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("📌 TAREAS Y ANUNCIOS", b.x + b.w/2, b.y + 13);
  ctx.textAlign = "left";
  // Corner pins
  const pinColors = ["#E84020","#2080EE","#20CC50","#CC20AA"];
  const corners = [[b.x+6,b.y+22],[b.x+b.w-6,b.y+22],[b.x+6,b.y+b.h-6],[b.x+b.w-6,b.y+b.h-6]];
  corners.forEach(([px,py], i) => {
    ctx.fillStyle = pinColors[i];
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath(); ctx.arc(px-1, py-1, 2, 0, Math.PI*2); ctx.fill();
  });
}

// ── TEACHER DESK (prominent, front area) ──────────────────────────────────────
function _teacherDesk(ctx) {
  const td = TEACHER_DESK;
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(td.x+5, td.y+5, td.w, td.h);
  // Desk surface (light wood)
  const dg = ctx.createLinearGradient(td.x, td.y, td.x, td.y+td.h);
  dg.addColorStop(0, "#C89060"); dg.addColorStop(1, "#9A6030");
  ctx.fillStyle = dg;
  ctx.fillRect(td.x, td.y, td.w, td.h);
  // Highlight
  ctx.fillStyle = "rgba(255,220,140,0.25)";
  ctx.fillRect(td.x+4, td.y+4, td.w-12, 14);
  // Front edge (dark)
  ctx.fillStyle = "#6A3A10";
  ctx.fillRect(td.x, td.y+td.h-8, td.w, 8);
  ctx.strokeStyle = "#4A2008"; ctx.lineWidth = 2;
  ctx.strokeRect(td.x, td.y, td.w, td.h);

  // Monitor (big, prominent)
  const mx = td.x + 50, my = td.y + 8;
  ctx.fillStyle = "#111122";
  ctx.fillRect(mx-3, my-3, 58, 46);
  // Screen glow (blue)
  const sg = ctx.createLinearGradient(mx, my, mx, my+40);
  sg.addColorStop(0, "#2090FF"); sg.addColorStop(1, "#0050CC");
  ctx.fillStyle = sg;
  ctx.fillRect(mx, my, 52, 38);
  // Screen reflection
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(mx, my, 52, 14);
  // Stand
  ctx.fillStyle = "#333344";
  ctx.fillRect(mx+22, my+38, 8, 8);
  ctx.fillRect(mx+16, my+46, 20, 4);

  // Keyboard
  ctx.fillStyle = "#D0D0D8";
  ctx.fillRect(td.x+8, td.y+55, 40, 18);
  ctx.strokeStyle = "#AAAAAA"; ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.strokeRect(td.x+10+j*4.5, td.y+57+i*4, 3.5, 3);
    }
  }

  // Apple/logo on desk
  ctx.fillStyle = "#FF4466";
  ctx.beginPath(); ctx.arc(td.x+12, td.y+20, 5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 7px monospace";
  ctx.fillText("A", td.x+9, td.y+23);

  // Teacher name plate
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(td.x+td.w-45, td.y+td.h-22, 42, 14);
  ctx.fillStyle = "#333";
  ctx.font = "bold 7px monospace";
  ctx.fillText("Profe Pochis", td.x+td.w-43, td.y+td.h-12);
}

// ── STUDENT DESKS ─────────────────────────────────────────────────────────────
function _studentDesks(ctx) {
  for (const d of DESKS) {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(d.x+4, d.y+4, d.w, d.h);

    // Desk surface (warm light wood)
    const g = ctx.createLinearGradient(d.x, d.y, d.x, d.y+d.h);
    g.addColorStop(0, "#C89060"); g.addColorStop(1, "#A06830");
    ctx.fillStyle = g;
    ctx.fillRect(d.x, d.y, d.w, d.h);

    // Shine
    ctx.fillStyle = "rgba(255,230,160,0.2)";
    ctx.fillRect(d.x+3, d.y+3, d.w-8, 10);

    // Front edge
    ctx.fillStyle = "#6A3A10";
    ctx.fillRect(d.x, d.y+d.h-6, d.w, 6);
    ctx.strokeStyle = "#4A2808"; ctx.lineWidth = 1.5;
    ctx.strokeRect(d.x, d.y, d.w, d.h);

    // Small notebook on desk (random-ish colour)
    const nbColors = ["#EE8080","#80AAEE","#80CC80","#EEE080","#CC80EE"];
    const nbCol = nbColors[Math.round(d.x/100 + d.y/80) % nbColors.length];
    ctx.fillStyle = nbCol;
    ctx.fillRect(d.x+4, d.y+4, 14, 20);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(d.x+5, d.y+5, 12, 2);
    ctx.fillRect(d.x+5, d.y+7, 10, 1);
    ctx.fillRect(d.x+5, d.y+9, 10, 1);

    // Pencil
    ctx.fillStyle = "#F5D020";
    ctx.fillRect(d.x+d.w-14, d.y+5, 3, 16);
    ctx.fillStyle = "#EE8844";
    ctx.fillRect(d.x+d.w-14, d.y+19, 3, 3);

    // Chair (visible below desk)
    const cy = d.y + d.h + 6;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(d.x+7, cy+2, d.w-14, 15);
    // Chair seat
    const cg = ctx.createLinearGradient(d.x+6, cy, d.x+6, cy+14);
    cg.addColorStop(0, "#6080CC"); cg.addColorStop(1, "#405EA0");
    ctx.fillStyle = cg;
    ctx.fillRect(d.x+6, cy, d.w-12, 14);
    // Chair shine
    ctx.fillStyle = "rgba(140,160,220,0.3)";
    ctx.fillRect(d.x+6, cy, d.w-12, 5);
    ctx.strokeStyle = "#304080"; ctx.lineWidth = 1;
    ctx.strokeRect(d.x+6, cy, d.w-12, 14);
    // Chair legs (4 little lines)
    ctx.strokeStyle = "#2A3060"; ctx.lineWidth = 2;
    [[d.x+8,cy+14],[d.x+d.w-9,cy+14]].forEach(([lx,ly]) => {
      ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx-2,ly+8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx+4,ly); ctx.lineTo(lx+6,ly+8); ctx.stroke();
    });
  }
}

// ── BOOKSHELF (left wall) ─────────────────────────────────────────────────────
function _bookshelf(ctx) {
  const bsx = SW-2, bsw = SW, bsY = FW+55, bsH = 240;
  // Shelf unit background
  ctx.fillStyle = "#5A3010";
  ctx.fillRect(bsx, bsY, bsw, bsH);
  // Shelf boards
  ctx.fillStyle = "#7A4A20";
  for (let i = 0; i <= 4; i++) {
    ctx.fillRect(bsx, bsY + i*(bsH/4), bsw, 5);
  }
  // Books (per shelf, per slot)
  const bookPalette = ["#E04040","#4060CC","#40AA50","#DD8020","#8030BB","#CC9020","#308080","#DD4080"];
  for (let shelf = 0; shelf < 4; shelf++) {
    const sy = bsY + shelf*(bsH/4) + 6;
    const sh = bsH/4 - 10;
    let bkx = bsx + 3;
    for (let b = 0; b < 3; b++) {
      ctx.fillStyle = bookPalette[(shelf*3+b) % bookPalette.length];
      ctx.fillRect(bkx, sy, 15, sh);
      // Spine highlight
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(bkx, sy, 3, sh);
      // Spine label
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "5px monospace";
      ctx.save(); ctx.translate(bkx+9, sy+sh-5); ctx.rotate(-Math.PI/2);
      ctx.fillText("ENG", 0, 0);
      ctx.restore();
      bkx += 16;
    }
  }
}

// ── WINDOWS (right wall) ─────────────────────────────────────────────────────
function _windows(ctx) {
  [240, 430, 620, 810].forEach(cy => _window(ctx, WORLD_W-SW-2, cy));
}

function _window(ctx, wx, cy) {
  const ww = SW, wh = 72, wy = cy - wh/2;
  // Frame
  ctx.fillStyle = "#D8B870";
  ctx.fillRect(wx, wy, ww, wh);
  // Glass
  const glassG = ctx.createLinearGradient(wx+4, wy+4, wx+4, wy+wh-4);
  glassG.addColorStop(0, "#B8E0F0"); glassG.addColorStop(1, "#6AAAC8");
  ctx.fillStyle = glassG;
  ctx.fillRect(wx+4, wy+4, ww-8, wh-8);
  // Sky clouds
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath(); ctx.ellipse(wx+16, wy+20, 10, 6, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(wx+32, wy+26, 8, 5, 0, 0, Math.PI*2); ctx.fill();
  // Sun
  ctx.fillStyle = "rgba(255,220,0,0.7)";
  ctx.beginPath(); ctx.arc(wx+42, wy+14, 6, 0, Math.PI*2); ctx.fill();
  // Cross bar
  ctx.strokeStyle = "#C8A860"; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(wx+ww/2, wy+4); ctx.lineTo(wx+ww/2, wy+wh-4);
  ctx.moveTo(wx+4, wy+wh/2); ctx.lineTo(wx+ww-4, wy+wh/2);
  ctx.stroke();
  // Sill
  ctx.fillStyle = "#A88840";
  ctx.fillRect(wx, wy+wh, ww, 5);
}

// ── DOOR (bottom right) ───────────────────────────────────────────────────────
function _door(ctx) {
  const dx = WORLD_W-SW, dw = SW, dh = 120, dy = WORLD_H-BW-dh;
  // Frame
  ctx.fillStyle = "#9A6840";
  ctx.fillRect(dx, dy, dw, dh);
  // Door surface (lighter wood)
  const dg = ctx.createLinearGradient(dx, dy, dx+dw, dy);
  dg.addColorStop(0, "#C09060"); dg.addColorStop(1, "#A07040");
  ctx.fillStyle = dg;
  ctx.fillRect(dx+3, dy+3, dw-6, dh-6);
  // Door panels
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(dx+6, dy+8, dw-12, (dh-20)/2 - 4);
  ctx.fillRect(dx+6, dy+(dh-20)/2+10, dw-12, (dh-20)/2 - 4);
  // Panel highlights
  ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
  ctx.strokeRect(dx+6, dy+8, dw-12, (dh-20)/2 - 4);
  ctx.strokeRect(dx+6, dy+(dh-20)/2+10, dw-12, (dh-20)/2 - 4);
  // Knob
  ctx.fillStyle = "#FFD700";
  ctx.beginPath(); ctx.arc(dx+10, dy+dh/2+10, 6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#DAA520";
  ctx.beginPath(); ctx.arc(dx+10, dy+dh/2+10, 4, 0, Math.PI*2); ctx.fill();
  // "EXIT" label
  ctx.fillStyle = "rgba(255,150,0,0.7)";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SALIDA", dx+dw/2, dy+dh/2-10);
  ctx.textAlign = "left";
}

// ── PLANTS (front corners) ────────────────────────────────────────────────────
function _plants(ctx) {
  _plant(ctx, SW+22, FW+24, 1.0);
  _plant(ctx, WORLD_W-SW-46, FW+24, 0.85);
  _plant(ctx, SW+22, WORLD_H-BW-50, 0.7);
}

function _plant(ctx, cx, cy, scale = 1) {
  const s = scale;
  // Pot
  ctx.fillStyle = "#CC5522";
  ctx.fillRect(cx-10*s, cy+14*s, 20*s, 15*s);
  ctx.fillStyle = "#AA3311";
  ctx.fillRect(cx-11*s, cy+12*s, 22*s, 5*s);
  // Soil
  ctx.fillStyle = "#3A1E08";
  ctx.fillRect(cx-9*s, cy+14*s, 18*s, 6*s);
  // Leaves (3 sets, overlapping)
  const green1 = "#28A030", green2 = "#1E8028", green3 = "#166020";
  [[0,0,9,14,0],[-9,4,9,13,-0.25],[9,4,9,13,0.25]].forEach(([ox,oy,rx,ry,rot]) => {
    ctx.fillStyle = green1;
    ctx.beginPath();
    ctx.ellipse(cx+(ox*s), cy+(oy*s), rx*s, ry*s, rot, 0, Math.PI*2);
    ctx.fill();
  });
  // Dark leaf highlights
  [[0,-2,6,10,0],[-7,5,5,8,-0.2],[7,5,5,8,0.2]].forEach(([ox,oy,rx,ry,rot]) => {
    ctx.fillStyle = green3;
    ctx.beginPath();
    ctx.ellipse(cx+(ox*s), cy+(oy*s), rx*s, ry*s, rot, 0, Math.PI*2);
    ctx.fill();
  });
  // Highlight
  ctx.fillStyle = green2;
  ctx.beginPath(); ctx.ellipse(cx, cy-2*s, 5*s, 10*s, 0, 0, Math.PI*2); ctx.fill();
}

// ── CLOCK ─────────────────────────────────────────────────────────────────────
function _clock(ctx) {
  const clkX = WHITEBOARD.x + WHITEBOARD.w + 65, clkY = FW/2;
  const now = new Date();
  const hAng = ((now.getHours()%12) + now.getMinutes()/60) * Math.PI/6 - Math.PI/2;
  const mAng = now.getMinutes() * Math.PI/30 - Math.PI/2;

  // Outer ring
  ctx.fillStyle = "#DDDDDD";
  ctx.beginPath(); ctx.arc(clkX, clkY, 24, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#444"; ctx.lineWidth = 2; ctx.stroke();
  // Face
  ctx.fillStyle = "#F8F8F8";
  ctx.beginPath(); ctx.arc(clkX, clkY, 21, 0, Math.PI*2); ctx.fill();

  // Hour ticks
  for (let i = 0; i < 12; i++) {
    const a = i*Math.PI/6;
    const inner = i%3===0 ? 15 : 18;
    ctx.strokeStyle = i%3===0 ? "#444" : "#AAA";
    ctx.lineWidth = i%3===0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(clkX + Math.cos(a)*inner, clkY + Math.sin(a)*inner);
    ctx.lineTo(clkX + Math.cos(a)*20,    clkY + Math.sin(a)*20);
    ctx.stroke();
  }
  // Hands
  ctx.strokeStyle = "#222"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(clkX,clkY); ctx.lineTo(clkX+Math.cos(hAng)*12, clkY+Math.sin(hAng)*12); ctx.stroke();
  ctx.strokeStyle = "#333"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(clkX,clkY); ctx.lineTo(clkX+Math.cos(mAng)*17, clkY+Math.sin(mAng)*17); ctx.stroke();
  // Seconds hand (red)
  const sAng = now.getSeconds()*Math.PI/30 - Math.PI/2;
  ctx.strokeStyle = "#DD2020"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(clkX,clkY); ctx.lineTo(clkX+Math.cos(sAng)*18, clkY+Math.sin(sAng)*18); ctx.stroke();
  // Centre
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(clkX, clkY, 2.5, 0, Math.PI*2); ctx.fill();
}

// ── TROPHY CASE (front wall, left of whiteboard) ───────────────────────────────
function _trophyCase(ctx) {
  const tx = 820, ty = 14;
  const tw = 250, th = 82;
  // Glass case
  ctx.fillStyle = "#1A1A2A";
  ctx.fillRect(tx-4, ty-4, tw+8, th+8);
  ctx.fillStyle = "rgba(180,210,240,0.18)";
  ctx.fillRect(tx, ty, tw, th);
  ctx.strokeStyle = "#5580AA"; ctx.lineWidth = 1.5;
  ctx.strokeRect(tx, ty, tw, th);

  // Trophies
  const trophyColors = ["#D4A020","#AAAAAA","#C47020","#D4A020"];
  [30, 90, 150, 210].forEach((ox, i) => {
    const tc = trophyColors[i];
    const th2 = i===0 ? 50 : i===1 ? 42 : i===2 ? 38 : 46;
    // Trophy cup
    ctx.fillStyle = tc;
    ctx.beginPath();
    ctx.ellipse(tx+ox, ty+th-8, 12, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(tx+ox-5, ty+th-8-th2, 10, th2);
    ctx.beginPath();
    ctx.ellipse(tx+ox, ty+th-8-th2, 14, 8, 0, 0, Math.PI, 0); ctx.fill();
    // Star
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    ctx.fillText("★", tx+ox, ty+th-8-th2+4);
    // Handles
    ctx.strokeStyle = tc; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tx+ox-14, ty+th-8-th2+8, 5, 0.5, 2.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx+ox+14, ty+th-8-th2+8, 5, 0.7, 2.3, true); ctx.stroke();
  });
  ctx.textAlign = "left";
  // Label
  ctx.fillStyle = "rgba(200,220,255,0.5)";
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  ctx.fillText("🏆 TROFEOS CLASE", tx+tw/2, ty+th+10);
  ctx.textAlign = "left";
}

// ── COMPUTER CORNER (right area) ─────────────────────────────────────────────
function _computerCorner(ctx) {
  const cx = WORLD_W - SW - 2, cy = FW + 280;
  const cw = SW, ch = 180;
  // Computer lab table
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(cx+4, cy+4, cw, ch);
  ctx.fillStyle = "#8A5A30";
  ctx.fillRect(cx, cy, cw, ch);
  ctx.fillStyle = "#6A3A10";
  ctx.fillRect(cx, cy+ch-6, cw, 6);
  // Two computers
  [cy+10, cy+100].forEach(my => {
    // Monitor
    ctx.fillStyle = "#111";
    ctx.fillRect(cx+6, my, 44, 32);
    const mg = ctx.createLinearGradient(cx+8, my+2, cx+8, my+28);
    mg.addColorStop(0, "#1088CC"); mg.addColorStop(1, "#0050AA");
    ctx.fillStyle = mg;
    ctx.fillRect(cx+8, my+2, 40, 28);
    // Scanlines effect
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    for (let sl = 0; sl < 28; sl+=2) ctx.fillRect(cx+8, my+2+sl, 40, 1);
    // Stand
    ctx.fillStyle = "#333";
    ctx.fillRect(cx+22, my+32, 12, 6);
    ctx.fillRect(cx+18, my+38, 20, 4);
  });
}

// ── MUSIC CORNER (lower left) ────────────────────────────────────────────────
function _musicCorner(ctx) {
  const mx = SW, my = WORLD_H - BW - 200;
  // Music stand
  ctx.fillStyle = "#777788";
  ctx.fillRect(mx+10, my+20, 4, 60);
  ctx.fillRect(mx+4, my+20, 16, 4);
  ctx.fillRect(mx+6, my+76, 12, 4);
  // Music notes on the stand (sheet music)
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(mx+5, my+10, 20, 28);
  ctx.fillStyle = "#333";
  ctx.font = "7px monospace";
  ctx.fillText("♪ ♫ ♩", mx+7, my+22);
  ctx.fillText("♬ ♪ ♩", mx+7, my+30);

  // Marimba / instrument on the side
  ctx.fillStyle = "#7A5020";
  ctx.fillRect(mx+35, my+30, 4, 60);
  ctx.fillStyle = "#D4A020";
  [0,1,2,3,4,5].forEach(i => {
    ctx.fillRect(mx+35 + i*7, my+28, 5, 50-i*5);
    ctx.fillStyle = "rgba(255,200,80,0.3)";
    ctx.fillRect(mx+35 + i*7, my+28, 5, 8);
    ctx.fillStyle = "#D4A020";
  });

  // Zone label
  ctx.fillStyle = "rgba(255,220,100,0.6)";
  ctx.font = "8px monospace";
  ctx.fillText("🎵 Música", mx+4, my+110);
}

// ── LOCKERS (bottom wall area) ────────────────────────────────────────────────
function _lockers(ctx) {
  const ly = WORLD_H - BW - 2, lx = SW + 60;
  const lw = 28, lh = 50, gap = 3;
  const colors = ["#CC4040","#4060CC","#40AA50","#CC8020","#8040CC","#40AACC","#CC4080"];
  for (let i = 0; i < 7; i++) {
    const lxn = lx + i * (lw+gap);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(lxn+2, ly-lh+2, lw, lh);
    ctx.fillStyle = colors[i];
    ctx.fillRect(lxn, ly-lh, lw, lh);
    // Locker highlight
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(lxn+2, ly-lh+2, lw-4, 10);
    // Handle
    ctx.fillStyle = "#AAA";
    ctx.fillRect(lxn+lw/2-2, ly-lh/2, 4, 6);
    ctx.strokeStyle = "#888"; ctx.lineWidth = 0.5;
    ctx.strokeRect(lxn, ly-lh, lw, lh);
    // Number
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(i+1, lxn+lw/2, ly-lh+12);
    ctx.textAlign = "left";
  }
  // Label
  ctx.fillStyle = "rgba(200,200,200,0.5)";
  ctx.font = "8px monospace";
  ctx.fillText("CASILLEROS", lx, ly+10);
}

// ── AREA RUG (centre decoration) ─────────────────────────────────────────────
function _rug(ctx) {
  const rx = SW + (WORLD_W-SW*2)/2 - 180;
  const ry = FW + 16, rw = 360, rh = 90;
  // Drop shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(rx+4, ry+4, rw, rh);
  // Rug base
  const rg = ctx.createLinearGradient(rx, ry, rx+rw, ry+rh);
  rg.addColorStop(0, "rgba(60,30,100,0.25)");
  rg.addColorStop(0.5, "rgba(80,40,140,0.3)");
  rg.addColorStop(1, "rgba(60,30,100,0.25)");
  ctx.fillStyle = rg;
  ctx.fillRect(rx, ry, rw, rh);
  // Rug border
  ctx.strokeStyle = "rgba(160,100,220,0.45)"; ctx.lineWidth = 4;
  ctx.strokeRect(rx+4, ry+4, rw-8, rh-8);
  ctx.strokeStyle = "rgba(200,150,255,0.25)"; ctx.lineWidth = 1;
  ctx.strokeRect(rx+8, ry+8, rw-16, rh-16);
  // Center pattern
  ctx.fillStyle = "rgba(180,120,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(rx+rw/2, ry+rh/2, 60, 28, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = "rgba(200,150,255,0.3)"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(rx+rw/2, ry+rh/2, 60, 28, 0, 0, Math.PI*2);
  ctx.stroke();
  // PochisClass text on rug
  ctx.fillStyle = "rgba(220,180,255,0.35)";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.fillText("POCHISCLASS", rx+rw/2, ry+rh/2+5);
  ctx.textAlign = "left";
}

// ── WHITEBOARD TEXT ───────────────────────────────────────────────────────────
export function drawWhiteboardText(ctx, text) {
  const wb = WHITEBOARD;
  ctx.fillStyle = "#F4F4F8";
  ctx.fillRect(wb.x+5, wb.y+5, wb.w-10, wb.h-10);
  if (!text) return;
  ctx.fillStyle = "#1A2A4A";
  ctx.font = "bold 15px monospace";
  const maxW = wb.w - 28;
  const lines = [];
  for (const raw of text.split("\n")) {
    const words = raw.split(" ");
    let line = "";
    for (const w of words) {
      const t = line + w + " ";
      if (ctx.measureText(t).width > maxW && line) { lines.push(line.trim()); line = w+" "; }
      else line = t;
    }
    lines.push(line.trim());
  }
  lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, wb.x+14, wb.y+24+i*18));
}

// ── BULLETIN BOARD TASKS ──────────────────────────────────────────────────────
export function drawBulletinTasks(ctx, tasks) {
  const b = BULLETIN;
  ctx.fillStyle = "#B87848";
  ctx.fillRect(b.x, b.y+20, b.w, b.h-20);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${120+i%30},${80+i%20},${30+i%15},0.2)`;
    ctx.fillRect(b.x+(i*41)%b.w, b.y+20+(i*29)%(b.h-20), 3, 3);
  }
  if (!tasks || !tasks.length) {
    ctx.fillStyle = "rgba(80,50,10,0.6)"; ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Sin tareas", b.x+b.w/2, b.y+b.h/2+4);
    ctx.textAlign = "left"; return;
  }
  tasks.slice(0, 4).forEach((task, i) => {
    const ty = b.y + 26 + i * 16;
    ctx.fillStyle = task.done ? "#D8F0D8" : "#FFFDE0";
    ctx.fillRect(b.x+8, ty, b.w-16, 13);
    ctx.strokeStyle = task.done ? "#80CC80" : "#CCBB40"; ctx.lineWidth = 0.5;
    ctx.strokeRect(b.x+8, ty, b.w-16, 13);
    ctx.strokeStyle = "#555"; ctx.lineWidth = 1;
    ctx.strokeRect(b.x+10, ty+2, 9, 9);
    if (task.done) {
      ctx.strokeStyle = "#2A8A2A"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x+12, ty+7); ctx.lineTo(b.x+15, ty+10); ctx.lineTo(b.x+19, ty+4);
      ctx.stroke();
    }
    ctx.fillStyle = task.done ? "#4A8A4A" : "#3A2A00";
    ctx.font = task.done ? "9px monospace" : "bold 9px monospace";
    ctx.fillText(task.text.slice(0,30), b.x+24, ty+10);
  });
  ctx.textAlign = "left";
}

// ── WORLD OBJECTS (drawn on the floor, pickable) ──────────────────────────────
export function drawWorldObjects(ctx, objects) {
  for (const obj of objects) {
    if (obj.heldBy) continue; // don't draw if someone's carrying it
    const { x, y, type, color, radius } = obj;

    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.ellipse(x+2, y+4, radius, radius*0.45, 0, 0, Math.PI*2); ctx.fill();

    switch (type) {
      case "basketball":
        ctx.fillStyle = "#E87020";
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#A04010"; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = "#5A2000"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x-radius,y); ctx.lineTo(x+radius,y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x,y-radius); ctx.lineTo(x,y+radius); ctx.stroke();
        break;
      case "volleyball":
        ctx.fillStyle = "#F8F8F4";
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#AAAAAA"; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = "#3355CC"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x-radius,y); ctx.lineTo(x+radius,y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x,y-radius); ctx.lineTo(x,y+radius); ctx.stroke();
        break;
      case "football":
        ctx.fillStyle = "#1A1A1A";
        ctx.beginPath(); ctx.ellipse(x, y, radius*1.2, radius*0.9, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, radius*0.5, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x-1, y-radius*0.7, 2, radius*1.4);
        break;
      case "books":
        ctx.fillStyle = "#E04040"; ctx.fillRect(x-16, y-10, 32, 18);
        ctx.fillStyle = "#4060CC"; ctx.fillRect(x-13, y-12, 28, 16);
        ctx.fillStyle = "#40AA50"; ctx.fillRect(x-10, y-14, 24, 14);
        ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(x-10, y-14, 24, 4);
        ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1; ctx.strokeRect(x-10, y-14, 24, 14);
        break;
      case "marker":
        ctx.fillStyle = color;
        ctx.fillRect(x-3, y-12, 6, 20);
        ctx.fillStyle = "#222"; ctx.fillRect(x-2, y+8, 4, 4);
        ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(x-2, y-12, 3, 14);
        break;
      case "saxophone":
        ctx.fillStyle = "#D4A020"; ctx.fillRect(x-3, y-14, 6, 20);
        ctx.beginPath(); ctx.arc(x-3, y+6, 6, 0, Math.PI); ctx.fill();
        ctx.fillStyle = "#AA7A00";
        for (let i=0;i<4;i++) ctx.fillRect(x-3, y-10+i*4, 6, 2);
        break;
      case "mallet":
        ctx.fillStyle = "#8B6038"; ctx.fillRect(x-2, y-14, 4, 22);
        ctx.fillStyle = "#333"; ctx.beginPath(); ctx.arc(x, y-14, 6, 0, Math.PI*2); ctx.fill();
        break;
      case "crown":
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.moveTo(x-12, y+6); ctx.lineTo(x-12, y-6);
        ctx.lineTo(x-6,  y);   ctx.lineTo(x,    y-10);
        ctx.lineTo(x+6,  y);   ctx.lineTo(x+12, y-6);
        ctx.lineTo(x+12, y+6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#AA8800"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle="#FF2020"; ctx.beginPath(); ctx.arc(x,    y-6, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle="#2020FF"; ctx.beginPath(); ctx.arc(x-7,  y,   2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle="#20AA20"; ctx.beginPath(); ctx.arc(x+7,  y,   2, 0, Math.PI*2); ctx.fill();
        break;
      default:
        ctx.fillStyle = color || "#888";
        ctx.beginPath(); ctx.arc(x, y, radius || 12, 0, Math.PI*2); ctx.fill();
    }

    // Sparkle ring (always visible — invites pickup)
    ctx.strokeStyle = "rgba(255,220,60,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3,4]);
    ctx.beginPath(); ctx.arc(x, y, (radius||12)+6, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
  }
}

// ── COINS ─────────────────────────────────────────────────────────────────────
export function drawCoins(ctx, coins, now) {
  for (const coin of coins) {
    if (coin.collected) continue;
    const { x, y } = coin;
    const spin = (now / 800) % (Math.PI * 2);
    const squeeze = Math.abs(Math.cos(spin)); // 0-1, coin "spinning" illusion

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(x+1, y+4, 9*squeeze+1, 4, 0, 0, Math.PI*2); ctx.fill();

    // Coin body
    const cw = Math.max(2, 9 * squeeze);
    const g = ctx.createLinearGradient(x-cw, y-8, x+cw, y+8);
    g.addColorStop(0, "#E8C020"); g.addColorStop(0.5, "#FFE060"); g.addColorStop(1, "#B89010");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, cw, 9, 0, 0, Math.PI*2); ctx.fill();

    // Rim
    ctx.strokeStyle = "#AA8010"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x, y, cw, 9, 0, 0, Math.PI*2); ctx.stroke();

    // ₡ symbol (when facing front)
    if (squeeze > 0.5) {
      ctx.fillStyle = "rgba(130,80,0,0.7)";
      ctx.font = `bold ${Math.round(7*squeeze)}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText("₡", x, y+3);
      ctx.textAlign = "left";
    }
  }
}

// ── BOOKS ─────────────────────────────────────────────────────────────────────
export function drawBooks(ctx, books) {
  for (const book of books) {
    const { x, y, color, emoji } = book;
    const bw = 18, bh = 22;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(x - bw/2 + 2, y - bh/2 + 2, bw, bh);

    // Cover
    ctx.fillStyle = color;
    ctx.fillRect(x - bw/2, y - bh/2, bw, bh);

    // Spine
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x - bw/2, y - bh/2, 3, bh);

    // Page edge (right side)
    ctx.fillStyle = "#F8F4E8";
    ctx.fillRect(x + bw/2 - 2, y - bh/2 + 1, 2, bh - 2);

    // Outline
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1;
    ctx.strokeRect(x - bw/2, y - bh/2, bw, bh);

    // Emoji on cover
    ctx.font = "9px serif";
    ctx.textAlign = "center";
    ctx.fillText(emoji, x + 1, y + 3);
    ctx.textAlign = "left";

    // Glow invitation ring
    ctx.strokeStyle = "rgba(255,200,100,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
  }
}

// ── PAPER PLANES (in flight) ──────────────────────────────────────────────────
export function drawPlanes(ctx, planes) {
  for (const plane of planes) {
    const { x, y, vx, vy, age, maxAge } = plane;
    const opacity = Math.max(0, 1 - age / maxAge);
    const angle   = Math.atan2(vy, vx);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Paper plane shape
    ctx.fillStyle = "#F4F4F0";
    ctx.strokeStyle = "#AAAAAA";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Fold line
    ctx.beginPath();
    ctx.moveTo(-4, 0); ctx.lineTo(14, 0);
    ctx.stroke();

    ctx.restore();
  }
}
