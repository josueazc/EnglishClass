// ──────────────────────────────────────────────────────────────────────────────
// PochisClass — Pixel-art characters
// Habbo / Gather / Pony Town avatar style  ·  16×24 virtual grid
// Every character has unique visuals: scale, glasses, extras, eye colour
// ──────────────────────────────────────────────────────────────────────────────

export const C = {
  LIGHT : "#F5C9A0", MEDIUM : "#D4956A", DARK  : "#8B5E3C", ASIAN : "#F0D4A8",
  BLACK : "#1A1020", BROWN  : "#6B3F2A", BLONDE: "#D8C050", ORANGE_BROWN: "#C86028",
  SHIRT_GREEN: "#4CBF78", COLLAR_PINK: "#F084A8",
  PANTS_BLACK: "#1E1E2E", SHOES_BLACK: "#0A0A14",
  WHITE: "#FFFFFF", GRAY: "#888", GOLD: "#D4A020", SILVER: "#AAAAAA",
  ORANGE: "#E87020", BLUE: "#3355CC", RED: "#CC3333",
};

function _shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.min(255, Math.max(0, Math.round(c * (1 - amt))));
  return `rgb(${f((n>>16)&255)},${f((n>>8)&255)},${f(n&255)})`;
}
function rr(ctx, bx, by, s, col, row, w, h, color) {
  if (!color || w <= 0 || h <= 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(bx + col*s, by + row*s, w*s, h*s);
}

// ── HAIR ──────────────────────────────────────────────────────────────────────
function _hair(ctx, bx, by, s, hairColor, hairStyle, back) {
  const r = (c, ro, w, h) => rr(ctx, bx, by, s, c, ro, w, h, hairColor);
  const rHL = (c, ro, w, h) => rr(ctx, bx, by, s, c, ro, w, h, _shade(hairColor, -0.3));

  if (back) {
    // ── BACK VIEW ──
    switch (hairStyle) {
      case "afro":
        r(0,0,16,13); break;
      case "long":
        r(2,0,12,4); r(1,3,14,3); r(1,5,2,9); r(13,5,2,9); r(2,7,12,7); break;
      case "curly":
        r(0,0,16,5); r(0,4,3,8); r(13,4,3,8); r(2,5,12,8); break;
      default:
        r(2,0,12,4); r(1,3,14,3); r(1,5,2,7); r(13,5,2,7); r(3,6,10,6); break;
    }
    return;
  }

  // ── FRONT VIEW — hair covers forehead to row 5 ──
  switch (hairStyle) {
    case "afro":
      // Wide puffy afro, bangs come down to row 5
      r(0,0,16,6); r(0,5,3,9); r(13,5,3,9); r(1,4,14,4);
      r(0,1,4,4); r(12,1,4,4); // volume bumps at sides
      rHL(2,0,12,2); break;
    case "long":
      // Bangs sweep across forehead to row 5, long sides to row 13
      r(1,0,14,5); r(1,4,14,2); r(1,5,2,9); r(13,5,2,9);
      rHL(3,0,10,2); break;
    case "curly":
      // Voluminous curls, bangs to row 5
      r(0,0,16,6); r(0,5,3,8); r(13,5,3,8);
      r(1,5,3,5); r(12,5,3,5); r(0,2,4,5); r(12,2,4,5);
      rHL(3,0,10,2); break;
    case "shaved":
      // Buzzcut — intentionally shows more forehead (starts at row 2)
      r(2,0,12,3); r(1,1,14,3); r(1,3,1,2); r(14,3,1,2);
      rHL(4,0,8,1); break;
    default: // straight/short — bangs cover to row 5
      r(1,0,14,5); r(1,4,14,2); r(1,5,2,7); r(13,5,2,7);
      rHL(3,0,10,2); break;
  }
}

// ── GLASSES ───────────────────────────────────────────────────────────────────
function _glasses(ctx, bx, by, s, style) {
  ctx.save();
  switch (style) {
    case "round": {
      // Harry Potter–style round frames ♡
      ctx.strokeStyle = "#2A2035"; ctx.lineWidth = Math.max(1, s*0.7);
      ctx.fillStyle   = "rgba(120,160,220,0.14)";
      ctx.beginPath(); ctx.arc(bx+6*s, by+7.5*s, 2.8*s, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx+11*s, by+7.5*s, 2.8*s, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx+8.8*s, by+7.5*s); ctx.lineTo(bx+9.2*s, by+7.5*s); ctx.stroke();
      break;
    }
    case "heart": {
      // Cute heart-shaped glasses (Pochis)
      ctx.strokeStyle = "#AA2060"; ctx.lineWidth = Math.max(1, s*0.65);
      ctx.fillStyle = "rgba(240,100,140,0.15)";
      [6, 11].forEach(cx => {
        ctx.beginPath();
        ctx.moveTo(bx+cx*s, by+7*s);
        ctx.bezierCurveTo(bx+(cx-2.5)*s, by+5.5*s, bx+(cx-3.5)*s, by+8.5*s, bx+cx*s, by+10*s);
        ctx.bezierCurveTo(bx+(cx+3.5)*s, by+8.5*s, bx+(cx+2.5)*s, by+5.5*s, bx+cx*s, by+7*s);
        ctx.fill(); ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(bx+8.5*s, by+8*s); ctx.lineTo(bx+9.5*s, by+8*s); ctx.stroke();
      break;
    }
    case "aviator": {
      // Cool teardrop aviator frames
      ctx.strokeStyle = "#604820"; ctx.lineWidth = Math.max(1, s*0.7);
      ctx.fillStyle = "rgba(180,140,80,0.18)";
      [[5,8],[10.5,8]].forEach(([cx,cy]) => {
        ctx.beginPath();
        ctx.moveTo(bx+(cx-1.5)*s, by+(cy-2)*s);
        ctx.bezierCurveTo(bx+(cx-3)*s, by+(cy-2)*s, bx+(cx-3.2)*s, by+(cy+2)*s, bx+cx*s, by+(cy+2.2)*s);
        ctx.bezierCurveTo(bx+(cx+3.2)*s, by+(cy+2)*s, bx+(cx+3)*s, by+(cy-2)*s, bx+(cx+1.5)*s, by+(cy-2)*s);
        ctx.fill(); ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(bx+8*s, by+7.5*s); ctx.lineTo(bx+9*s, by+7.5*s); ctx.stroke();
      break;
    }
    case "small": {
      // Small narrow (hipster)
      ctx.strokeStyle = "#2A3050"; ctx.lineWidth = Math.max(1, s*0.55);
      ctx.fillStyle = "rgba(80,120,200,0.1)";
      ctx.fillRect(bx+4*s, by+7.2*s, 3.5*s, 1.8*s);
      ctx.fillRect(bx+9*s, by+7.2*s, 3.5*s, 1.8*s);
      ctx.strokeRect(bx+4*s, by+7.2*s, 3.5*s, 1.8*s);
      ctx.strokeRect(bx+9*s, by+7.2*s, 3.5*s, 1.8*s);
      ctx.beginPath(); ctx.moveTo(bx+7.5*s, by+8*s); ctx.lineTo(bx+9*s, by+8*s); ctx.stroke();
      break;
    }
    case "tinted": {
      // Tinted cool-guy shades
      ctx.fillStyle = "rgba(20,60,20,0.45)";
      ctx.fillRect(bx+4*s, by+6.5*s, 4*s, 3*s);
      ctx.fillRect(bx+9*s, by+6.5*s, 4*s, 3*s);
      ctx.strokeStyle = "#1A2A1A"; ctx.lineWidth = Math.max(1, s*0.65);
      ctx.strokeRect(bx+4*s, by+6.5*s, 4*s, 3*s);
      ctx.strokeRect(bx+9*s, by+6.5*s, 4*s, 3*s);
      ctx.beginPath(); ctx.moveTo(bx+8*s, by+8*s); ctx.lineTo(bx+9*s, by+8*s); ctx.stroke();
      break;
    }
    default: { // rectangle
      ctx.strokeStyle = "#2A2035"; ctx.lineWidth = Math.max(1, s*0.65);
      ctx.fillStyle = "rgba(120,160,220,0.12)";
      ctx.fillRect(bx+4.5*s, by+6*s, 4*s, 3*s);
      ctx.fillRect(bx+9*s,   by+6*s, 4*s, 3*s);
      ctx.strokeRect(bx+4.5*s, by+6*s, 4*s, 3*s);
      ctx.strokeRect(bx+9*s,   by+6*s, 4*s, 3*s);
      ctx.beginPath(); ctx.moveTo(bx+8.5*s, by+7.5*s); ctx.lineTo(bx+9*s, by+7.5*s); ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

// ── EXTRAS (earrings, headbands, freckles…) ───────────────────────────────────
function _extras(ctx, bx, by, s, extras = []) {
  extras.forEach(ex => {
    switch (ex) {
      case "earrings":
        ctx.fillStyle = "#FFD700";
        ctx.beginPath(); ctx.arc(bx+1.5*s, by+9*s, 1.8*s, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx+14.5*s, by+9*s, 1.8*s, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#AA8800"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(bx+1.5*s, by+9*s, 1.8*s, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx+14.5*s, by+9*s, 1.8*s, 0, Math.PI*2); ctx.stroke();
        break;
      case "hoop_earrings":
        ctx.strokeStyle = "#FFD700"; ctx.lineWidth = Math.max(1, s*0.55);
        ctx.beginPath(); ctx.arc(bx+1.5*s, by+9.5*s, 2.8*s, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx+14.5*s, by+9.5*s, 2.8*s, 0, Math.PI*2); ctx.stroke();
        break;
      case "headband":
        ctx.fillStyle = "#FF4488";
        ctx.fillRect(bx+2*s, by+4.5*s, 12*s, 2.5*s);
        ctx.fillStyle = "rgba(255,120,170,0.5)";
        ctx.fillRect(bx+2*s, by+4.5*s, 12*s, s);
        // Bow
        ctx.fillStyle = "#FF2266";
        ctx.fillRect(bx+12*s, by+3.5*s, 4*s, 2*s);
        ctx.fillRect(bx+14*s, by+4*s, 2*s, s);
        break;
      case "orange_headband":
        ctx.fillStyle = "#E87020";
        ctx.fillRect(bx+2*s, by+4.5*s, 12*s, 2.5*s);
        ctx.fillStyle = "rgba(255,160,60,0.5)";
        ctx.fillRect(bx+2*s, by+4.5*s, 12*s, s);
        break;
      case "freckles":
        ctx.fillStyle = "rgba(160,90,50,0.45)";
        [[4.5,8],[5.5,7.2],[6.2,8.8],[9.8,7.2],[10.5,8],[11.5,8.8]].forEach(([fc, fr]) => {
          ctx.beginPath(); ctx.arc(bx+fc*s, by+fr*s, 0.55*s, 0, Math.PI*2); ctx.fill();
        });
        break;
      case "stubble":
        ctx.fillStyle = "rgba(20,15,25,0.32)";
        ctx.fillRect(bx+3*s, by+10*s, 10*s, 3*s);
        ctx.fillStyle = "rgba(30,20,35,0.18)";
        for (let i = 0; i < 9; i++) ctx.fillRect(bx+(3+i*1.1)*s, by+10.5*s, 0.7*s, 0.7*s);
        break;
      case "bun":
        ctx.fillStyle = C.BLACK;
        ctx.beginPath(); ctx.arc(bx+8*s, by+1.5*s, 3.5*s, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = _shade(C.BLACK, -0.4);
        ctx.beginPath(); ctx.arc(bx+7*s, by+1*s, 1.5*s, 0, Math.PI*2); ctx.fill();
        // Hairpin
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(bx+9*s, by+0.5*s, s, 3*s);
        break;
      case "blue_streak":
        // Blue dyed streak in hair
        ctx.fillStyle = "#4488FF";
        ctx.fillRect(bx+10*s, by+0.5*s, 2*s, 6*s);
        break;
    }
  });
}

// ── FRONT HEAD ────────────────────────────────────────────────────────────────
function _frontHead(ctx, bx, by, s, cfg) {
  const { skin, hairColor, hairStyle, hasGlasses, glassStyle, extras, eyeStyle, eyeColor } = cfg;
  const r = (c, ro, w, h, col) => rr(ctx, bx, by, s, c, ro, w, h, col);

  _hair(ctx, bx, by, s, hairColor, hairStyle, false);

  // Face — starts at row 5 (hair covers the forehead above)
  // Shaved style shows more forehead intentionally (starts at row 3)
  const faceRow = hairStyle === "shaved" ? 3 : 5;
  r(2, faceRow, 12, 14 - faceRow, skin);          // main face area
  r(3, faceRow - 1, 10, 1, skin);                  // top-of-face curve
  r(3, 14, 10, 1, skin);                            // chin curve
  r(1, faceRow + 2, 1, 3, skin);                    // left ear
  r(14, faceRow + 2, 1, 3, skin);                   // right ear

  // Extras over hair (headband, earrings, etc.)
  _extras(ctx, bx, by, s, extras);

  // Glasses (positioned relative to eye row)
  if (hasGlasses) _glasses(ctx, bx, by, s, glassStyle || "rectangle");

  // Eyes — positioned 2 rows below hairline
  const eyeRow = faceRow + 2;
  if (eyeColor) {
    ctx.fillStyle = eyeColor;
    ctx.fillRect(bx+4*s, by+eyeRow*s, 2*s, 2*s);
    ctx.fillRect(bx+9*s, by+eyeRow*s, 2*s, 2*s);
  }
  if (eyeStyle === "almond") {
    r(4, eyeRow,   3, 1, "#241820"); r(9, eyeRow,   3, 1, "#241820");
    r(4, eyeRow+1, 2, 1, "#241820"); r(9, eyeRow+1, 2, 1, "#241820");
  } else if (eyeStyle === "wide") {
    r(4, eyeRow,   2, 3, "#241820"); r(9, eyeRow,   2, 3, "#241820");
  } else {
    r(4, eyeRow, 2, 2, "#241820");   r(9, eyeRow, 2, 2, "#241820");
  }
  // Eye shine
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillRect(bx+4*s, by+eyeRow*s, s*0.6, s*0.6);
  ctx.fillRect(bx+9*s, by+eyeRow*s, s*0.6, s*0.6);

  // Mouth (4 rows below eyes)
  r(6, eyeRow + 4, 4, 1, "#CC3322");

  // NECK
  r(5, 14, 6, 2, skin);
  r(5, 14, 6, 1, _shade(skin, -0.15));
}

// ── BACK HEAD ─────────────────────────────────────────────────────────────────
function _backHead(ctx, bx, by, s, cfg) {
  const { skin, hairColor, hairStyle } = cfg;
  _hair(ctx, bx, by, s, hairColor, hairStyle, true);
  rr(ctx, bx, by, s, 1,  7, 1, 3, skin);
  rr(ctx, bx, by, s, 14, 7, 1, 3, skin);
  rr(ctx, bx, by, s, 5,  14, 6, 2, skin);
}

// ── FULL CHARACTER ─────────────────────────────────────────────────────────────
export function drawCharacter(ctx, char, cx, cy, scale, facing, walkCycle, sitting) {
  const cfg      = char.config;
  const s        = cfg.charScale || scale;
  const shirt    = cfg.shirtOverride || C.SHIRT_GREEN;
  const shirtHL  = _shade(shirt, -0.28);
  const shirtSH  = _shade(shirt, 0.3);
  const facingLeft = facing === "left";
  const facingUp   = facing === "up";

  const wPhase = sitting ? 0 : Math.sin(walkCycle * Math.PI / 2);
  const leg    = Math.round(wPhase * 2);
  const arm    = Math.round(wPhase * 1.2);
  const bob    = sitting ? 0 : Math.abs(Math.round(wPhase * 1.5));

  const bx = Math.round(cx - 8*s);
  const by = Math.round(cy - 24*s) - bob;

  ctx.save();
  if (facingLeft) { ctx.translate(Math.round(cx)*2, 0); ctx.scale(-1,1); }

  const r = (c, ro, w, h, col) => rr(ctx, bx, by, s, c, ro, w, h, col);

  // ── SHOES ──
  if (sitting) {
    r(3,21,4,2,C.SHOES_BLACK); r(9,21,4,2,C.SHOES_BLACK);
  } else {
    ctx.fillStyle = C.SHOES_BLACK;
    ctx.fillRect(bx+2*s, by+(22-leg)*s, 5*s, 2*s);
    ctx.fillRect(bx+9*s, by+(22+leg)*s, 5*s, 2*s);
  }
  // ── PANTS ──
  if (sitting) {
    r(3,18,5,4,C.PANTS_BLACK); r(9,18,5,4,C.PANTS_BLACK);
  } else {
    ctx.fillStyle = C.PANTS_BLACK;
    ctx.fillRect(bx+3*s, by+(18-leg)*s, 4*s, 5*s);
    ctx.fillRect(bx+9*s, by+(18+leg)*s, 4*s, 5*s);
  }
  // ── TORSO ──
  r(3,16,10,4,shirt);
  r(6,16,4,3,shirtHL); // chest highlight strip
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillRect(bx+7*s, by+16*s, 2*s, 3*s); // white centre line
  r(3,16,2,4,shirtSH); r(11,16,2,4,shirtSH); // side shadows
  r(3,20,10,1,shirtSH); // belt shadow
  if (!facingUp) {
    r(5,16,6,1,C.COLLAR_PINK);
    r(6,17,4,1,_shade(C.COLLAR_PINK,0.22));
  }
  // ── ARMS ──
  if (sitting) {
    r(0,16,3,4,shirt); r(13,16,3,4,shirt);
    r(0,16,3,1,shirtHL); r(13,16,3,1,shirtHL);
    r(0,19,3,1,cfg.skin); r(13,19,3,1,cfg.skin);
  } else {
    ctx.fillStyle = shirt;
    ctx.fillRect(bx,       by+(16+arm)*s, 3*s, 4*s);
    ctx.fillStyle = cfg.skin;
    ctx.fillRect(bx,       by+(19+arm)*s, 3*s, s);
    ctx.fillStyle = shirt;
    ctx.fillRect(bx+13*s,  by+(16-arm)*s, 3*s, 4*s);
    ctx.fillStyle = cfg.skin;
    ctx.fillRect(bx+13*s,  by+(19-arm)*s, 3*s, s);
  }
  // ── HEAD ──
  if (facingUp) _backHead(ctx, bx, by, s, cfg);
  else          _frontHead(ctx, bx, by, s, cfg);

  ctx.restore();
}

// ── LOBBY FACE ────────────────────────────────────────────────────────────────
export function drawFace(ctx, char, x, y, scale) {
  _frontHead(ctx, x, y, scale, char.config);
}

// ── ACCESSORIES ───────────────────────────────────────────────────────────────
export function drawAccessory(ctx, acc, x, y, scale) {
  const s = scale;
  ctx.save();
  switch (acc) {
    case "marimba":
      ctx.fillStyle = C.GOLD;
      ctx.fillRect(x-6*s, y+14*s, 18*s, 4*s);
      ctx.fillStyle = "#6B3F2A";
      for (let i=0;i<5;i++) ctx.fillRect(x-4*s+i*3*s, y+14*s, 2*s, 5*s);
      break;
    case "flute":
      ctx.fillStyle = C.SILVER;
      ctx.fillRect(x+7*s, y+10*s, 2*s, 12*s);
      ctx.fillStyle = "#CCCCCC";
      for (let i=0;i<3;i++) ctx.fillRect(x+7.5*s, y+(12+i*3)*s, s, s);
      break;
    case "basketball":
      ctx.fillStyle = C.ORANGE;
      ctx.beginPath(); ctx.arc(x+14*s,y+14*s,5*s,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#5A2000"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+9*s,y+14*s); ctx.lineTo(x+19*s,y+14*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+14*s,y+9*s); ctx.lineTo(x+14*s,y+19*s); ctx.stroke();
      break;
    case "beer":
      ctx.fillStyle="#C8A020"; ctx.fillRect(x+11*s,y+11*s,4*s,9*s);
      ctx.fillStyle="#884400"; ctx.fillRect(x+11*s,y+11*s,4*s,3*s);
      ctx.fillStyle="rgba(255,255,200,0.4)"; ctx.fillRect(x+12*s,y+12*s,s,7*s);
      break;
    case "saxophone":
      ctx.fillStyle=C.GOLD; ctx.fillRect(x+12*s,y+9*s,3*s,13*s);
      ctx.beginPath(); ctx.arc(x+10*s,y+22*s,4*s,0,Math.PI); ctx.fill();
      ctx.fillStyle="#AA7A00";
      for (let i=0;i<4;i++) ctx.fillRect(x+12*s,y+(11+i*2)*s,3*s,s);
      break;
    case "colorguard":
      ctx.fillStyle="#CC2222"; ctx.fillRect(x+12*s,y+5*s,2*s,17*s);
      ctx.fillStyle="#EE4444"; ctx.fillRect(x+14*s,y+5*s,7*s,9*s);
      ctx.fillStyle=C.WHITE; ctx.fillRect(x+14*s,y+9*s,7*s,4*s);
      break;
    case "volleyball":
      ctx.fillStyle="#F0F0F0";
      ctx.beginPath(); ctx.arc(x+14*s,y+14*s,5*s,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#3355CC"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+9*s,y+14*s); ctx.lineTo(x+19*s,y+14*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+14*s,y+9*s); ctx.lineTo(x+14*s,y+19*s); ctx.stroke();
      break;
    case "helmet":
      ctx.fillStyle="#444455";
      ctx.beginPath(); ctx.arc(x+8*s,y+2*s,7*s,Math.PI,0); ctx.fill();
      ctx.fillRect(x+1*s,y+2*s,14*s,5*s);
      ctx.fillStyle="#888899"; ctx.fillRect(x+2*s,y+3*s,4*s,3*s); ctx.fillRect(x+10*s,y+3*s,4*s,3*s);
      break;
    case "football":
      ctx.fillStyle="#8B4513";
      ctx.beginPath(); ctx.ellipse(x+14*s,y+14*s,6*s,4*s,0.3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=C.WHITE; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+9*s,y+14*s); ctx.lineTo(x+19*s,y+14*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+14*s,y+10*s); ctx.lineTo(x+14*s,y+18*s); ctx.stroke();
      break;
  }
  ctx.restore();
}

// ── CHARACTER DEFINITIONS ─────────────────────────────────────────────────────
// charScale: overrides SCALE for this character (3=normal, 3.5=tall, 2.6=small)
// glassStyle: "rectangle"|"round"|"heart"|"aviator"|"small"|"tinted"
// eyeColor: coloured iris (optional)
// eyeStyle: "normal"|"almond"|"wide"
// extras: ["earrings"|"hoop_earrings"|"headband"|"orange_headband"|"freckles"|"stubble"|"bun"|"blue_streak"]
export const CHARACTERS = {
  sofia_garro: {
    name: "Sofía Garro",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.BLACK,        hairStyle:"curly",
              extras:["earrings"] },
    accessory:null,    color:"#4CBF78"
  },
  maria_jesus: {
    name: "María Jesús",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLACK,        hairStyle:"straight",
              hasGlasses:true, glassStyle:"round" },
    accessory:null,      color:"#4CBF78"
  },
  ariel_angulo: {
    name: "Ariel Angulo",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLONDE,       hairStyle:"shaved",
              hasGlasses:true, glassStyle:"aviator" },
    accessory:null,      color:"#4CBF78"
  },
  brandon_mcintosh: {
    name: "Brandon McIntosh",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.BLACK,        hairStyle:"afro",
              hasGlasses:true, glassStyle:"rectangle", extras:["stubble"],
              charScale: 3.5 },
    accessory:null, color:"#4CBF78"
  },
  ian_castillo: {
    name: "Ian Castillo",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:"#2A1818",      hairStyle:"shaved",
              extras:["freckles"] },
    accessory:null,       color:"#4CBF78"
  },
  felipe_matamoros: {
    name: "Felipe Matamoros",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLACK,        hairStyle:"straight",
              eyeColor:"#3A65A8", eyeStyle:"wide" },
    accessory:null,         color:"#4CBF78"
  },
  luis_felipe: {
    name: "Luis Felipe",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:"#F0DC50",      hairStyle:"shaved" },
    accessory:null,         color:"#4CBF78"
  },
  xiao_mendez: {
    name: "Xiao Méndez",
    config: { skin:C.ASIAN, skinKey:"ASIAN",  hairColor:C.BLACK,        hairStyle:"straight",
              eyeStyle:"almond" },
    accessory:null,         color:"#4CBF78"
  },
  daniella_fonseca: {
    name: "Daniella Fonseca",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BROWN,        hairStyle:"curly",
              extras:["headband"] },
    accessory:null,  color:"#4CBF78"
  },
  veronica_madriz: {
    name: "Verónica Madriz",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.BLACK,        hairStyle:"straight",
              hasGlasses:true, glassStyle:"small" },
    accessory:null, color:"#4CBF78"
  },
  mariana_gonzales: {
    name: "Mariana Gonzales",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLACK,        hairStyle:"long",
              extras:["blue_streak"] },
    accessory:null, color:"#4CBF78"
  },
  larissa_castro: {
    name: "Larissa Castro",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLACK,        hairStyle:"long",
              hasGlasses:true, glassStyle:"round" },
    accessory:null,  color:"#4CBF78"
  },
  ivan_campos: {
    name: "Iván Campos",
    config: { skin:C.MEDIUM,skinKey:"MEDIUM", hairColor:C.BROWN,        hairStyle:"shaved",
              charScale: 3.2 },
    accessory:null,     color:"#4CBF78"
  },
  francesco_fallas: {
    name: "Francesco Fallas",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:"#8B6038",      hairStyle:"shaved" },
    accessory:null,   color:"#4CBF78"
  },
  sebastian_altamirano: {
    name: "Sebastián Altamirano",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BLACK,        hairStyle:"curly",
              extras:["hoop_earrings"] },
    accessory:null,         color:"#4CBF78"
  },
  jeslie_fernandez: {
    name: "Jeslie Fernández",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.BLACK,        hairStyle:"curly",
              extras:["hoop_earrings"] },
    accessory:null,         color:"#4CBF78"
  },
  maria_belen: {
    name: "María Belén",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BROWN,        hairStyle:"straight",
              charScale: 2.6 },
    accessory:null,         color:"#4CBF78"
  },
  dereck_abarca: {
    name: "Dereck Abarca",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:"#7A5028",      hairStyle:"shaved",
              hasGlasses:true, glassStyle:"rectangle", charScale: 3.5 },
    accessory:null,       color:"#4CBF78"
  },
  josue_azofeifa: {
    name: "Josué Azofeifa",
    config: { skin:C.LIGHT, skinKey:"LIGHT",  hairColor:C.BROWN,        hairStyle:"straight",
              eyeColor:"#3A7A3A" },
    accessory:null,         color:"#4CBF78"
  },
  sofia_diaz: {
    name: "Sofía Díaz",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.ORANGE_BROWN, hairStyle:"curly",
              extras:["orange_headband"] },
    accessory:null,         color:"#4CBF78"
  },
  pochis: {
    name: "Pochis (Profe)",
    config: { skin:C.DARK,  skinKey:"DARK",   hairColor:C.BLACK,        hairStyle:"straight",
              hasGlasses:true, glassStyle:"heart", shirtOverride:"#9955CC",
              extras:["bun"], charScale: 3.6 },
    accessory:null,         color:"#9955CC",  isTeacher:true
  },
};
