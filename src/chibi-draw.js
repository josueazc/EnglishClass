// ──────────────────────────────────────────────────────────────────────────────
// Chibi pixel-art drawing system  ·  16 × 24 virtual grid
// Used by the sprite generator. Optimised for export quality, not frame rate.
// ──────────────────────────────────────────────────────────────────────────────

// ── Colour palette ────────────────────────────────────────────────────────────
export const P = {
  // Skin
  SKIN_LIGHT : "#F5C9A0", SKIN_LIGHT_HL : "#F8DDB8", SKIN_LIGHT_SH : "#D4956A",
  SKIN_MED   : "#D4956A", SKIN_MED_HL   : "#E0AD80", SKIN_MED_SH   : "#A86A3A",
  SKIN_DARK  : "#8B5E3C", SKIN_DARK_HL  : "#A57248", SKIN_DARK_SH  : "#5A3A20",
  SKIN_ASIAN : "#F0D4A8", SKIN_ASIAN_HL : "#F5E0C0", SKIN_ASIAN_SH : "#CCA060",

  // Outline & neutral
  OUTLINE    : "#1A1020",
  SHADOW_UN  : "rgba(0,0,0,0.18)",

  // Uniform
  SHIRT      : "#4A7C5A", SHIRT_HL  : "#5E9870",  SHIRT_SH : "#335444",
  COLLAR     : "#E87FA0", COLLAR_SH : "#C45A7A",
  PANTS      : "#1A1A2E", PANTS_HL  : "#2A2A44",  PANTS_SH : "#0D0D18",
  SHOES      : "#111118", SHOES_HL  : "#222230",

  // Teacher
  TEACHER    : "#8855AA", TEACHER_HL: "#A070CC",  TEACHER_SH: "#5E3580",
  TEACHER_BT : "#663388",

  // Hair colours
  BLACK_H    : "#1A1020", BLACK_H_HL : "#2E2035",
  BROWN_H    : "#6B3F2A", BROWN_H_HL : "#88553A",
  BLONDE_H   : "#D4B24A", BLONDE_H_HL: "#EDD068",
  ORANGE_H   : "#C46A2A", ORANGE_H_HL: "#E08040",
};

// Return shade-map for a given skin key
export function skinPalette(key) {
  switch (key) {
    case "MEDIUM": return [P.SKIN_MED, P.SKIN_MED_HL, P.SKIN_MED_SH];
    case "DARK":   return [P.SKIN_DARK, P.SKIN_DARK_HL, P.SKIN_DARK_SH];
    case "ASIAN":  return [P.SKIN_ASIAN, P.SKIN_ASIAN_HL, P.SKIN_ASIAN_SH];
    default:       return [P.SKIN_LIGHT, P.SKIN_LIGHT_HL, P.SKIN_LIGHT_SH];
  }
}

export function hairPalette(col) {
  const map = {
    "#1A1A1A": [P.BLACK_H,  P.BLACK_H_HL],
    "#6B3F2A": [P.BROWN_H,  P.BROWN_H_HL],
    "#D4B24A": [P.BLONDE_H, P.BLONDE_H_HL],
    "#C46A2A": [P.ORANGE_H, P.ORANGE_H_HL],
  };
  return map[col] || [col, col];
}

// ── Low-level pixel helpers ───────────────────────────────────────────────────
function r(ctx, bx, by, s, col, row, w, h, color) {
  if (!color || w <= 0 || h <= 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(bx + col * s, by + row * s, w * s, h * s);
}

// ── HEAD (front-facing, chibi) ────────────────────────────────────────────────
export function drawChibiHead(ctx, bx, by, s, cfg) {
  const { skinKey, hairColor, hairStyle, hasGlasses } = cfg;
  const [skin, skinHL, skinSH] = skinPalette(skinKey);
  const [hair, hairHL] = hairPalette(hairColor);
  const rc = (c, ro, w, h, col) => r(ctx, bx, by, s, c, ro, w, h, col);

  // ── HAIR ──
  switch (hairStyle) {
    case "afro":
      // Wide afro
      rc(0, 0, 16, 3, hair);
      rc(0, 2, 3, 9, hair); rc(13, 2, 3, 9, hair);
      rc(0, 0, 16, 1, hairHL);
      rc(1, 1, 14, 1, hairHL);
      break;
    case "long":
      rc(3, 0, 10, 2, hair); rc(2, 1, 12, 2, hair);
      rc(2, 2, 2, 11, hair); rc(12, 2, 2, 11, hair);
      rc(4, 0, 8, 1, hairHL);
      break;
    case "curly":
      rc(2, 0, 12, 2, hair); rc(1, 1, 14, 2, hair);
      rc(2, 2, 2, 9, hair);  rc(12, 2, 2, 9, hair);
      rc(1, 3, 2, 5, hair);  rc(13, 3, 2, 5, hair);
      rc(3, 0, 10, 1, hairHL);
      break;
    case "shaved":
      rc(4, 0, 8, 1, hair); rc(3, 1, 10, 1, hair);
      rc(3, 2, 1, 1, hair); rc(12, 2, 1, 1, hair);
      rc(5, 0, 6, 1, hairHL);
      break;
    default: // straight/short
      rc(3, 0, 10, 2, hair); rc(2, 1, 12, 2, hair);
      rc(2, 2, 2, 7, hair);  rc(12, 2, 2, 7, hair);
      rc(4, 0, 8, 1, hairHL);
      break;
  }

  // ── FACE ──
  rc(3, 2, 10, 9, skin);
  // Highlight on forehead
  rc(5, 2, 6, 1, skinHL);
  // Shadow on chin/jaw
  rc(4, 10, 8, 1, skinSH);

  // ── EARS ──
  rc(2, 5, 1, 2, skin); rc(13, 5, 1, 2, skin);
  rc(2, 5, 1, 1, skinHL); rc(13, 5, 1, 1, skinHL);

  // ── EYEBROWS ──
  const brow = hairStyle === "shaved" ? hair : hair;
  rc(5, 3, 2, 1, brow); rc(9, 3, 2, 1, brow);

  // ── GLASSES ──
  if (hasGlasses) {
    ctx.strokeStyle = "#333344";
    ctx.lineWidth = Math.max(1, s * 0.7);
    ctx.strokeRect(bx + 4.5 * s, by + 4 * s, 3.5 * s, 2.5 * s);
    ctx.strokeRect(bx + 8 * s,   by + 4 * s, 3.5 * s, 2.5 * s);
    ctx.beginPath();
    ctx.moveTo(bx + 8 * s, by + 5.2 * s);
    ctx.lineTo(bx + 8 * s, by + 5.2 * s);
    ctx.stroke();
    // Lens tint
    ctx.fillStyle = "rgba(100,150,220,0.12)";
    ctx.fillRect(bx + 4.5 * s, by + 4 * s, 3.5 * s, 2.5 * s);
    ctx.fillRect(bx + 8 * s,   by + 4 * s, 3.5 * s, 2.5 * s);
  }

  // ── EYES (larger, chibi) ──
  // White sclera
  ctx.fillStyle = "#F0F0F8";
  ctx.fillRect(bx + 5 * s, by + 4 * s, 2 * s, 2.5 * s);
  ctx.fillRect(bx + 9 * s, by + 4 * s, 2 * s, 2.5 * s);
  // Iris
  rc(5, 4, 2, 2, "#2244AA"); rc(9, 4, 2, 2, "#2244AA");
  // Pupil
  rc(6, 4, 1, 1, "#080808"); rc(10, 4, 1, 1, "#080808");
  // Shine
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(bx + 5.2 * s, by + 4 * s, s * 0.7, s * 0.7);
  ctx.fillRect(bx + 9.2 * s, by + 4 * s, s * 0.7, s * 0.7);
  // Lower eyelid line
  ctx.fillStyle = skinSH;
  ctx.fillRect(bx + 5 * s, by + 6 * s, 2 * s, s * 0.5);
  ctx.fillRect(bx + 9 * s, by + 6 * s, 2 * s, s * 0.5);

  // ── BLUSH ──
  if (skinKey !== "DARK") {
    ctx.fillStyle = "rgba(220,100,100,0.22)";
    ctx.fillRect(bx + 4 * s, by + 7 * s, 2 * s, s);
    ctx.fillRect(bx + 10 * s, by + 7 * s, 2 * s, s);
  }

  // ── NOSE ──
  rc(7, 7, 2, 1, skinSH);

  // ── MOUTH ──
  rc(6, 8, 4, 1, "#CC3322");
  rc(7, 9, 2, 1, "#AA1A10");
  // Lip highlight
  rc(6, 8, 2, 1, "#EE5544");

  // ── NECK ──
  rc(6, 10, 4, 2, skin);
  rc(6, 10, 4, 1, skinHL);
}

// ── HEAD (back-facing) ────────────────────────────────────────────────────────
export function drawChibiHeadBack(ctx, bx, by, s, cfg) {
  const { skinKey, hairColor, hairStyle } = cfg;
  const [skin, skinHL] = skinPalette(skinKey);
  const [hair, hairHL] = hairPalette(hairColor);
  const rc = (c, ro, w, h, col) => r(ctx, bx, by, s, c, ro, w, h, col);

  switch (hairStyle) {
    case "afro":
      rc(0, 0, 16, 12, hair);
      rc(1, 0, 14, 1, hairHL);
      break;
    case "long":
      rc(2, 0, 12, 3, hair); rc(3, 2, 10, 9, hair);
      rc(2, 3, 2, 9, hair);  rc(12, 3, 2, 9, hair);
      rc(4, 0, 8, 1, hairHL);
      break;
    case "curly":
      rc(1, 0, 14, 3, hair); rc(2, 2, 12, 9, hair);
      rc(1, 4, 2, 6, hair);  rc(13, 4, 2, 6, hair);
      rc(3, 0, 10, 1, hairHL);
      break;
    default:
      rc(2, 0, 12, 3, hair); rc(3, 2, 10, 9, hair);
      rc(2, 3, 2, 7, hair);  rc(12, 3, 2, 7, hair);
      rc(4, 0, 8, 1, hairHL);
      break;
  }
  rc(2, 5, 1, 2, skin); rc(13, 5, 1, 2, skin); // ears
  rc(6, 10, 4, 2, skin); rc(6, 10, 2, 1, skinHL); // nape
}

// ── FULL CHIBI BODY ───────────────────────────────────────────────────────────
export function drawChibiCharacter(ctx, char, cx, cy, s, facing, walkCycle, sitting) {
  const cfg = char.config;
  const isTeacher = !!char.isTeacher;
  const shirt   = isTeacher ? P.TEACHER    : P.SHIRT;
  const shirtHL = isTeacher ? P.TEACHER_HL : P.SHIRT_HL;
  const shirtSH = isTeacher ? P.TEACHER_SH : P.SHIRT_SH;
  const [skin, skinHL, skinSH] = skinPalette(cfg.skinKey);

  const facingLeft = facing === "left";
  const facingUp   = facing === "up";

  // Walk physics
  const wPhase = sitting ? 0 : Math.sin(walkCycle * Math.PI / 2);
  const leg    = Math.round(wPhase * 2.5);
  const arm    = Math.round(wPhase * 1.5);
  const bob    = sitting ? 0 : Math.abs(Math.round(wPhase * 0.8));

  const bx = Math.round(cx - 8 * s);
  const by = Math.round(cy - 24 * s) - bob;

  const rc = (c, ro, w, h, col) => r(ctx, bx, by, s, c, ro, w, h, col);

  ctx.save();
  if (facingLeft) { ctx.translate(Math.round(cx) * 2, 0); ctx.scale(-1, 1); }

  // ── SHOES ──
  if (sitting) {
    rc(3, 20, 4, 2, P.SHOES_HL); rc(9, 20, 4, 2, P.SHOES_HL);
    rc(3, 21, 4, 1, P.SHOES);    rc(9, 21, 4, 1, P.SHOES);
  } else {
    const lRow = 22 - leg, rRow = 22 + leg;
    ctx.fillStyle = P.SHOES_HL;
    ctx.fillRect(bx + 2*s, by + (lRow-1)*s, 6*s, s);
    ctx.fillRect(bx + 9*s, by + (rRow-1)*s, 6*s, s);
    ctx.fillStyle = P.SHOES;
    ctx.fillRect(bx + 2*s, by + lRow*s, 6*s, 2*s);
    ctx.fillRect(bx + 9*s, by + rRow*s, 6*s, 2*s);
  }

  // ── PANTS ──
  if (sitting) {
    rc(3, 17, 5, 3, P.PANTS_HL); rc(9, 17, 5, 3, P.PANTS_HL);
    rc(3, 18, 5, 2, P.PANTS);    rc(9, 18, 5, 2, P.PANTS);
  } else {
    ctx.fillStyle = P.PANTS_HL;
    ctx.fillRect(bx + 3*s, by + (18-leg)*s, 5*s, s);
    ctx.fillRect(bx + 9*s, by + (18+leg)*s, 5*s, s);
    ctx.fillStyle = P.PANTS;
    ctx.fillRect(bx + 3*s, by + (19-leg)*s, 5*s, 4*s);
    ctx.fillRect(bx + 9*s, by + (19+leg)*s, 5*s, 4*s);
  }

  // ── TORSO ──
  // Back panel (darker)
  rc(4, 12, 8, 5, shirtSH);
  // Main shirt
  rc(3, 12, 10, 5, shirt);
  // Highlight on upper chest
  rc(4, 12, 8, 1, shirtHL);
  // Shadow on lower chest / belt
  rc(3, 17, 10, 1, shirtSH);

  // Collar (front only)
  if (!facingUp) {
    rc(5, 12, 6, 1, P.COLLAR);
    rc(6, 13, 4, 1, P.COLLAR_SH);
  }

  // ── ARMS ──
  if (sitting) {
    rc(0, 13, 3, 4, shirt);   rc(13, 13, 3, 4, shirt);
    rc(0, 17, 3, 2, skin);    rc(13, 17, 3, 2, skin);
    rc(0, 13, 3, 1, shirtHL); rc(13, 13, 3, 1, shirtHL);
    rc(0, 17, 3, 1, skinHL);  rc(13, 17, 3, 1, skinHL);
  } else {
    // Left arm
    ctx.fillStyle = shirt;
    ctx.fillRect(bx,       by + (13+arm)*s, 3*s, 4*s);
    ctx.fillStyle = shirtHL;
    ctx.fillRect(bx,       by + (13+arm)*s, 3*s, s);
    ctx.fillStyle = skin;
    ctx.fillRect(bx,       by + (17+arm)*s, 3*s, 2*s);
    ctx.fillStyle = skinHL;
    ctx.fillRect(bx,       by + (17+arm)*s, 3*s, s);
    // Right arm
    ctx.fillStyle = shirt;
    ctx.fillRect(bx + 13*s, by + (13-arm)*s, 3*s, 4*s);
    ctx.fillStyle = shirtHL;
    ctx.fillRect(bx + 13*s, by + (13-arm)*s, 3*s, s);
    ctx.fillStyle = skin;
    ctx.fillRect(bx + 13*s, by + (17-arm)*s, 3*s, 2*s);
    ctx.fillStyle = skinHL;
    ctx.fillRect(bx + 13*s, by + (17-arm)*s, 3*s, s);
  }

  // ── HEAD ──
  if (facingUp) {
    drawChibiHeadBack(ctx, bx, by, s, cfg);
  } else {
    drawChibiHead(ctx, bx, by, s, cfg);
  }

  ctx.restore();
}

// ── OUTLINE POST-PROCESS ──────────────────────────────────────────────────────
// Adds a 1-pixel dark outline around any non-transparent pixel.
// Should be called after drawing to an offscreen canvas.
export function applyOutline(ctx, w, h) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const src     = imgData.data;
  const dst     = new Uint8ClampedArray(src.length);

  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3];
    if (a < 60) {
      // Transparent — check 4-way neighbours
      const x  = (i / 4) % w;
      const y  = Math.floor((i / 4) / w);
      let filled = false;
      if (x > 0     && src[i - 4 + 3] >= 60) filled = true;
      if (x < w - 1 && src[i + 4 + 3] >= 60) filled = true;
      if (y > 0     && src[i - w * 4 + 3] >= 60) filled = true;
      if (y < h - 1 && src[i + w * 4 + 3] >= 60) filled = true;
      if (filled) {
        dst[i] = 20; dst[i+1] = 15; dst[i+2] = 28; dst[i+3] = 255;
      }
    } else {
      dst[i] = src[i]; dst[i+1] = src[i+1];
      dst[i+2] = src[i+2]; dst[i+3] = src[i+3];
    }
  }

  ctx.putImageData(new ImageData(dst, w, h), 0, 0);
}

// ── SHADOW (drop shadow below character) ────────────────────────────────────
export function drawShadow(ctx, cx, cy) {
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}
