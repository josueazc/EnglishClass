// ──────────────────────────────────────────────────────────────────────────────
// PochisClass Classroom Map  ·  2500 × 1800 world
// Habbo Hotel / Gather Town / Club Penguin style
// ──────────────────────────────────────────────────────────────────────────────
export const WORLD_W = 2500;
export const WORLD_H = 1800;
export const TILE    = 32;

const WT = 32, WL = 32, WR = 32, WB = 32;

export const WHITEBOARD   = { x:1000, y:18,  w:500, h:180 };
export const TEACHER_DESK = { x:1155, y:252, w:190, h:96  };
export const BULLETIN     = { x:2040, y:22,  w:185, h:82  };
export const SCREEN_ZONE  = BULLETIN;

export const BOUNDS = {
  x: WL, y: WT,
  w: WORLD_W - WL - WR,
  h: WORLD_H - WT - WB,
};

// ── Student desks: 5 groups × 4 (2×2) = 20 desks ────────────────────────────
export const DW = 64, DH = 64;
const _GRP = [[500,620],[1060,575],[1640,635],[700,1020],[1280,1000]];
export const DESKS = [];
for (const [gcx,gcy] of _GRP) {
  for (const [ox,oy] of [[-44,-44],[44,-44],[-44,44],[44,44]]) {
    const dcx=gcx+ox, dcy=gcy+oy;
    DESKS.push({ x:dcx-32, y:dcy-32, w:64, h:64, seatX:dcx, seatY:dcy+52 });
  }
}

// ── Pickable world objects ────────────────────────────────────────────────────
export const WORLD_OBJECTS = [
  { id:"basketball",  type:"basketball",  x:2220, y:1630, label:"🏀 Balón de basket", color:"#E87020", radius:14 },
  { id:"volleyball",  type:"volleyball",  x:2290, y:1690, label:"🏐 Balón de voley",  color:"#F0F0F0", radius:13 },
  { id:"football",    type:"football",    x:2175, y:1670, label:"⚽ Balón de fútbol", color:"#1A1A1A", radius:13 },
  { id:"marker_red",  type:"marker",      x:1012, y:244,  label:"🖊 Marcador rojo",   color:"#DD2020", radius:8  },
  { id:"marker_blue", type:"marker",      x:1036, y:244,  label:"🖊 Marcador azul",   color:"#2040EE", radius:8  },
  { id:"saxophone",   type:"saxophone",   x:130,  y:1580, label:"🎷 Saxofón",         color:"#D4A020", radius:12 },
  { id:"crown",       type:"crown",       x:1250, y:195,  label:"👑 Corona",          color:"#FFD700", radius:10 },
  { id:"paper_plane", type:"paper_plane", x:800,  y:195,  label:"✈ Avión de papel",  color:"#F0F0F0", radius:10 },
  { id:"eraser",      type:"eraser",      x:1060, y:244,  label:"🧹 Borrador",        color:"#F0D0A0", radius:8  },
];

// ── Coins (25) ────────────────────────────────────────────────────────────────
export const COIN_DEFS = [
  { id:"cn0",  x:340,  y:185  }, { id:"cn1",  x:710,  y:165  },
  { id:"cn2",  x:940,  y:410  }, { id:"cn3",  x:1680, y:175  },
  { id:"cn4",  x:1960, y:410  }, { id:"cn5",  x:2310, y:185  },
  { id:"cn6",  x:290,  y:630  }, { id:"cn7",  x:790,  y:590  },
  { id:"cn8",  x:1360, y:600  }, { id:"cn9",  x:1880, y:650  },
  { id:"cn10", x:395,  y:860  }, { id:"cn11", x:910,  y:830  },
  { id:"cn12", x:1510, y:850  }, { id:"cn13", x:2010, y:870  },
  { id:"cn14", x:200,  y:1200 }, { id:"cn15", x:610,  y:1155 },
  { id:"cn16", x:1110, y:1210 }, { id:"cn17", x:1610, y:1185 },
  { id:"cn18", x:2110, y:1205 }, { id:"cn19", x:2360, y:1105 },
  { id:"cn20", x:46,   y:1720 }, { id:"cn21", x:2445, y:1720 },
  { id:"cn22", x:46,   y:48   }, { id:"cn23", x:2445, y:48   },
  { id:"cn24", x:1250, y:1710 },
];

// ── Interactive books (10) ────────────────────────────────────────────────────
export const BOOK_DEFS = [
  { id:"bk0", x:500,  y:620,  color:"#DD3030", emoji:"📕", title:"Diario de Clase"       },
  { id:"bk1", x:1060, y:575,  color:"#3060CC", emoji:"📘", title:"Libro de Ideas"        },
  { id:"bk2", x:700,  y:1020, color:"#30AA50", emoji:"📗", title:"Chistes & Memes"       },
  { id:"bk3", x:1280, y:1000, color:"#BB7020", emoji:"📙", title:"Libro de los Sueños"   },
  { id:"bk4", x:202,  y:130,  color:"#CC20AA", emoji:"📓", title:"Secretos de la Biblio" },
  { id:"bk5", x:1860, y:445,  color:"#20AACC", emoji:"📒", title:"Libro de Aventuras"    },
  { id:"bk6", x:500,  y:1400, color:"#DDAA20", emoji:"📔", title:"Cancionero"            },
  { id:"bk7", x:2210, y:1710, color:"#AA20DD", emoji:"📃", title:"Diario Gamer"          },
  { id:"bk8", x:95,   y:760,  color:"#DD6020", emoji:"📜", title:"Mapa Secreto"          },
  { id:"bk9", x:1370, y:252,  color:"#20DD80", emoji:"📋", title:"Notas del Profesor"    },
];

// ── Interaction helpers ───────────────────────────────────────────────────────
export function isNearWhiteboard(px, py) {
  return py < WHITEBOARD.y + WHITEBOARD.h + 130
      && px > WHITEBOARD.x - 50
      && px < WHITEBOARD.x + WHITEBOARD.w + 50;
}
export function isNearBulletin(px, py) {
  return py < BULLETIN.y + BULLETIN.h + 130
      && px > BULLETIN.x - 50
      && px < BULLETIN.x + BULLETIN.w + 50;
}
export function isNearBook(px, py) {
  return BOOK_DEFS.find(b => Math.hypot(b.x-px, b.y-py) < 56) || null;
}
export function getNearbyDesk(px, py) {
  for (let i=0; i<DESKS.length; i++) {
    const d=DESKS[i];
    if (Math.abs(px-(d.x+32))<72 && Math.abs(py-(d.y+32))<72) return i;
  }
  return -1;
}
export function clampToBounds(x, y) {
  return {
    x: Math.max(BOUNDS.x+18, Math.min(BOUNDS.x+BOUNDS.w-18, x)),
    y: Math.max(BOUNDS.y+26, Math.min(BOUNDS.y+BOUNDS.h-26, y)),
  };
}

// ── MAIN DRAW ─────────────────────────────────────────────────────────────────
export function drawClassroom(ctx, now=0) {
  _floor(ctx);
  _walls(ctx);
  _windowLightRays(ctx);
  _biblioteca(ctx);
  _trophyCase(ctx);
  _corkBoards(ctx);
  _clock(ctx);
  _whiteboard(ctx);
  _bulletinBoard(ctx);
  _teacherDesk(ctx);
  _windows(ctx);
  _lockers(ctx);
  _studentDesks(ctx);
  _computers(ctx);
  _sofas(ctx);
  _musicZone(ctx);
  _gamerZone(ctx);
  _plants(ctx);
  _rug(ctx);
  _dustParticles(ctx, now);
}

// ── FLOOR ─────────────────────────────────────────────────────────────────────
function _floor(ctx) {
  const x=WL, y=WT, w=WORLD_W-WL-WR, h=WORLD_H-WT-WB;
  const TS = 64; // tile size
  const COLS_T = Math.ceil(w/TS)+1;
  const ROWS_T = Math.ceil(h/TS)+1;

  const baseColors = ["#DDD8CC","#D4D0C4","#E0DBCF","#D8D4C8"];
  const grout = "#C8C2B8";

  for (let row=0; row<ROWS_T; row++) {
    for (let col=0; col<COLS_T; col++) {
      const tx = x + col*TS;
      const ty = y + row*TS;
      const ci = (row+col)%2===0 ? 0 : 1;
      // Occasional special tile
      const special = (col*7+row*13)%31 === 0;
      ctx.fillStyle = special ? "#D0DAD0" : baseColors[ci + (((col+row)*3)%2)*2];
      ctx.fillRect(tx, ty, TS, TS);
      // Subtle wear marks
      if ((col*5+row*11)%19===0) {
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(tx+8, ty+8, 24, 24);
      }
    }
  }
  // Grout lines
  ctx.strokeStyle = grout; ctx.lineWidth = 1;
  for (let col=0; col<=COLS_T; col++) {
    ctx.beginPath(); ctx.moveTo(x+col*TS, y); ctx.lineTo(x+col*TS, y+h); ctx.stroke();
  }
  for (let row=0; row<=ROWS_T; row++) {
    ctx.beginPath(); ctx.moveTo(x, y+row*TS); ctx.lineTo(x+w, y+row*TS); ctx.stroke();
  }
  // Edge vignette
  const vg=60;
  const gL=ctx.createLinearGradient(x,y,x+vg,y);
  gL.addColorStop(0,"rgba(0,0,0,0.18)"); gL.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=gL; ctx.fillRect(x,y,vg,h);
  const gR=ctx.createLinearGradient(x+w-vg,y,x+w,y);
  gR.addColorStop(0,"rgba(0,0,0,0)"); gR.addColorStop(1,"rgba(0,0,0,0.16)");
  ctx.fillStyle=gR; ctx.fillRect(x+w-vg,y,vg,h);
  const gT=ctx.createLinearGradient(x,y,x,y+vg);
  gT.addColorStop(0,"rgba(0,0,0,0.12)"); gT.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=gT; ctx.fillRect(x,y,w,vg);
}

// ── WALLS ─────────────────────────────────────────────────────────────────────
function _walls(ctx) {
  const W=WORLD_W, H=WORLD_H;
  // Top wall (green school wall with colored stripe)
  const gTop = ctx.createLinearGradient(0,0,0,WT);
  gTop.addColorStop(0,"#2A7020"); gTop.addColorStop(1,"#358828");
  ctx.fillStyle=gTop; ctx.fillRect(0,0,W,WT);
  // Stripe near baseboard
  ctx.fillStyle="#1E5018"; ctx.fillRect(0,WT-8,W,8);
  ctx.fillStyle="rgba(255,255,255,0.06)"; ctx.fillRect(0,WT-8,W,2);

  // Left wall — cream
  const gL = ctx.createLinearGradient(0,0,WL,0);
  gL.addColorStop(0,"#D8C8A8"); gL.addColorStop(1,"#EEE4CC");
  ctx.fillStyle=gL; ctx.fillRect(0,WT,WL,H-WT);
  ctx.fillStyle="#B8A888"; ctx.fillRect(WL-6,WT,6,H-WT);

  // Right wall — cream
  const gR = ctx.createLinearGradient(W-WR,0,W,0);
  gR.addColorStop(0,"#EEE4CC"); gR.addColorStop(1,"#D8C8A8");
  ctx.fillStyle=gR; ctx.fillRect(W-WR,WT,WR,H-WT);
  ctx.fillStyle="#B8A888"; ctx.fillRect(W-WR,WT,6,H-WT);

  // Bottom wall — cream
  const gB = ctx.createLinearGradient(0,H-WB,0,H);
  gB.addColorStop(0,"#D8C8A8"); gB.addColorStop(1,"#C8B898");
  ctx.fillStyle=gB; ctx.fillRect(0,H-WB,W,WB);
  ctx.fillStyle="#B8A888"; ctx.fillRect(0,H-WB,W,6);

  // Corner caps (dark)
  ctx.fillStyle="#1A1208";
  ctx.fillRect(0,0,WL,WT); ctx.fillRect(W-WR,0,WR,WT);
  ctx.fillRect(0,H-WB,WL,WB); ctx.fillRect(W-WR,H-WB,WR,WB);

  // Alphabet border on top wall
  ctx.font="bold 9px monospace"; ctx.textAlign="center";
  const ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i=0;i<ALPHA.length;i++) {
    ctx.fillStyle=`hsl(${i*14},70%,75%)`;
    ctx.fillText(ALPHA[i], WL+40+i*80, 20);
  }
  ctx.textAlign="left";

  // Bottom wall door + lockers row
  _door(ctx);
}

function _door(ctx) {
  const dx=WORLD_W-WR, dw=WR, dh=120, dy=WORLD_H-WB-dh;
  const dg=ctx.createLinearGradient(dx,dy,dx+dw,dy);
  dg.addColorStop(0,"#C09060"); dg.addColorStop(1,"#A07040");
  ctx.fillStyle="#9A6840"; ctx.fillRect(dx,dy,dw,dh);
  ctx.fillStyle=dg; ctx.fillRect(dx+3,dy+3,dw-6,dh-6);
  ctx.fillStyle="rgba(0,0,0,0.08)";
  ctx.fillRect(dx+6,dy+8,dw-12,(dh-20)/2-4);
  ctx.fillRect(dx+6,dy+(dh-20)/2+10,dw-12,(dh-20)/2-4);
  ctx.fillStyle="#FFD700";
  ctx.beginPath(); ctx.arc(dx+10,dy+dh/2+10,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(255,150,0,0.8)"; ctx.font="bold 8px monospace";
  ctx.textAlign="center"; ctx.fillText("SALIDA",dx+dw/2,dy+dh/2-12); ctx.textAlign="left";
}

// ── WINDOW LIGHT RAYS ─────────────────────────────────────────────────────────
function _windowLightRays(ctx) {
  const leftWinY = [430, 700, 970];
  ctx.save();
  for (const wy of leftWinY) {
    const g = ctx.createLinearGradient(WL, wy, WL+480, wy+160);
    g.addColorStop(0,"rgba(255,220,140,0.09)");
    g.addColorStop(1,"rgba(255,220,140,0)");
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(WL, wy); ctx.lineTo(WL, wy+88);
    ctx.lineTo(WL+560, wy+270); ctx.lineTo(WL+560, wy+182);
    ctx.closePath(); ctx.fill();
  }
  const rightWinY = [380, 660, 940];
  for (const wy of rightWinY) {
    const g = ctx.createLinearGradient(WORLD_W-WR, wy, WORLD_W-WR-480, wy+160);
    g.addColorStop(0,"rgba(255,220,140,0.07)");
    g.addColorStop(1,"rgba(255,220,140,0)");
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(WORLD_W-WR, wy); ctx.lineTo(WORLD_W-WR, wy+88);
    ctx.lineTo(WORLD_W-WR-560, wy+270); ctx.lineTo(WORLD_W-WR-560, wy+182);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ── WINDOWS ───────────────────────────────────────────────────────────────────
function _windows(ctx) {
  // Left wall — 3 windows
  for (const cy of [430, 700, 970]) _window(ctx, 0, cy, "left");
  // Right wall — 3 windows
  for (const cy of [380, 660, 940]) _window(ctx, WORLD_W-WR, cy, "right");
}

function _window(ctx, wallX, cy, side) {
  const ww=WR, wh=88, wy=cy-wh/2;
  const wx = side==="left" ? wallX : wallX;

  // Frame
  ctx.fillStyle="#C8A870"; ctx.fillRect(wx, wy, ww, wh);
  // Sky gradient
  const sg=ctx.createLinearGradient(wx,wy+4,wx,wy+wh-4);
  sg.addColorStop(0,"#88C8F0"); sg.addColorStop(0.6,"#B0DFF8"); sg.addColorStop(1,"#7AB830");
  ctx.fillStyle=sg; ctx.fillRect(wx+4,wy+4,ww-8,wh-8);
  // Clouds
  ctx.fillStyle="rgba(255,255,255,0.85)";
  ctx.beginPath(); ctx.ellipse(wx+12,wy+16,8,5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(wx+22,wy+20,6,4,0,0,Math.PI*2); ctx.fill();
  // Sun
  ctx.fillStyle="rgba(255,220,0,0.9)";
  ctx.beginPath(); ctx.arc(wx+(side==="left"?20:12),wy+12,5,0,Math.PI*2); ctx.fill();
  // Tree tops
  ctx.fillStyle="#2A8A20";
  ctx.beginPath(); ctx.ellipse(wx+8,wy+wh-14,7,10,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#1E6A18";
  ctx.beginPath(); ctx.ellipse(wx+8,wy+wh-16,5,8,0,0,Math.PI*2); ctx.fill();
  // Crossbar
  ctx.strokeStyle="#C8A870"; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(wx+ww/2,wy+4); ctx.lineTo(wx+ww/2,wy+wh-4);
  ctx.moveTo(wx+4,wy+wh/2); ctx.lineTo(wx+ww-4,wy+wh/2);
  ctx.stroke();
  // Sill
  ctx.fillStyle="#A88840"; ctx.fillRect(wx,wy+wh,ww,5);
  // Glass sheen
  ctx.fillStyle="rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(wx+4,wy+4); ctx.lineTo(wx+ww-4,wy+4);
  ctx.lineTo(wx+ww/2-2,wy+wh/2-4); ctx.lineTo(wx+4,wy+wh/2-4);
  ctx.fill();
}

// ── BIBLIOTECA (upper left) ───────────────────────────────────────────────────
function _biblioteca(ctx) {
  const bx=WL+4, by=WT+4, bw=320, bh=186;
  // Cabinet shadow
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(bx+5,by+5,bw,bh);
  // Back panel
  ctx.fillStyle="#3A1C08"; ctx.fillRect(bx,by,bw,bh);

  const SHELF_H = bh/6;
  const bookColors = [
    "#E04040","#4060CC","#40AA50","#DD8020","#8030BB",
    "#CC9020","#308080","#DD4080","#20A8A0","#C04060",
    "#60C040","#A040C0","#E08840","#4080E0","#80E040",
  ];

  // Shelf boards and books
  for (let s=0; s<6; s++) {
    const sy = by + s * SHELF_H;
    const sh = SHELF_H - 4;

    // Shelf board
    ctx.fillStyle = "#6A3A18";
    ctx.fillRect(bx, sy + sh, bw, 4);
    // Board highlight
    ctx.fillStyle="rgba(255,200,120,0.15)";
    ctx.fillRect(bx, sy+sh, bw, 1.5);

    // Books on this shelf
    let bkx = bx + 4;
    const nBooks = Math.floor(bw / 16) - 1;
    for (let b=0; b<nBooks; b++) {
      const bkColor = bookColors[(s*11+b*7)%bookColors.length];
      const bkW = 12 + (b*3)%6;
      if (bkx + bkW > bx+bw-4) break;
      // Slight lean
      const lean = ((b+s)%3 - 1) * 0.04;
      ctx.save(); ctx.translate(bkx+bkW/2, sy+sh-2);
      ctx.rotate(lean);
      ctx.fillStyle=bkColor;
      ctx.fillRect(-bkW/2, -(sh-2), bkW, sh-2);
      // Spine highlight
      ctx.fillStyle="rgba(255,255,255,0.2)";
      ctx.fillRect(-bkW/2, -(sh-2), 2, sh-2);
      ctx.restore();
      bkx += bkW + 2;
    }
  }

  // Label
  ctx.fillStyle="rgba(255,220,120,0.7)"; ctx.font="bold 9px monospace";
  ctx.textAlign="center";
  ctx.fillText("📚 BIBLIOTECA", bx+bw/2, by-8);
  ctx.textAlign="left";

  // Decorative globe on top
  ctx.fillStyle="#2060A0";
  ctx.beginPath(); ctx.arc(bx+bw-20, by-18, 14, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle="#4080C0"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.ellipse(bx+bw-20, by-18, 14, 6, 0, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx+bw-20, by-32); ctx.lineTo(bx+bw-20, by-4); ctx.stroke();
  ctx.fillStyle="#60A0D0"; ctx.fillRect(bx+bw-34, by-20, 28, 4);
}

// ── TROPHY CASE ───────────────────────────────────────────────────────────────
function _trophyCase(ctx) {
  const tx=1565, ty=14, tw=390, th=110;
  // Glass shadow
  ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(tx+4,ty+4,tw,th);
  // Frame
  ctx.fillStyle="#1A1A2E"; ctx.fillRect(tx-5,ty-5,tw+10,th+10);
  // Glass
  ctx.fillStyle="rgba(180,210,245,0.14)"; ctx.fillRect(tx,ty,tw,th);
  ctx.strokeStyle="#6090BB"; ctx.lineWidth=1.5; ctx.strokeRect(tx,ty,tw,th);

  // 12 trophies
  const tColors=["#D4A020","#AAAAAA","#C47020","#D4A020","#AAAAAA","#D4A020",
                  "#C47020","#AAAAAA","#D4A020","#C47020","#D4A020","#AAAAAA"];
  const tSizes =[52,44,40,48,44,50,46,42,50,46,44,48];

  for (let i=0; i<12; i++) {
    const tc=tColors[i], ts=tSizes[i];
    const ttx=tx+16+i*32, tty=ty+th-8;
    // Base plate
    ctx.fillStyle="#333";
    ctx.fillRect(ttx-8, tty-4, 16, 4);
    // Stem
    ctx.fillStyle=tc;
    ctx.fillRect(ttx-3, tty-4-ts*0.4, 6, ts*0.4);
    // Cup
    ctx.beginPath();
    ctx.arc(ttx, tty-4-ts*0.4, 10, Math.PI, 0); ctx.fill();
    ctx.fillRect(ttx-10, tty-4-ts, 20, ts*0.6);
    ctx.beginPath();
    ctx.ellipse(ttx, tty-4-ts, 12, 6, 0, Math.PI, 0, true); ctx.fill();
    // Handles
    ctx.strokeStyle=tc; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(ttx-12, tty-4-ts*0.7, 4, 0.5, 2.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(ttx+12, tty-4-ts*0.7, 4, 0.5, 2.6, true); ctx.stroke();
    // Star
    ctx.fillStyle="#FFFFFFAA"; ctx.font="7px serif"; ctx.textAlign="center";
    ctx.fillText("★", ttx, tty-4-ts+6);
  }
  ctx.textAlign="left";

  // Label
  ctx.fillStyle="rgba(200,220,255,0.55)"; ctx.font="bold 8px monospace";
  ctx.textAlign="center";
  ctx.fillText("🏆 VITRINA DE TROFEOS", tx+tw/2, ty+th+14);
  ctx.textAlign="left";
}

// ── CORK BOARDS (4 informational boards) ─────────────────────────────────────
function _corkBoards(ctx) {
  _corkBoard(ctx, 2295, 24, 180, 96, "📌 EVENTOS");
  _corkBoard(ctx, WL+4,  380, 96,  64, "📢 NOTICIAS");
  _corkBoard(ctx, WL+4,  1350, 96, 64, "📅 AGENDA");
  _corkBoard(ctx, 1250, WORLD_H-WB-68, 160, 60, "🎓 BIENVENIDOS");
}

function _corkBoard(ctx, x, y, w, h, label) {
  // Frame
  ctx.fillStyle="#3A2008"; ctx.fillRect(x-4,y-4,w+8,h+8);
  // Cork
  const cg=ctx.createLinearGradient(x,y,x+w,y+h);
  cg.addColorStop(0,"#C89050"); cg.addColorStop(1,"#A87030");
  ctx.fillStyle=cg; ctx.fillRect(x,y,w,h);
  // Texture dots
  for (let i=0; i<30; i++) {
    ctx.fillStyle=`rgba(${100+i%25},${60+i%18},${20+i%12},0.2)`;
    ctx.fillRect(x+(i*37)%w, y+(i*23)%(h), 3, 3);
  }
  // Paper notes
  const noteColors=["#FFFDE0","#FFE0E0","#E0F0FF","#E0FFE0"];
  for (let n=0; n<3; n++) {
    const nx=x+6+n*(w/3-2), ny=y+8;
    ctx.fillStyle=noteColors[n];
    ctx.fillRect(nx, ny, w/3-6, h-14);
    ctx.fillStyle="rgba(0,0,0,0.15)";
    for (let l=0; l<4; l++) ctx.fillRect(nx+3, ny+4+l*6, w/3-12, 1.5);
    // Pin
    ctx.fillStyle=["#E84020","#2080EE","#20CC50"][n];
    ctx.beginPath(); ctx.arc(nx+w/6-3, ny+2, 3, 0, Math.PI*2); ctx.fill();
  }
  // Label
  ctx.fillStyle="rgba(60,30,0,0.7)"; ctx.font="bold 7px monospace";
  ctx.textAlign="center"; ctx.fillText(label, x+w/2, y+h+12); ctx.textAlign="left";
}

// ── CLOCK ─────────────────────────────────────────────────────────────────────
function _clock(ctx) {
  const cx=840, cy=16;
  const now=new Date();
  const hA=((now.getHours()%12)+now.getMinutes()/60)*Math.PI/6-Math.PI/2;
  const mA=now.getMinutes()*Math.PI/30-Math.PI/2;
  const sA=now.getSeconds()*Math.PI/30-Math.PI/2;

  ctx.fillStyle="#DDDDDD"; ctx.beginPath(); ctx.arc(cx,cy,22,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#444"; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle="#F8F8F8"; ctx.beginPath(); ctx.arc(cx,cy,19,0,Math.PI*2); ctx.fill();
  for (let i=0; i<12; i++) {
    const a=i*Math.PI/6;
    ctx.strokeStyle=i%3===0?"#444":"#AAA"; ctx.lineWidth=i%3===0?1.5:1;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*(i%3===0?13:16), cy+Math.sin(a)*(i%3===0?13:16));
    ctx.lineTo(cx+Math.cos(a)*18, cy+Math.sin(a)*18); ctx.stroke();
  }
  // Number 12 at top
  ctx.fillStyle="#333"; ctx.font="bold 6px monospace"; ctx.textAlign="center";
  ctx.fillText("12",cx,cy-10); ctx.textAlign="left";
  // Hour hand
  ctx.strokeStyle="#222"; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(hA)*10,cy+Math.sin(hA)*10); ctx.stroke();
  // Minute hand
  ctx.strokeStyle="#333"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(mA)*15,cy+Math.sin(mA)*15); ctx.stroke();
  // Seconds hand
  ctx.strokeStyle="#DD2020"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(sA)*16,cy+Math.sin(sA)*16); ctx.stroke();
  ctx.fillStyle="#222"; ctx.beginPath(); ctx.arc(cx,cy,2.5,0,Math.PI*2); ctx.fill();
}

// ── WHITEBOARD (pizarra principal) ────────────────────────────────────────────
function _whiteboard(ctx) {
  const wb=WHITEBOARD;
  // Shadow
  ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(wb.x+5,wb.y+5,wb.w+2,wb.h+2);
  // Wooden frame
  ctx.fillStyle="#2A1808"; ctx.fillRect(wb.x-8,wb.y-8,wb.w+16,wb.h+16);
  // Board surface
  const sg=ctx.createLinearGradient(wb.x,wb.y,wb.x,wb.y+wb.h);
  sg.addColorStop(0,"#F6F6FA"); sg.addColorStop(1,"#EEEEF4");
  ctx.fillStyle=sg; ctx.fillRect(wb.x,wb.y,wb.w,wb.h);
  // Ruled lines
  ctx.strokeStyle="rgba(100,140,210,0.15)"; ctx.lineWidth=1;
  for (let yy=wb.y+22; yy<wb.y+wb.h-8; yy+=20) {
    ctx.beginPath(); ctx.moveTo(wb.x+10,yy); ctx.lineTo(wb.x+wb.w-10,yy); ctx.stroke();
  }
  // Marker tray
  ctx.fillStyle="#222233"; ctx.fillRect(wb.x,wb.y+wb.h,wb.w,8);
  // Tray markers
  ["#E02020","#2050DD","#20AA40","#FF8800","#8020CC","#20AAA0","#CCAA20"].forEach((c,i)=>{
    ctx.fillStyle=c; ctx.fillRect(wb.x+10+i*18, wb.y+wb.h+2, 8, 4);
  });
  // Eraser on tray
  ctx.fillStyle="#F0D0A0"; ctx.fillRect(wb.x+wb.w-30, wb.y+wb.h+1, 22, 6);
  ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.fillRect(wb.x+wb.w-30, wb.y+wb.h+1, 22, 2);
  // Label
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.font="bold 10px monospace";
  ctx.fillText("PIZARRÓN COLABORATIVO", wb.x+10, wb.y+wb.h+20);
}

// ── BULLETIN BOARD (tareas) ───────────────────────────────────────────────────
function _bulletinBoard(ctx) {
  const b=BULLETIN;
  ctx.fillStyle="#3A2008"; ctx.fillRect(b.x-5,b.y-5,b.w+10,b.h+10);
  const cg=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);
  cg.addColorStop(0,"#C89050"); cg.addColorStop(1,"#A87030");
  ctx.fillStyle=cg; ctx.fillRect(b.x,b.y,b.w,b.h);
  for (let i=0;i<40;i++) {
    ctx.fillStyle=`rgba(${100+i%30},${60+i%20},${20+i%15},0.22)`;
    ctx.fillRect(b.x+(i*41)%b.w, b.y+(i*29)%(b.h), 3, 3);
  }
  // Header
  ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(b.x,b.y,b.w,18);
  ctx.fillStyle="#FFE080"; ctx.font="bold 9px monospace";
  ctx.textAlign="center"; ctx.fillText("📋 TAREAS", b.x+b.w/2, b.y+13); ctx.textAlign="left";
  // Corner pins
  const _pinC=["#E84020","#2080EE","#20CC50","#CC20AA"];
  [[b.x+6,b.y+22],[b.x+b.w-6,b.y+22],[b.x+6,b.y+b.h-6],[b.x+b.w-6,b.y+b.h-6]].forEach(([px,py],i)=>{
    ctx.fillStyle=_pinC[i]; ctx.beginPath(); ctx.arc(px,py,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(px-1,py-1,2,0,Math.PI*2); ctx.fill();
  });
}

// ── TEACHER DESK ──────────────────────────────────────────────────────────────
function _teacherDesk(ctx) {
  const td=TEACHER_DESK;
  // Shadow
  ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(td.x+6,td.y+6,td.w,td.h);
  // Desk surface
  const dg=ctx.createLinearGradient(td.x,td.y,td.x,td.y+td.h);
  dg.addColorStop(0,"#D09870"); dg.addColorStop(1,"#A07038");
  ctx.fillStyle=dg; ctx.fillRect(td.x,td.y,td.w,td.h);
  ctx.fillStyle="rgba(255,220,140,0.22)"; ctx.fillRect(td.x+4,td.y+4,td.w-14,16);
  ctx.fillStyle="#6A3A10"; ctx.fillRect(td.x,td.y+td.h-8,td.w,8);
  ctx.strokeStyle="#4A2008"; ctx.lineWidth=2; ctx.strokeRect(td.x,td.y,td.w,td.h);

  // Laptop
  const lx=td.x+50, ly=td.y+8;
  ctx.fillStyle="#111122"; ctx.fillRect(lx-3,ly-3,58,46);
  const ls=ctx.createLinearGradient(lx,ly,lx,ly+40);
  ls.addColorStop(0,"#2090FF"); ls.addColorStop(1,"#0050CC");
  ctx.fillStyle=ls; ctx.fillRect(lx,ly,52,38);
  ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.fillRect(lx,ly,52,14);
  ctx.fillStyle="#333344"; ctx.fillRect(lx+22,ly+38,8,6); ctx.fillRect(lx+16,ly+44,20,4);

  // Keyboard
  ctx.fillStyle="#D0D0D8"; ctx.fillRect(td.x+8,td.y+58,42,18);
  ctx.strokeStyle="#AAAAAA"; ctx.lineWidth=0.5;
  for (let i=0;i<4;i++) for (let j=0;j<8;j++) ctx.strokeRect(td.x+10+j*4.5,td.y+60+i*4,3.5,3);

  // Mug
  ctx.fillStyle="#CC2020"; ctx.fillRect(td.x+td.w-48,td.y+8,22,20);
  ctx.fillStyle="#FFFFFF"; ctx.fillRect(td.x+td.w-46,td.y+10,18,4);
  ctx.strokeStyle="#AA1010"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(td.x+td.w-48+22,td.y+14,6,Math.PI*0.2,Math.PI*1.8); ctx.stroke();

  // Plant (small)
  ctx.fillStyle="#AA3311"; ctx.fillRect(td.x+td.w-24,td.y+td.h-34,16,14);
  ctx.fillStyle="#1E8028"; ctx.beginPath(); ctx.ellipse(td.x+td.w-16,td.y+td.h-38,8,10,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#166020"; ctx.beginPath(); ctx.ellipse(td.x+td.w-10,td.y+td.h-40,6,8,-0.3,0,Math.PI*2); ctx.fill();

  // Notebook
  ctx.fillStyle="#3060CC"; ctx.fillRect(td.x+8,td.y+8,28,36);
  ctx.fillStyle="rgba(255,255,255,0.35)";
  for (let l=0;l<5;l++) ctx.fillRect(td.x+11,td.y+14+l*5,22,2);
  // Pencil
  ctx.fillStyle="#F5D020"; ctx.fillRect(td.x+td.w-55,td.y+8,3,28);
  ctx.fillStyle="#EE8844"; ctx.fillRect(td.x+td.w-55,td.y+34,3,4);

  // Nameplate
  ctx.fillStyle="#FFD700"; ctx.fillRect(td.x+td.w-90,td.y+td.h-22,86,16);
  ctx.fillStyle="#333"; ctx.font="bold 8px monospace";
  ctx.fillText("✨ Profe Pochis ✨", td.x+td.w-88,td.y+td.h-10);
}

// ── STUDENT DESKS ─────────────────────────────────────────────────────────────
function _studentDesks(ctx) {
  const nbColors=["#EE8080","#80AAEE","#80CC80","#EEE080","#CC80EE","#80EECC"];
  for (const d of DESKS) {
    // Shadow
    ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.fillRect(d.x+4,d.y+4,d.w,d.h);
    // Surface
    const g=ctx.createLinearGradient(d.x,d.y,d.x,d.y+d.h);
    g.addColorStop(0,"#C89060"); g.addColorStop(1,"#A06830");
    ctx.fillStyle=g; ctx.fillRect(d.x,d.y,d.w,d.h);
    ctx.fillStyle="rgba(255,230,160,0.2)"; ctx.fillRect(d.x+3,d.y+3,d.w-8,12);
    ctx.fillStyle="#6A3A10"; ctx.fillRect(d.x,d.y+d.h-6,d.w,6);
    ctx.strokeStyle="#4A2808"; ctx.lineWidth=1.5; ctx.strokeRect(d.x,d.y,d.w,d.h);

    // Items on desk
    const ci=Math.round(d.x/100+d.y/80)%nbColors.length;
    ctx.fillStyle=nbColors[ci];
    ctx.fillRect(d.x+5,d.y+5,18,26);
    ctx.fillStyle="rgba(255,255,255,0.4)";
    for (let l=0;l<4;l++) ctx.fillRect(d.x+7,d.y+9+l*5,14,2);
    // Pencil
    ctx.fillStyle="#F5D020"; ctx.fillRect(d.x+d.w-16,d.y+5,3,22);
    ctx.fillStyle="#EE8844"; ctx.fillRect(d.x+d.w-16,d.y+25,3,4);
    // Eraser dot
    ctx.fillStyle="#F0D0A0"; ctx.fillRect(d.x+d.w-14,d.y+5,8,6);

    // Chair below desk
    const cy2=d.y+d.h+6;
    ctx.fillStyle="rgba(0,0,0,0.12)"; ctx.fillRect(d.x+10,cy2+2,d.w-20,16);
    const cg2=ctx.createLinearGradient(d.x+8,cy2,d.x+8,cy2+14);
    cg2.addColorStop(0,"#6080CC"); cg2.addColorStop(1,"#405EA0");
    ctx.fillStyle=cg2; ctx.fillRect(d.x+8,cy2,d.w-16,14);
    ctx.fillStyle="rgba(140,160,220,0.3)"; ctx.fillRect(d.x+8,cy2,d.w-16,5);
    ctx.strokeStyle="#304080"; ctx.lineWidth=1; ctx.strokeRect(d.x+8,cy2,d.w-16,14);
    // Chair legs
    ctx.strokeStyle="#2A3060"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(d.x+10,cy2+14); ctx.lineTo(d.x+8,cy2+22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(d.x+14,cy2+14); ctx.lineTo(d.x+16,cy2+22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(d.x+d.w-10,cy2+14); ctx.lineTo(d.x+d.w-12,cy2+22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(d.x+d.w-14,cy2+14); ctx.lineTo(d.x+d.w-12,cy2+22); ctx.stroke();
  }
}

// ── COMPUTERS (6 computers, 2 tables) ────────────────────────────────────────
function _computers(ctx) {
  const tables = [
    { x:WL+8, y:WT+200, w:210, h:68 },
    { x:WL+8, y:WT+310, w:210, h:68 },
  ];
  for (const t of tables) {
    // Table shadow
    ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.fillRect(t.x+4,t.y+4,t.w,t.h);
    // Table surface
    ctx.fillStyle="#8A5A30"; ctx.fillRect(t.x,t.y,t.w,t.h);
    ctx.fillStyle="#6A3A10"; ctx.fillRect(t.x,t.y+t.h-6,t.w,6);
    ctx.strokeStyle="#5A2A08"; ctx.lineWidth=1.5; ctx.strokeRect(t.x,t.y,t.w,t.h);
    // 3 computers
    for (let i=0; i<3; i++) {
      const mx=t.x+8+i*68, my=t.y+6;
      // Monitor frame
      ctx.fillStyle="#111"; ctx.fillRect(mx,my,54,40);
      // Screen
      const sg=ctx.createLinearGradient(mx+2,my+2,mx+2,my+36);
      sg.addColorStop(0,"#1088CC"); sg.addColorStop(1,"#0055AA");
      ctx.fillStyle=sg; ctx.fillRect(mx+2,my+2,50,34);
      // Scanlines
      ctx.fillStyle="rgba(0,0,0,0.08)";
      for (let sl=0; sl<34; sl+=2) ctx.fillRect(mx+2,my+2+sl,50,1);
      // Screen glow
      ctx.fillStyle="rgba(30,120,200,0.12)";
      ctx.fillRect(mx-4,my-2,62,48);
      // Stand
      ctx.fillStyle="#333"; ctx.fillRect(mx+20,my+40,14,6); ctx.fillRect(mx+14,my+46,26,4);
      // Keyboard
      ctx.fillStyle="#CCC"; ctx.fillRect(mx+2,my+52,48,10);
      ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(mx+4,my+54,44,6);
    }
  }
  // Label
  ctx.fillStyle="rgba(100,200,255,0.55)"; ctx.font="bold 8px monospace";
  ctx.textAlign="center"; ctx.fillText("💻 COMPUTADORAS", WL+8+210/2, WT+200-10); ctx.textAlign="left";
}

// ── SOFAS (social zone) ────────────────────────────────────────────────────────
function _sofas(ctx) {
  _sofa(ctx, 870,  1270, 96, 48, "#4A3080", "#6040A8");
  _sofa(ctx, 1100, 1380, 96, 48, "#2A5070", "#3A6888");
  _sofa(ctx, 1330, 1260, 96, 48, "#502840", "#703458");
}

function _sofa(ctx, x, y, w, h, col1, col2) {
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+5,y+5,w,h);
  // Back cushion
  ctx.fillStyle=col1; ctx.fillRect(x,y,w,h*0.4);
  ctx.fillStyle=col2; ctx.fillRect(x+2,y+2,w-4,h*0.35);
  // Seat cushions (3)
  const cw=(w-8)/3;
  for (let i=0;i<3;i++) {
    ctx.fillStyle=col1; ctx.fillRect(x+4+i*(cw+2),y+h*0.4,cw,h*0.55);
    ctx.fillStyle=col2; ctx.fillRect(x+6+i*(cw+2),y+h*0.45,cw-4,h*0.45);
    // Cushion highlight
    ctx.fillStyle="rgba(255,255,255,0.12)"; ctx.fillRect(x+6+i*(cw+2),y+h*0.45,cw-4,4);
  }
  // Armrests
  ctx.fillStyle=col1;
  ctx.fillRect(x,y,8,h); ctx.fillRect(x+w-8,y,8,h);
  ctx.fillStyle=col2;
  ctx.fillRect(x+1,y+2,6,h-4); ctx.fillRect(x+w-7,y+2,6,h-4);
  // Outline
  ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=1.5; ctx.strokeRect(x,y,w,h);
}

// ── LOCKERS (12, right wall) ───────────────────────────────────────────────────
function _lockers(ctx) {
  const lw=48, lh=96, gap=8;
  const lockerColors=[
    "#CC4040","#4060CC","#40AA50","#CC8020","#8040CC","#40AACC",
    "#CC4080","#60AA40","#AA40CC","#40CCAA","#CCAA40","#CC6040",
  ];
  for (let i=0; i<12; i++) {
    const lx=WORLD_W-WR-lw-4;
    const ly=WT+40+i*(lh+gap);
    const col=lockerColors[i];
    // Shadow
    ctx.fillStyle="rgba(0,0,0,0.18)"; ctx.fillRect(lx+3,ly+3,lw,lh);
    // Locker body
    ctx.fillStyle=col; ctx.fillRect(lx,ly,lw,lh);
    // Highlight strip
    ctx.fillStyle="rgba(255,255,255,0.22)"; ctx.fillRect(lx+3,ly+3,lw-6,12);
    // Door line
    ctx.strokeStyle="rgba(0,0,0,0.2)"; ctx.lineWidth=0.5;
    ctx.strokeRect(lx+4,ly+4,lw-8,lh-8);
    // Handle
    ctx.fillStyle="#BBBBCC"; ctx.fillRect(lx+lw/2-4,ly+lh/2-6,8,12);
    ctx.fillStyle="#999AAA"; ctx.fillRect(lx+lw/2-3,ly+lh/2-4,6,8);
    // Number
    ctx.fillStyle="rgba(255,255,255,0.7)"; ctx.font="bold 9px monospace";
    ctx.textAlign="center"; ctx.fillText(i+1, lx+lw/2, ly+14); ctx.textAlign="left";
    // Vent slats
    ctx.strokeStyle="rgba(0,0,0,0.15)"; ctx.lineWidth=1;
    for (let s=0;s<3;s++) ctx.strokeRect(lx+8,ly+22+s*8,lw-16,5);
  }
  // Label
  ctx.fillStyle="rgba(200,200,200,0.55)"; ctx.font="bold 8px monospace";
  ctx.textAlign="center"; ctx.fillText("CASILLEROS", WORLD_W-WR-lw/2-4, WT+30); ctx.textAlign="left";
}

// ── MUSIC ZONE ────────────────────────────────────────────────────────────────
function _musicZone(ctx) {
  const mx=WL+4, my=WORLD_H-WB-300, mw=330, mh=272;
  // Zone carpet
  const zg=ctx.createLinearGradient(mx,my,mx+mw,my+mh);
  zg.addColorStop(0,"rgba(60,20,80,0.35)"); zg.addColorStop(1,"rgba(40,10,60,0.25)");
  ctx.fillStyle=zg; ctx.fillRect(mx,my,mw,mh);
  ctx.strokeStyle="rgba(160,80,200,0.5)"; ctx.lineWidth=2; ctx.strokeRect(mx,my,mw,mh);
  ctx.strokeStyle="rgba(180,100,220,0.25)"; ctx.lineWidth=1; ctx.strokeRect(mx+4,my+4,mw-8,mh-8);

  // Zone label
  ctx.fillStyle="rgba(220,160,255,0.7)"; ctx.font="bold 10px monospace";
  ctx.textAlign="center"; ctx.fillText("🎵 ZONA MUSICAL", mx+mw/2, my-8); ctx.textAlign="left";

  // ── PIANO (96×64 at mx+10, my+20) ──
  const px=mx+12, py=my+20;
  ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(px+4,py+4,96,64);
  ctx.fillStyle="#111118"; ctx.fillRect(px,py,96,64);
  // Lid
  ctx.fillStyle="#222228"; ctx.fillRect(px,py,96,16);
  ctx.fillStyle="rgba(255,255,255,0.06)"; ctx.fillRect(px,py,96,3);
  // White keys (7)
  for (let k=0;k<7;k++) {
    ctx.fillStyle="#F8F8F4"; ctx.fillRect(px+2+k*13,py+18,12,40);
    ctx.strokeStyle="#CCCCCC"; ctx.lineWidth=0.5; ctx.strokeRect(px+2+k*13,py+18,12,40);
  }
  // Black keys (5)
  for (const k of [0,1,3,4,5]) {
    ctx.fillStyle="#111118"; ctx.fillRect(px+2+k*13+8,py+18,8,26);
  }
  // Legs
  ctx.fillStyle="#333"; ctx.fillRect(px+4,py+62,8,14); ctx.fillRect(px+84,py+62,8,14);

  // Piano stool
  ctx.fillStyle="#442200"; ctx.fillRect(px+28,py+68,40,12);
  ctx.fillStyle="#663300"; ctx.fillRect(px+28,py+64,40,6);

  // ── DRUMS (80×80 at mx+150, my+15) ──
  const drx=mx+148, dry=my+15;
  // Bass drum (center)
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(drx+40,dry+60,30,10,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#CC2020"; ctx.beginPath(); ctx.ellipse(drx+40,dry+40,34,22,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#DD3030"; ctx.beginPath(); ctx.ellipse(drx+40,dry+38,30,18,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#AA1010"; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(drx+40,dry+40,34,22,0,0,Math.PI*2); ctx.stroke();
  // Snare drum (left)
  ctx.fillStyle="#C0A820"; ctx.beginPath(); ctx.ellipse(drx+10,dry+52,16,8,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#A08810"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(drx+10,dry+52,16,8,0,0,Math.PI*2); ctx.stroke();
  // Tom drum (right)
  ctx.fillStyle="#2040CC"; ctx.beginPath(); ctx.ellipse(drx+70,dry+48,14,7,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#1830AA"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(drx+70,dry+48,14,7,0,0,Math.PI*2); ctx.stroke();
  // Hi-hat
  ctx.fillStyle="#C0A820"; ctx.beginPath(); ctx.ellipse(drx+12,dry+22,18,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#D0B830"; ctx.beginPath(); ctx.ellipse(drx+12,dry+20,16,3,0,0,Math.PI*2); ctx.fill();
  // Cymbal stand
  ctx.strokeStyle="#888"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(drx+12,dry+22); ctx.lineTo(drx+8,dry+72); ctx.stroke();
  // Drumsticks
  ctx.strokeStyle="#8B6038"; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(drx+35,dry+10); ctx.lineTo(drx+48,dry+36); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(drx+50,dry+8);  ctx.lineTo(drx+42,dry+34); ctx.stroke();

  // ── MUSIC STANDS (2) ──
  for (const [sx,sy] of [[mx+18,my+110],[mx+80,my+105]]) {
    ctx.fillStyle="#666677"; ctx.fillRect(sx,sy+16,3,50); ctx.fillRect(sx-8,sy+64,18,3);
    ctx.fillStyle="#F0F0F0"; ctx.fillRect(sx-10,sy,22,30);
    ctx.fillStyle="#333"; ctx.font="6px monospace";
    ctx.fillText("♪♫♬",sx-8,sy+12); ctx.fillText("♩♪♫",sx-8,sy+20);
  }

  // ── SPEAKERS (2, 48×64) ──
  _speaker(ctx, mx+260, my+18,  false);
  _speaker(ctx, mx+260, my+105, false);

  // ── MICROPHONE ──
  const micx=mx+200, micy=my+100;
  ctx.fillStyle="#444455"; ctx.fillRect(micx-3,micy,6,30);
  ctx.fillStyle="#333344"; ctx.fillRect(micx-10,micy+28,20,4);
  ctx.fillStyle="#666677"; ctx.beginPath(); ctx.ellipse(micx,micy,8,12,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#4444AA"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(micx,micy,8,12,0,0,Math.PI*2); ctx.stroke();
  // Mic grill
  ctx.fillStyle="rgba(0,0,0,0.3)";
  for (let i=0;i<4;i++) ctx.fillRect(micx-6,micy-8+i*4,12,2);

  // ── AREA RUG PATTERN ──
  ctx.strokeStyle="rgba(180,100,220,0.3)"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
  for (let r=1;r<4;r++) {
    ctx.strokeRect(mx+r*8,my+r*8,mw-r*16,mh-r*16);
  }
  ctx.setLineDash([]);
}

function _speaker(ctx, x, y) {
  const sw=48, sh=64;
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+3,y+3,sw,sh);
  ctx.fillStyle="#1A1A22"; ctx.fillRect(x,y,sw,sh);
  // Grill
  ctx.fillStyle="#2A2A33"; ctx.fillRect(x+4,y+4,sw-8,sh-8);
  ctx.fillStyle="rgba(255,255,255,0.04)";
  for (let r=0;r<(sh-8);r+=4) ctx.fillRect(x+4,y+4+r,sw-8,2);
  // Woofer
  ctx.fillStyle="#333344"; ctx.beginPath(); ctx.ellipse(x+sw/2,y+sh*0.65,16,16,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#222"; ctx.beginPath(); ctx.ellipse(x+sw/2,y+sh*0.65,8,8,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#444455"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(x+sw/2,y+sh*0.65,16,16,0,0,Math.PI*2); ctx.stroke();
  // Tweeter
  ctx.fillStyle="#222233"; ctx.beginPath(); ctx.ellipse(x+sw/2,y+14,8,5,0,0,Math.PI*2); ctx.fill();
  // LED
  ctx.fillStyle="#00FF44"; ctx.fillRect(x+4,y+4,5,3);
}

// ── GAMER ZONE ────────────────────────────────────────────────────────────────
function _gamerZone(ctx) {
  const gx=WORLD_W-WR-330, gy=WORLD_H-WB-300, gw=325, gh=272;
  // Zone carpet (dark)
  const zg=ctx.createLinearGradient(gx,gy,gx+gw,gy+gh);
  zg.addColorStop(0,"rgba(10,10,40,0.45)"); zg.addColorStop(1,"rgba(20,20,60,0.35)");
  ctx.fillStyle=zg; ctx.fillRect(gx,gy,gw,gh);
  ctx.strokeStyle="rgba(60,100,200,0.55)"; ctx.lineWidth=2; ctx.strokeRect(gx,gy,gw,gh);
  ctx.strokeStyle="rgba(80,120,220,0.25)"; ctx.lineWidth=1; ctx.strokeRect(gx+4,gy+4,gw-8,gh-8);

  // Zone label
  ctx.fillStyle="rgba(140,180,255,0.7)"; ctx.font="bold 10px monospace";
  ctx.textAlign="center"; ctx.fillText("🎮 ZONA GAMER", gx+gw/2, gy-8); ctx.textAlign="left";

  // ── ARCADE MACHINE (48×80) ──
  const ax=gx+16, ay=gy+20;
  ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(ax+4,ay+4,48,80);
  ctx.fillStyle="#111128"; ctx.fillRect(ax,ay,48,80);
  // Screen
  const ag=ctx.createLinearGradient(ax+6,ay+10,ax+6,ay+46);
  ag.addColorStop(0,"#0A0A40"); ag.addColorStop(0.5,"#202060"); ag.addColorStop(1,"#0A0A40");
  ctx.fillStyle=ag; ctx.fillRect(ax+6,ay+10,36,36);
  // Pixel art on screen
  ctx.fillStyle="#FF004D";
  ctx.fillRect(ax+18,ay+16,4,4); ctx.fillRect(ax+26,ay+16,4,4);
  ctx.fillStyle="#FFEC27";
  ctx.fillRect(ax+14,ay+28,20,4); ctx.fillRect(ax+22,ay+22,4,8);
  // Screen glow
  ctx.fillStyle="rgba(40,40,200,0.15)"; ctx.fillRect(ax+2,ay+6,44,44);
  // Controls
  ctx.fillStyle="#222"; ctx.fillRect(ax+4,ay+52,40,24);
  ctx.fillStyle="#FF004D"; ctx.beginPath(); ctx.arc(ax+14,ay+66,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#00E436"; ctx.beginPath(); ctx.arc(ax+28,ay+60,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#29ADFF"; ctx.beginPath(); ctx.arc(ax+36,ay+66,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#FFA300"; ctx.beginPath(); ctx.arc(ax+28,ay+70,4,0,Math.PI*2); ctx.fill();
  // Joystick
  ctx.fillStyle="#333"; ctx.beginPath(); ctx.arc(ax+14,ay+60,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#555"; ctx.beginPath(); ctx.arc(ax+14,ay+58,4,0,Math.PI*2); ctx.fill();

  // ── TV (80×64) ──
  const tx=gx+80, ty=gy+22;
  ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(tx+4,ty+4,80,64);
  ctx.fillStyle="#0A0A18"; ctx.fillRect(tx,ty,80,64);
  // Screen
  const tsg=ctx.createLinearGradient(tx+4,ty+4,tx+4,ty+56);
  tsg.addColorStop(0,"#0818A8"); tsg.addColorStop(0.5,"#1028CC"); tsg.addColorStop(1,"#0818A8");
  ctx.fillStyle=tsg; ctx.fillRect(tx+4,ty+4,72,52);
  // Game scene on TV
  ctx.fillStyle="#00E436"; ctx.fillRect(tx+10,ty+44,72-12,4); // ground
  ctx.fillStyle="#FF004D"; ctx.fillRect(tx+30,ty+30,10,14); // player
  ctx.fillStyle="#FF004D"; ctx.fillRect(tx+28,ty+24,14,8); // head
  ctx.fillStyle="#FFEC27"; ctx.beginPath(); ctx.arc(tx+55,ty+15,8,0,Math.PI*2); ctx.fill(); // coin
  // Scanlines
  ctx.fillStyle="rgba(0,0,0,0.07)";
  for (let s=0;s<52;s+=2) ctx.fillRect(tx+4,ty+4+s,72,1);
  // TV stand
  ctx.fillStyle="#222"; ctx.fillRect(tx+34,ty+60,12,10); ctx.fillRect(tx+26,ty+68,28,4);
  // TV border glow
  ctx.shadowColor="#2050FF"; ctx.shadowBlur=8;
  ctx.strokeStyle="#2050FF"; ctx.lineWidth=1; ctx.strokeRect(tx+4,ty+4,72,52);
  ctx.shadowBlur=0;

  // ── CONSOLE (32×24) ──
  const cx2=gx+86, cy2=gy+102;
  ctx.fillStyle="#111120"; ctx.fillRect(cx2,cy2,80,24);
  ctx.fillStyle="#1A1A30"; ctx.fillRect(cx2+4,cy2+4,72,16);
  // Disc slot
  ctx.fillStyle="#000"; ctx.fillRect(cx2+20,cy2+10,40,4);
  // Buttons
  ["#FF004D","#00E436","#29ADFF","#FFA300"].forEach((c,i)=>{
    ctx.fillStyle=c; ctx.beginPath(); ctx.arc(cx2+60+i*7,cy2+8,3,0,Math.PI*2); ctx.fill();
  });
  // LED indicator
  ctx.fillStyle="#00FF44"; ctx.beginPath(); ctx.arc(cx2+8,cy2+12,3,0,Math.PI*2); ctx.fill();

  // ── PUFFS (beanbag chairs, 3) ──
  _puff(ctx, gx+18,  gy+120, "#4A2060");
  _puff(ctx, gx+70,  gy+160, "#20406A");
  _puff(ctx, gx+130, gy+120, "#6A2040");

  // Gamer zone neon strips
  ctx.shadowColor="#4060FF"; ctx.shadowBlur=6;
  ctx.fillStyle="rgba(40,60,200,0.3)";
  ctx.fillRect(gx,gy,gw,3); ctx.fillRect(gx,gy+gh-3,gw,3);
  ctx.fillRect(gx,gy,3,gh); ctx.fillRect(gx+gw-3,gy,3,gh);
  ctx.shadowBlur=0;
}

function _puff(ctx, x, y, col) {
  const pw=38, ph=28;
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(x+pw/2+3,y+ph/2+4,pw/2,ph/2,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(x+pw/2,y+ph/2,pw/2,ph/2,0,0,Math.PI*2); ctx.fill();
  // Highlight
  const lg=ctx.createRadialGradient(x+pw*0.35,y+ph*0.3,2,x+pw/2,y+ph/2,pw/2);
  lg.addColorStop(0,"rgba(255,255,255,0.25)"); lg.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=lg; ctx.beginPath(); ctx.ellipse(x+pw/2,y+ph/2,pw/2,ph/2,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,0.2)"; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(x+pw/2,y+ph/2,pw/2,ph/2,0,0,Math.PI*2); ctx.stroke();
}

// ── PLANTS (15) ───────────────────────────────────────────────────────────────
function _plants(ctx) {
  const positions = [
    [WL+60,    WT+62,  1.0 ], // near biblioteca
    [2420,     WT+62,  0.9 ], // top right
    [1250,     200,    0.75], // near teacher desk
    [1500,     195,    0.7 ], // near teacher desk right
    [WL+20,    440,    0.85], // left wall
    [WL+20,    740,    0.9 ], // left wall
    [WL+20,    1100,   0.85], // left wall
    [WL+20,    1400,   0.8 ], // left wall
    [2440,     430,    0.8 ], // right wall
    [2440,     950,    0.85], // right wall
    [900,      1365,   0.75], // sofa area
    [1490,     1365,   0.75], // sofa area
    [370,      WORLD_H-WB-60, 0.9], // music zone entrance
    [2130,     WORLD_H-WB-60, 0.9], // gamer zone entrance
    [1250,     850,    0.65], // between desk groups
  ];
  for (const [cx,cy,sc] of positions) _plant(ctx,cx,cy,sc);
}

function _plant(ctx, cx, cy, s=1) {
  // Pot
  ctx.fillStyle="#CC5522"; ctx.fillRect(cx-10*s, cy+12*s, 20*s, 15*s);
  ctx.fillStyle="#AA3311"; ctx.fillRect(cx-11*s, cy+10*s, 22*s, 5*s);
  ctx.fillStyle="#3A1E08"; ctx.fillRect(cx-9*s,  cy+12*s, 18*s, 6*s);
  // Shadow under pot
  ctx.fillStyle="rgba(0,0,0,0.1)";
  ctx.beginPath(); ctx.ellipse(cx, cy+22*s, 14*s, 4*s, 0, 0, Math.PI*2); ctx.fill();
  // Leaves
  for (const [ox,oy,rx,ry,rot,col] of [
    [0,0,9,14,0,"#28A030"],[-10,4,8,12,-0.25,"#22902A"],[10,4,8,12,0.25,"#1E8028"],
    [-4,-5,6,10,-0.1,"#30B038"],[4,-5,6,10,0.1,"#26A830"],
  ]) {
    ctx.fillStyle=col;
    ctx.beginPath(); ctx.ellipse(cx+ox*s, cy+oy*s, rx*s, ry*s, rot, 0, Math.PI*2); ctx.fill();
  }
  // Dark vein on main leaf
  ctx.strokeStyle="rgba(0,80,0,0.3)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(cx, cy-2*s); ctx.lineTo(cx, cy+10*s); ctx.stroke();
}

// ── CENTER RUG ────────────────────────────────────────────────────────────────
function _rug(ctx) {
  const rx=WORLD_W/2-200, ry=WT+18, rw=400, rh=100;
  ctx.fillStyle="rgba(0,0,0,0.12)"; ctx.fillRect(rx+4,ry+4,rw,rh);
  const rg=ctx.createLinearGradient(rx,ry,rx+rw,ry+rh);
  rg.addColorStop(0,"rgba(60,30,100,0.28)");
  rg.addColorStop(0.5,"rgba(80,40,140,0.35)");
  rg.addColorStop(1,"rgba(60,30,100,0.28)");
  ctx.fillStyle=rg; ctx.fillRect(rx,ry,rw,rh);
  ctx.strokeStyle="rgba(160,100,220,0.5)"; ctx.lineWidth=4; ctx.strokeRect(rx+4,ry+4,rw-8,rh-8);
  ctx.strokeStyle="rgba(200,150,255,0.28)"; ctx.lineWidth=1; ctx.strokeRect(rx+9,ry+9,rw-18,rh-18);
  ctx.fillStyle="rgba(180,120,255,0.2)";
  ctx.beginPath(); ctx.ellipse(rx+rw/2,ry+rh/2,70,30,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(220,180,255,0.4)"; ctx.font="bold 16px monospace";
  ctx.textAlign="center"; ctx.fillText("✨ POCHISCLASS ✨", rx+rw/2, ry+rh/2+6); ctx.textAlign="left";
}

// ── DUST PARTICLES ────────────────────────────────────────────────────────────
function _dustParticles(ctx, now) {
  if (!now) return;
  const t = now / 1000;
  ctx.fillStyle = "rgba(255,220,140,0.12)";
  // 12 floating dust motes near windows
  const winY = [430, 700, 970];
  for (const wy of winY) {
    for (let i=0; i<4; i++) {
      const px = WL + 40 + Math.sin(t*0.8+i*2.1)*180 + i*60;
      const py = wy - 30 + Math.cos(t*0.6+i*1.7)*20;
      const r = 1.5 + Math.sin(t+i)*0.8;
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2); ctx.fill();
    }
  }
}

// ── EXPORTED DRAW HELPERS ─────────────────────────────────────────────────────

export function drawWhiteboardText(ctx, text) {
  const wb=WHITEBOARD;
  ctx.fillStyle="#F6F6FA"; ctx.fillRect(wb.x+6,wb.y+6,wb.w-12,wb.h-12);
  if (!text) return;
  ctx.fillStyle="#1A2A4A"; ctx.font="bold 15px monospace";
  const maxW=wb.w-30, lines=[];
  for (const raw of text.split("\n")) {
    const words=raw.split(" "); let line="";
    for (const w of words) {
      const t=line+w+" ";
      if (ctx.measureText(t).width>maxW && line) { lines.push(line.trim()); line=w+" "; }
      else line=t;
    }
    lines.push(line.trim());
  }
  lines.slice(0,4).forEach((l,i)=>ctx.fillText(l, wb.x+16, wb.y+26+i*20));
}

export function drawBulletinTasks(ctx, tasks) {
  const b=BULLETIN;
  ctx.fillStyle="#B87848"; ctx.fillRect(b.x,b.y+20,b.w,b.h-20);
  for (let i=0;i<40;i++) {
    ctx.fillStyle=`rgba(${120+i%30},${80+i%20},${30+i%15},0.2)`;
    ctx.fillRect(b.x+(i*41)%b.w, b.y+20+(i*29)%(b.h-20), 3, 3);
  }
  if (!tasks || !tasks.length) {
    ctx.fillStyle="rgba(80,50,10,0.6)"; ctx.font="9px monospace";
    ctx.textAlign="center"; ctx.fillText("Sin tareas", b.x+b.w/2, b.y+b.h/2+4); ctx.textAlign="left"; return;
  }
  tasks.slice(0,3).forEach((task,i)=>{
    const ty=b.y+26+i*20;
    ctx.fillStyle=task.done?"#D8F0D8":"#FFFDE0";
    ctx.fillRect(b.x+6,ty,b.w-12,16);
    ctx.strokeStyle=task.done?"#80CC80":"#CCBB40"; ctx.lineWidth=0.5;
    ctx.strokeRect(b.x+6,ty,b.w-12,16);
    if (task.done) {
      ctx.strokeStyle="#2A8A2A"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(b.x+10,ty+9); ctx.lineTo(b.x+13,ty+12); ctx.lineTo(b.x+18,ty+5); ctx.stroke();
    } else {
      ctx.strokeStyle="#555"; ctx.lineWidth=1; ctx.strokeRect(b.x+8,ty+3,9,9);
    }
    ctx.fillStyle=task.done?"#4A8A4A":"#3A2A00"; ctx.font=task.done?"8px monospace":"bold 8px monospace";
    ctx.fillText(task.text.slice(0,26), b.x+22, ty+12);
  });
  ctx.textAlign="left";
}

export function drawWorldObjects(ctx, objects) {
  for (const obj of objects) {
    if (obj.heldBy) continue;
    const {x,y,type,color,radius}=obj;
    ctx.fillStyle="rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.ellipse(x+2,y+4,radius,radius*0.45,0,0,Math.PI*2); ctx.fill();
    switch(type) {
      case "basketball":
        ctx.fillStyle="#E87020"; ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#A04010"; ctx.lineWidth=2; ctx.stroke();
        ctx.strokeStyle="#5A2000"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(x-radius,y); ctx.lineTo(x+radius,y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x,y-radius); ctx.lineTo(x,y+radius); ctx.stroke();
        break;
      case "volleyball":
        ctx.fillStyle="#F8F8F4"; ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#AAAAAA"; ctx.lineWidth=1; ctx.stroke();
        ctx.strokeStyle="#3355CC"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(x-radius,y); ctx.lineTo(x+radius,y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x,y-radius); ctx.lineTo(x,y+radius); ctx.stroke();
        break;
      case "football":
        ctx.fillStyle="#1A1A1A"; ctx.beginPath(); ctx.ellipse(x,y,radius*1.2,radius*0.9,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#FFFFFF"; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,y,radius*0.5,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle="#FFFFFF"; ctx.fillRect(x-1,y-radius*0.7,2,radius*1.4);
        break;
      case "marker":
        ctx.fillStyle=color; ctx.fillRect(x-3,y-12,6,20);
        ctx.fillStyle="#222"; ctx.fillRect(x-2,y+8,4,4);
        ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.fillRect(x-2,y-12,3,14);
        break;
      case "saxophone":
        ctx.fillStyle="#D4A020"; ctx.fillRect(x-3,y-14,6,20);
        ctx.beginPath(); ctx.arc(x-3,y+6,6,0,Math.PI); ctx.fill();
        ctx.fillStyle="#AA7A00";
        for (let i=0;i<4;i++) ctx.fillRect(x-3,y-10+i*4,6,2);
        break;
      case "crown":
        ctx.fillStyle="#FFD700";
        ctx.beginPath();
        ctx.moveTo(x-12,y+6); ctx.lineTo(x-12,y-6); ctx.lineTo(x-6,y); ctx.lineTo(x,y-10);
        ctx.lineTo(x+6,y); ctx.lineTo(x+12,y-6); ctx.lineTo(x+12,y+6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle="#AA8800"; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle="#FF2020"; ctx.beginPath(); ctx.arc(x,y-6,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#2020FF"; ctx.beginPath(); ctx.arc(x-7,y,2,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#20AA20"; ctx.beginPath(); ctx.arc(x+7,y,2,0,Math.PI*2); ctx.fill();
        break;
      default:
        ctx.fillStyle=color||"#888"; ctx.beginPath(); ctx.arc(x,y,radius||12,0,Math.PI*2); ctx.fill();
    }
    ctx.strokeStyle="rgba(255,220,60,0.55)"; ctx.lineWidth=1.5; ctx.setLineDash([3,4]);
    ctx.beginPath(); ctx.arc(x,y,(radius||12)+6,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  }
}

export function drawCoins(ctx, coins, now) {
  for (const coin of coins) {
    if (coin.collected) continue;
    const {x,y}=coin;
    const spin=(now/800)%(Math.PI*2);
    const squeeze=Math.abs(Math.cos(spin));
    const bob=Math.sin(now/500)*3;

    ctx.fillStyle="rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(x+1,y+5+bob,9*squeeze+1,4,0,0,Math.PI*2); ctx.fill();

    const cw=Math.max(2,9*squeeze);
    const g=ctx.createLinearGradient(x-cw,y-8+bob,x+cw,y+8+bob);
    g.addColorStop(0,"#E8C020"); g.addColorStop(0.5,"#FFE060"); g.addColorStop(1,"#B89010");
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.ellipse(x,y+bob,cw,9,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="#AA8010"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(x,y+bob,cw,9,0,0,Math.PI*2); ctx.stroke();
    if (squeeze>0.5) {
      ctx.fillStyle="rgba(130,80,0,0.7)";
      ctx.font=`bold ${Math.round(7*squeeze)}px monospace`;
      ctx.textAlign="center"; ctx.fillText("₡",x,y+bob+3); ctx.textAlign="left";
    }
    // Sparkle
    if (squeeze>0.85) {
      ctx.fillStyle="rgba(255,255,180,0.7)";
      for (const [sx,sy] of [[x,y-13+bob],[x+11,y+bob],[x,y+13+bob],[x-11,y+bob]]) {
        ctx.beginPath(); ctx.arc(sx,sy,1.5,0,Math.PI*2); ctx.fill();
      }
    }
  }
}

export function drawBooks(ctx, books) {
  for (const book of books) {
    const {x,y,color,emoji}=book;
    const bw=18, bh=22;
    ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x-bw/2+2,y-bh/2+2,bw,bh);
    ctx.fillStyle=color; ctx.fillRect(x-bw/2,y-bh/2,bw,bh);
    ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(x-bw/2,y-bh/2,3,bh);
    ctx.fillStyle="#F8F4E8"; ctx.fillRect(x+bw/2-2,y-bh/2+1,2,bh-2);
    ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=1; ctx.strokeRect(x-bw/2,y-bh/2,bw,bh);
    ctx.font="9px serif"; ctx.textAlign="center"; ctx.fillText(emoji,x+1,y+3); ctx.textAlign="left";
    ctx.strokeStyle="rgba(255,200,100,0.55)"; ctx.lineWidth=1.5; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.arc(x,y,18,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  }
}

export function drawPlanes(ctx, planes) {
  for (const plane of planes) {
    const {x,y,vx,vy,age,maxAge}=plane;
    const opacity=Math.max(0,1-age/maxAge);
    const angle=Math.atan2(vy,vx);
    ctx.save(); ctx.globalAlpha=opacity; ctx.translate(x,y); ctx.rotate(angle);
    ctx.fillStyle="#F4F4F0"; ctx.strokeStyle="#AAAAAA"; ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(14,0); ctx.lineTo(-8,-7); ctx.lineTo(-4,0); ctx.lineTo(-8,7); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4,0); ctx.lineTo(14,0); ctx.stroke();
    ctx.restore();
  }
}
