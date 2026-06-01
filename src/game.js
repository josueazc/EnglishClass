import { CHARACTERS, drawCharacter } from "./characters.js";
import {
  drawClassroom, drawWhiteboardText, drawBulletinTasks, drawWorldObjects,
  drawCoins, drawBooks, drawPlanes,
  getNearbyDesk, isNearWhiteboard, isNearBulletin, isNearBook,
  clampToBounds, DESKS, WORLD_W, WORLD_H, WHITEBOARD, BULLETIN,
  WORLD_OBJECTS, COIN_DEFS, BOOK_DEFS,
} from "./classroom.js";

const BASE_SCALE   = 3;
const SPEED        = 3.2;
const CAM_LERP     = 0.1;
const CAM_W        = 70;
const CAM_H        = 54;
const JUMP_DUR     = 550;
const COIN_RESPAWN = 25000;

// PICO-8 16-colour palette (perfect 8-bit feel)
export const PICO8 = [
  "#000000","#1D2B53","#7E2553","#008751",
  "#AB5236","#5F574F","#C2C3C7","#FFF1E8",
  "#FF004D","#FFA300","#FFEC27","#00E436",
  "#29ADFF","#83769C","#FF77A8","#FFCCAA",
];

// Whiteboard canvas resolution (pixel art)
const WB_W = 320, WB_H = 180;

export class Game {
  constructor(canvas, charKey, network) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext("2d");
    this.charKey = charKey;
    this.network = network;

    this.myPlayer = {
      id: network?.id || "local",
      character: charKey,
      x: 1250, y: 560,
      facing: "down",
      sitting: false,
      message: "", messageTimer: 0,
      reaction: null, reactionTimer: 0,
      walkCycle: 0,
      heldObject: null,
      jumpTime: 0,
    };

    this.otherPlayers  = new Map();
    this.cam           = { x: 0, y: 0 };
    this.whiteboardText = "";
    this.tasks         = [];
    this.keys          = {};
    this.joystick      = { dx: 0, dy: 0, active: false };
    this.videoStreams   = new Map();
    this.localVideo    = null;
    this.interactCooldown = 0;
    this.chatMode      = false;
    this.chatInput     = null;
    this.taskDialog    = null;
    this.bookDialog    = null;
    this.onTasksChange = null;
    this.onBookUpdate  = null;
    this.onCoinsChange = null;

    // World objects
    this.worldObjects = WORLD_OBJECTS.map(o => ({ ...o, heldBy: null }));

    // Coins
    this.coins   = COIN_DEFS.map(c => ({ ...c, collected: false, respawnIn: 0 }));
    this.myCoins = 0;

    // Books
    this.books = BOOK_DEFS.map(b => ({ ...b, messages: [] }));

    // Whiteboard — pixel art collaborative canvas
    this.wbMode    = false;
    this.wbStrokes = [];     // [{color, size, eraser, points:[{x,y}]}]  x,y ∈ [0,1]
    this.wbCurrent = null;
    this.wbColor   = "#1D2B53";  // PICO-8 dark-blue (default pen)
    this.wbSize    = 4;          // brush size in WB pixels (1 WB pixel = 1/320 of width)
    this.wbTool    = "pen";
    this.wbFsCanvas = null;
    this.wbFsCtx    = null;
    this.wbCursors  = new Map(); // playerId → {x,y, color}
    this._wbCursorThrottle = 0;
    this._wbCursorTimer    = null;

    // Paper planes
    this.planes = [];

    this._bindInput();
  }

  // ── INPUT ──────────────────────────────────────────────────────────────────
  _bindInput() {
    document.addEventListener("keydown", e => {
      this.keys[e.key] = true;
      if (this.wbMode) {
        if (e.key === "Escape") this.exitWbMode();
        return;
      }
      if (e.key === "e" || e.key === "E") this.tryInteract();
      if (e.key === " ")                   this.jump();
      if (e.key === "t" || e.key === "T") this.throwPlane();
      if (e.key === "q" || e.key === "Q") this.toggleEmoteWheel();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "Enter" && !this.chatMode && !this.taskDialog && !this.bookDialog)
        this.openChat();
      if (e.key === "Escape") { this.closeChat(); this.closeTaskDialog(); this.closeBookDialog(); }
      const ri = parseInt(e.key) - 1;
      if (ri >= 0 && ri < 8) this.sendReaction(["👍","❤️","😂","🔥","✋","🎉","🤔","👏"][ri]);
    });
    document.addEventListener("keyup", e => { this.keys[e.key] = false; });
  }

  // ── WHITEBOARD FULL-SCREEN MODE ────────────────────────────────────────────
  enterWbMode() {
    this.wbMode = true;
    const overlay = document.getElementById("wb-overlay");
    const canvas  = document.getElementById("wb-canvas-fs");
    this.wbFsCanvas = canvas;
    this.wbFsCtx    = canvas.getContext("2d");

    canvas.width  = WB_W;
    canvas.height = WB_H;

    // White background
    this.wbFsCtx.fillStyle = "#FFF1E8"; // PICO-8 warm white
    this.wbFsCtx.fillRect(0, 0, WB_W, WB_H);
    this._redrawWbFull();
    overlay.style.display = "flex";

    // Attach pixel-drawing events to the WB canvas
    this._wbHandlers = {
      start: e => { e.preventDefault(); this._wbStart(e); },
      move:  e => { e.preventDefault(); this._wbMove(e);  },
      end:   e => { e.preventDefault(); this._wbEnd(e);   },
    };
    canvas.addEventListener("mousedown",  this._wbHandlers.start);
    canvas.addEventListener("mousemove",  this._wbHandlers.move);
    canvas.addEventListener("mouseup",    this._wbHandlers.end);
    canvas.addEventListener("mouseleave", this._wbHandlers.end);
    canvas.addEventListener("touchstart", this._wbHandlers.start, { passive: false });
    canvas.addEventListener("touchmove",  this._wbHandlers.move,  { passive: false });
    canvas.addEventListener("touchend",   this._wbHandlers.end,   { passive: false });

    // Cursor broadcast every 80ms
    this._wbCursorTimer = setInterval(() => {
      if (this._lastWbPt) this.network?.sendWbCursor(this._lastWbPt.x, this._lastWbPt.y);
    }, 80);
  }

  exitWbMode() {
    this.wbMode = false;
    this.wbCurrent = null;
    document.getElementById("wb-overlay").style.display = "none";
    if (this._wbHandlers && this.wbFsCanvas) {
      const c = this.wbFsCanvas;
      c.removeEventListener("mousedown",  this._wbHandlers.start);
      c.removeEventListener("mousemove",  this._wbHandlers.move);
      c.removeEventListener("mouseup",    this._wbHandlers.end);
      c.removeEventListener("mouseleave", this._wbHandlers.end);
      c.removeEventListener("touchstart", this._wbHandlers.start);
      c.removeEventListener("touchmove",  this._wbHandlers.move);
      c.removeEventListener("touchend",   this._wbHandlers.end);
    }
    clearInterval(this._wbCursorTimer);
    this._wbCursorTimer = null;
    this._lastWbPt = null;
    // Update cursors display
    this._updateCursorDots();
  }

  clearWhiteboard() {
    this.wbStrokes = [];
    if (this.wbFsCtx) {
      this.wbFsCtx.fillStyle = "#FFF1E8";
      this.wbFsCtx.fillRect(0, 0, WB_W, WB_H);
    }
    this.network?.sendClearWhiteboard();
  }

  // WB pixel drawing helpers
  _wbNorm(e) {
    const canvas = this.wbFsCanvas;
    const rect   = canvas.getBoundingClientRect();
    const touch  = e.touches?.[0] ?? e;
    return {
      x: Math.max(0, Math.min(1, (touch.clientX - rect.left)  / rect.width)),
      y: Math.max(0, Math.min(1, (touch.clientY - rect.top)   / rect.height)),
    };
  }

  _wbStart(e) {
    const pt = this._wbNorm(e);
    this._lastWbPt = pt;
    this.wbCurrent = { color: this.wbColor, size: this.wbSize, eraser: this.wbTool === "eraser", points: [pt] };
    this._paintPixels(this.wbFsCtx, [pt], null, this.wbSize, this.wbTool === "eraser" ? "#FFF1E8" : this.wbColor);
  }

  _wbMove(e) {
    if (!this.wbCurrent) return;
    const pt = this._wbNorm(e);
    const prev = this.wbCurrent.points[this.wbCurrent.points.length - 1];
    this.wbCurrent.points.push(pt);
    this._lastWbPt = pt;
    this._paintPixels(this.wbFsCtx, [pt], prev, this.wbSize, this.wbTool === "eraser" ? "#FFF1E8" : this.wbColor);
    if (Date.now() - this._wbCursorThrottle > 50) {
      this.network?.sendWbCursor(pt.x, pt.y);
      this._wbCursorThrottle = Date.now();
    }
  }

  _wbEnd() {
    if (!this.wbCurrent) return;
    if (this.wbCurrent.points.length > 0) {
      this.wbStrokes.push(this.wbCurrent);
      this.network?.sendDrawStroke(this.wbCurrent);
    }
    this.wbCurrent = null;
  }

  // Paint pixel-art squares (snapped to grid) on a given context
  _paintPixels(ctx, newPts, prevPt, sz, color) {
    ctx.fillStyle = color;
    const paint = (px, py) => {
      const gx = Math.floor(px / sz) * sz;
      const gy = Math.floor(py / sz) * sz;
      ctx.fillRect(gx, gy, sz, sz);
    };
    for (const pt of newPts) {
      const px = pt.x * WB_W, py = pt.y * WB_H;
      if (prevPt) {
        const ppx = prevPt.x * WB_W, ppy = prevPt.y * WB_H;
        const steps = Math.ceil(Math.max(Math.abs(px-ppx)/sz, Math.abs(py-ppy)/sz));
        for (let i = 0; i <= steps; i++) {
          const t = steps ? i/steps : 0;
          paint(ppx+(px-ppx)*t, ppy+(py-ppy)*t);
        }
      }
      paint(px, py);
      prevPt = { x: pt.x, y: pt.y };
    }
  }

  _redrawWbFull() {
    const ctx = this.wbFsCtx; if (!ctx) return;
    ctx.fillStyle = "#FFF1E8"; ctx.fillRect(0,0,WB_W,WB_H);
    for (const stroke of this.wbStrokes) {
      const color = stroke.eraser ? "#FFF1E8" : (stroke.color || "#1D2B53");
      let prev = null;
      for (const pt of stroke.points) {
        this._paintPixels(ctx, [pt], prev, stroke.size || 4, color);
        prev = pt;
      }
    }
  }

  // Incoming stroke from network — paint it live
  applyNetworkStroke(stroke) {
    this.wbStrokes.push(stroke);
    if (this.wbMode && this.wbFsCtx) {
      const color = stroke.eraser ? "#FFF1E8" : (stroke.color || "#1D2B53");
      let prev = null;
      for (const pt of stroke.points) {
        this._paintPixels(this.wbFsCtx, [pt], prev, stroke.size || 4, color);
        prev = pt;
      }
    }
  }

  // Update other players' cursor dots in the WB overlay
  updateWbCursor(playerId, x, y) {
    const char  = this.otherPlayers.get(playerId);
    const color = CHARACTERS[char?.character]?.color || "#FF004D";
    this.wbCursors.set(playerId, { x, y, color });
    this._updateCursorDots();
  }

  _updateCursorDots() {
    const container = document.getElementById("wb-cursors");
    if (!container) return;
    container.innerHTML = "";
    for (const [id, c] of this.wbCursors) {
      if (!this.wbMode) continue;
      const char = this.otherPlayers.get(id);
      const name = CHARACTERS[char?.character]?.name?.split(" ")[0] || "?";
      const dot = document.createElement("div");
      dot.style.cssText = `position:absolute;left:${c.x*100}%;top:${c.y*100}%;
        transform:translate(-50%,-50%);pointer-events:none;
        display:flex;flex-direction:column;align-items:center;gap:2px;`;
      dot.innerHTML = `
        <div style="width:10px;height:10px;border-radius:50%;background:${c.color};
          border:2px solid #fff;box-shadow:0 0 6px ${c.color}"></div>
        <div style="font-size:7px;font-family:monospace;color:#fff;
          text-shadow:0 0 3px #000;white-space:nowrap">${name}</div>`;
      container.appendChild(dot);
    }
  }

  // ── JUMP / PLANE / EMOTES ──────────────────────────────────────────────────
  jump() {
    if (this.myPlayer.sitting || this.myPlayer.jumpTime > 0) return;
    this.myPlayer.jumpTime = JUMP_DUR;
    this.network?.sendJump();
  }

  throwPlane() {
    if (this.myPlayer.sitting) return;
    const { x, y, facing } = this.myPlayer;
    const spd = 5;
    const vMap = { down:[0,spd], up:[0,-spd], left:[-spd,0], right:[spd,0] };
    const [vx, vy] = vMap[facing] || [spd, 0];
    const plane = { id:Math.random().toString(36).slice(2), x, y, vx, vy, age:0, maxAge:2500, fromId:this.myPlayer.id };
    this.planes.push(plane);
    this.network?.sendPlane({ x, y, vx, vy, fromId:this.myPlayer.id });
  }

  toggleEmoteWheel() {
    document.getElementById("emote-wheel")?.classList.toggle("hidden");
  }

  sendReaction(emoji) {
    this.myPlayer.reaction = emoji;
    this.myPlayer.reactionTimer = 3000;
    this.network?.sendReaction(emoji);
    document.getElementById("emote-wheel")?.classList.add("hidden");
  }

  // ── INTERACT ───────────────────────────────────────────────────────────────
  tryInteract() {
    if (this.interactCooldown > 0 || this.chatMode || this.taskDialog || this.bookDialog || this.wbMode) return;
    const { x, y } = this.myPlayer;

    // Drop held object
    const heldId = this.myPlayer.heldObject;
    if (heldId) {
      const obj = this.worldObjects.find(o => o.id === heldId);
      if (obj) { obj.heldBy = null; obj.x = x; obj.y = y+20; }
      this.myPlayer.heldObject = null;
      this.network?.sendObjectDrop(heldId, x, y+20);
      this.interactCooldown = 20;
      return;
    }

    // Pick up world object
    const nearObj = this.worldObjects.find(o => !o.heldBy && Math.hypot(o.x-x, o.y-y) < 46);
    if (nearObj) {
      if (nearObj.type === "paper_plane") { this.throwPlane(); return; }
      nearObj.heldBy = this.myPlayer.id;
      this.myPlayer.heldObject = nearObj.id;
      this.network?.sendObjectPickup(nearObj.id);
      this.interactCooldown = 20;
      return;
    }

    // Whiteboard → full-screen draw mode
    if (isNearWhiteboard(x, y)) { this.enterWbMode(); return; }

    // Bulletin
    if (isNearBulletin(x, y)) { this._openTaskDialog(); return; }

    // Book
    const nearBook = isNearBook(x, y);
    if (nearBook) { this._openBookDialog(nearBook); return; }

    // Desk
    const di = getNearbyDesk(x, y);
    if (di >= 0) {
      const d = DESKS[di];
      this.myPlayer.sitting = !this.myPlayer.sitting;
      if (this.myPlayer.sitting) {
        this.myPlayer.x = d.seatX; this.myPlayer.y = d.seatY;
        this.myPlayer.facing = "up";
      }
      this.network?.sendMove(this.myPlayer);
      this.interactCooldown = 30;
    }
  }

  // ── CHAT ───────────────────────────────────────────────────────────────────
  openChat() {
    if (this.chatMode) return;
    this.chatMode = true;

    // Full overlay so keyboard doesn't bury the input
    const overlay = document.createElement("div");
    overlay.id = "chat-overlay";
    overlay.style.cssText = [
      "position:fixed;inset:0;z-index:500",
      "background:rgba(0,0,0,0.82)",
      "display:flex;align-items:flex-start;justify-content:center",
      "padding-top:12vh",
    ].join(";");

    const box = document.createElement("div");
    box.style.cssText = [
      "width:min(420px,92vw)",
      "background:#000;border:3px solid #29ADFF;border-radius:4px",
      "padding:14px;display:flex;flex-direction:column;gap:12px",
    ].join(";");

    const lbl = document.createElement("div");
    lbl.textContent = "MENSAJE:";
    lbl.style.cssText = "color:#29ADFF;font-family:'Press Start 2P',monospace;font-size:8px";

    const inp = document.createElement("input");
    inp.type = "text"; inp.maxLength = 80;
    inp.placeholder = "Escribe aqui...";
    inp.style.cssText = [
      "width:100%;padding:12px 10px",
      "border:2px solid #29ADFF;border-radius:2px",
      "background:#111;color:#FFF1E8",
      "font-family:'Press Start 2P',monospace;font-size:10px",
      "outline:none",
    ].join(";");

    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:8px";

    const mkBtn = (label, bg, fg) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = [
        "flex:1;padding:14px 8px",
        `background:${bg};color:${fg};border:none;border-radius:2px`,
        "font-family:'Press Start 2P',monospace;font-size:8px",
        "cursor:pointer;touch-action:manipulation",
      ].join(";");
      return b;
    };
    const sendBtn   = mkBtn("ENVIAR",    "#29ADFF", "#000");
    const cancelBtn = mkBtn("CANCELAR",  "#7E2553", "#FFF1E8");
    row.append(sendBtn, cancelBtn);
    box.append(lbl, inp, row);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    this.chatInput = overlay;

    setTimeout(() => inp.focus(), 60);

    const send = () => {
      const t = inp.value.trim();
      if (t) { this.myPlayer.message=t; this.myPlayer.messageTimer=5500; this.network?.sendMessage(t); }
      this.closeChat();
    };
    inp.addEventListener("keydown", e => {
      e.stopPropagation();
      if (e.key === "Enter")  send();
      if (e.key === "Escape") this.closeChat();
    });
    sendBtn.addEventListener("touchend",   e => { e.preventDefault(); send(); });
    sendBtn.addEventListener("click",      send);
    cancelBtn.addEventListener("touchend", e => { e.preventDefault(); this.closeChat(); });
    cancelBtn.addEventListener("click",    () => this.closeChat());
    overlay.addEventListener("touchend",   e => { if (e.target === overlay) this.closeChat(); });
    overlay.addEventListener("click",      e => { if (e.target === overlay) this.closeChat(); });
  }
  closeChat() { this.chatMode=false; this.chatInput?.remove(); this.chatInput=null; }

  forceStandUp() {
    if (!this.myPlayer.sitting) return;
    this.myPlayer.sitting = false;
    this.myPlayer.facing  = "down";
    this.interactCooldown = 0;
    this.network?.sendMove(this.myPlayer);
  }

  // D-pad ACTION: stand if sitting, sit if near desk, else throw plane
  mobileAction() {
    if (this.myPlayer.sitting) { this.forceStandUp(); return; }
    if (this.interactCooldown > 0) return;
    const { x, y } = this.myPlayer;
    const di = getNearbyDesk(x, y);
    if (di >= 0) {
      const d = DESKS[di];
      this.myPlayer.sitting = true;
      this.myPlayer.x = d.seatX; this.myPlayer.y = d.seatY;
      this.myPlayer.facing = "up";
      this.network?.sendMove(this.myPlayer);
      this.interactCooldown = 30;
    } else {
      this.throwPlane();
    }
  }

  // ── TASK DIALOG ────────────────────────────────────────────────────────────
  _openTaskDialog() {
    if (this.taskDialog) return;
    this.interactCooldown = 60;
    const isTeacher = CHARACTERS[this.charKey]?.isTeacher;
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:300;display:flex;align-items:center;justify-content:center;";
    const panel = document.createElement("div");
    panel.style.cssText = "background:#000;border:3px solid #FFA300;border-radius:4px;padding:20px;width:380px;max-height:80vh;overflow-y:auto;font-family:'Press Start 2P',monospace;color:#FFF1E8;image-rendering:pixelated;";
    panel.innerHTML = `<h2 style="margin:0 0 16px;color:#FFA300;font-size:11px">[ TAREAS ]</h2><div id="task-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px"></div>${isTeacher?`<div style="display:flex;gap:8px"><input id="task-new" type="text" maxlength="60" placeholder="Nueva tarea" style="flex:1;padding:8px;border:2px solid #FFA300;background:#000;color:#FFF1E8;font-family:'Press Start 2P',monospace;font-size:8px;outline:none"/><button id="task-add" style="padding:8px;border:2px solid #FFA300;background:#AB5236;color:#FFF1E8;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:8px">+</button></div>`:""}<button id="task-close" style="width:100%;margin-top:14px;padding:8px;border:2px solid #5F574F;background:#000;color:#C2C3C7;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:8px">[ESC] CERRAR</button>`;
    ov.appendChild(panel); document.body.appendChild(ov); this.taskDialog=ov;
    this._renderTaskList(panel.querySelector("#task-list"), isTeacher);
    if (isTeacher) {
      const ni=panel.querySelector("#task-new"); ni.focus();
      ni.addEventListener("keydown", e => { e.stopPropagation(); if (e.key==="Enter") panel.querySelector("#task-add").click(); });
      panel.querySelector("#task-add").addEventListener("click",()=>{
        const t=ni.value.trim(); if (!t) return;
        this.tasks.push({text:t,done:false}); ni.value="";
        this.network?.sendTasks(this.tasks); this.onTasksChange?.(this.tasks);
        this._renderTaskList(panel.querySelector("#task-list"),isTeacher);
      });
    }
    panel.querySelector("#task-close").addEventListener("click",()=>this.closeTaskDialog());
    ov.addEventListener("click",e=>{if(e.target===ov)this.closeTaskDialog();});
  }
  _renderTaskList(container, isTeacher) {
    container.innerHTML="";
    if (!this.tasks.length){container.innerHTML=`<p style="color:#5F574F;font-size:8px">SIN TAREAS.</p>`;return;}
    this.tasks.forEach((t,i)=>{
      const row=document.createElement("div");
      row.style.cssText=`display:flex;align-items:center;gap:8px;padding:8px;border:2px solid ${t.done?"#008751":"#AB5236"};background:${t.done?"rgba(0,135,81,0.2)":"rgba(171,82,54,0.1)"};`;
      row.innerHTML=`<input type="checkbox" ${t.done?"checked":""} style="width:14px;height:14px;cursor:pointer;accent-color:#00E436"/><span style="flex:1;font-size:7px;color:${t.done?"#00E436":"#FFF1E8"};text-decoration:${t.done?"line-through":"none"}">${t.text}</span>${isTeacher?`<button data-del="${i}" style="background:none;border:none;color:#FF004D;cursor:pointer;font-size:10px">X</button>`:""}`;
      row.querySelector("input").addEventListener("change",cb=>{this.tasks[i].done=cb.target.checked;this.network?.sendTasks(this.tasks);this.onTasksChange?.(this.tasks);this._renderTaskList(container,isTeacher);});
      if(isTeacher)row.querySelector(`[data-del="${i}"]`).addEventListener("click",()=>{this.tasks.splice(i,1);this.network?.sendTasks(this.tasks);this.onTasksChange?.(this.tasks);this._renderTaskList(container,isTeacher);});
      container.appendChild(row);
    });
  }
  closeTaskDialog(){this.taskDialog?.remove();this.taskDialog=null;}

  // ── BOOK DIALOG ────────────────────────────────────────────────────────────
  _openBookDialog(bookDef) {
    if (this.bookDialog) return;
    const book = this.books.find(b=>b.id===bookDef.id) || bookDef;
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:300;display:flex;align-items:center;justify-content:center;";
    const panel = document.createElement("div");
    panel.style.cssText = `background:#1D2B53;border:3px solid ${book.color||"#FFA300"};border-radius:4px;padding:20px;width:360px;max-height:80vh;overflow-y:auto;font-family:'Press Start 2P',monospace;color:#FFF1E8;`;
    const charName = CHARACTERS[this.charKey]?.name || "?";

    const renderMsgs = () => {
      const msgs = book.messages || [];
      if (!msgs.length) return `<p style="color:#5F574F;font-size:7px;font-style:italic">Nadie ha escrito nada todavia...</p>`;
      return msgs.map(m=>`
        <div style="margin-bottom:8px;padding:6px;border:1px solid ${book.color};background:rgba(0,0,0,0.3)">
          <div style="font-size:6px;color:#83769C;margin-bottom:2px">${m.author} | ${new Date(m.time).toLocaleTimeString()}</div>
          <div style="font-size:8px;color:#FFF1E8;word-break:break-all">${m.text}</div>
        </div>`).join("");
    };

    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:20px">${book.emoji}</span>
        <h2 style="margin:0;color:${book.color};font-size:9px">${book.title.toUpperCase()}</h2>
      </div>
      <div id="book-msgs" style="max-height:220px;overflow-y:auto;margin-bottom:12px">${renderMsgs()}</div>
      <input id="book-input" type="text" maxlength="120" placeholder="Escribe aqui..."
        style="width:100%;padding:8px;border:2px solid ${book.color};background:#000;color:#FFF1E8;font-family:'Press Start 2P',monospace;font-size:8px;outline:none;margin-bottom:8px;box-sizing:border-box;"/>
      <div style="display:flex;gap:8px">
        <button id="book-send" style="flex:1;padding:8px;border:2px solid ${book.color};background:${book.color};color:#FFF1E8;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:7px">ESCRIBIR</button>
        <button id="book-close" style="padding:8px;border:2px solid #5F574F;background:#000;color:#C2C3C7;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:7px">CERRAR</button>
      </div>`;
    ov.appendChild(panel); document.body.appendChild(ov); this.bookDialog=ov;

    const input = panel.querySelector("#book-input");
    input.focus();
    input.addEventListener("keydown", e => {
      e.stopPropagation();
      if (e.key==="Enter") panel.querySelector("#book-send").click();
      if (e.key==="Escape") this.closeBookDialog();
    });
    panel.querySelector("#book-send").addEventListener("click",()=>{
      const text=input.value.trim(); if (!text) return;
      const msg={author:charName, text, time:Date.now()};
      if (!book.messages) book.messages=[];
      book.messages.push(msg);
      this.network?.sendBookMessage(book.id, text);
      input.value="";
      const msgs=panel.querySelector("#book-msgs");
      msgs.innerHTML=renderMsgs();
      msgs.scrollTop=9999;
    });
    panel.querySelector("#book-close").addEventListener("click",()=>this.closeBookDialog());
    ov.addEventListener("click",e=>{if(e.target===ov)this.closeBookDialog();});

    // Live refresh when others write
    this.onBookUpdate = bookId => {
      if (bookId !== book.id) return;
      const msgs=panel.querySelector("#book-msgs");
      if (msgs) { msgs.innerHTML=renderMsgs(); msgs.scrollTop=9999; }
    };
  }
  closeBookDialog(){this.bookDialog?.remove();this.bookDialog=null;this.onBookUpdate=null;}

  // ── VIDEO ──────────────────────────────────────────────────────────────────
  setLocalVideo(stream)      { this.localVideo=this._makeVideo(stream,true); }
  setRemoteVideo(id,stream)  { this.videoStreams.get(id)?.remove(); this.videoStreams.set(id,this._makeVideo(stream,false)); }
  removeRemoteVideo(id)      { this.videoStreams.delete(id); }
  _makeVideo(stream,muted){
    const v=document.createElement("video");
    v.srcObject=stream;v.autoplay=true;v.muted=muted;v.playsInline=true;
    v.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;";
    document.body.appendChild(v);v.play().catch(()=>{});return v;
  }

  // ── MOVEMENT ───────────────────────────────────────────────────────────────
  _updateMovement() {
    if (this.myPlayer.sitting||this.chatMode||this.taskDialog||this.bookDialog||this.wbMode) return;
    let dx=0,dy=0;
    if (this.keys["ArrowLeft"]  ||this.keys["a"]||this.keys["A"]) dx=-1;
    if (this.keys["ArrowRight"] ||this.keys["d"]||this.keys["D"]) dx=1;
    if (this.keys["ArrowUp"]    ||this.keys["w"]||this.keys["W"]) dy=-1;
    if (this.keys["ArrowDown"]  ||this.keys["s"]||this.keys["S"]) dy=1;
    if (this.joystick.active){dx+=this.joystick.dx;dy+=this.joystick.dy;}
    if (dx&&dy){dx*=0.707;dy*=0.707;}
    if (!dx&&!dy) return;
    const c=clampToBounds(this.myPlayer.x+dx*SPEED, this.myPlayer.y+dy*SPEED);
    this.myPlayer.x=c.x;this.myPlayer.y=c.y;
    if (Math.abs(dx)>=Math.abs(dy)) this.myPlayer.facing=dx<0?"left":"right";
    else                             this.myPlayer.facing=dy<0?"up":"down";
    this.myPlayer.walkCycle=(this.myPlayer.walkCycle+0.22)%4;
    this.network?.sendMove(this.myPlayer);
    if (this.myPlayer.heldObject){
      const obj=this.worldObjects.find(o=>o.id===this.myPlayer.heldObject);
      if(obj){obj.x=c.x;obj.y=c.y;}
    }
  }

  // ── CAMERA ─────────────────────────────────────────────────────────────────
  _updateCamera() {
    const vw=this.canvas.width,vh=this.canvas.height;
    const tx=Math.max(0,Math.min(WORLD_W-vw,this.myPlayer.x-vw/2));
    const ty=Math.max(0,Math.min(WORLD_H-vh,this.myPlayer.y-vh/2));
    this.cam.x+=(tx-this.cam.x)*CAM_LERP;
    this.cam.y+=(ty-this.cam.y)*CAM_LERP;
  }

  // ── COINS ──────────────────────────────────────────────────────────────────
  _checkCoins(dt) {
    const {x,y}=this.myPlayer;
    for (const coin of this.coins) {
      if (coin.collected){coin.respawnIn-=dt;if(coin.respawnIn<=0){coin.collected=false;coin.respawnIn=0;}continue;}
      if (Math.hypot(coin.x-x,coin.y-y)<28){
        coin.collected=true;coin.respawnIn=COIN_RESPAWN;
        this.myCoins++;this.onCoinsChange?.(this.myCoins);
        this.network?.sendCoinPickup(coin.id);
        document.getElementById("coin-display")?.classList.add("coin-pop");
        setTimeout(()=>document.getElementById("coin-display")?.classList.remove("coin-pop"),400);
      }
    }
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  render() {
    const{ctx,canvas}=this;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(-Math.round(this.cam.x),-Math.round(this.cam.y));

    drawClassroom(ctx, performance.now());
    drawBulletinTasks(ctx,this.tasks);
    drawBooks(ctx,this.books);
    drawCoins(ctx,this.coins,performance.now());
    drawWorldObjects(ctx,this.worldObjects);
    this._renderWbInGame(ctx);  // thumbnail of wb drawing on the board
    drawPlanes(ctx,this.planes);

    // Depth sort
    const all=[{...this.myPlayer,isMe:true},...Array.from(this.otherPlayers.values()).map(p=>({...p,isMe:false}))].sort((a,b)=>a.y-b.y);
    for (const p of all) this._renderPlayer(ctx,p);
    this._renderInteractionHints(ctx);
    ctx.restore();
    this._renderScreenHints();
  }

  // Small thumbnail of the WB drawing rendered in-game on the whiteboard
  _renderWbInGame(ctx) {
    const wb = WHITEBOARD;
    ctx.save();
    ctx.beginPath(); ctx.rect(wb.x+4,wb.y+4,wb.w-8,wb.h-8); ctx.clip();
    ctx.fillStyle="#FFF1E8"; ctx.fillRect(wb.x+4,wb.y+4,wb.w-8,wb.h-8);
    // Render strokes scaled from [0,1] to whiteboard dims
    for (const stroke of this.wbStrokes) {
      const color = stroke.eraser?"#FFF1E8":(stroke.color||"#1D2B53");
      const sz = Math.max(1, (stroke.size||4)/WB_W*(wb.w-8));
      ctx.fillStyle = color;
      let prev=null;
      for (const pt of stroke.points) {
        const px=wb.x+4+pt.x*(wb.w-8), py=wb.y+4+pt.y*(wb.h-8);
        if (prev) {
          const steps=Math.ceil(Math.max(Math.abs(px-prev.x)/sz,Math.abs(py-prev.y)/sz));
          for(let i=0;i<=steps;i++){
            const t=steps?i/steps:0;
            const ix=Math.floor((prev.x+(px-prev.x)*t)/sz)*sz;
            const iy=Math.floor((prev.y+(py-prev.y)*t)/sz)*sz;
            ctx.fillRect(ix,iy,sz,sz);
          }
        }
        ctx.fillRect(Math.floor(px/sz)*sz,Math.floor(py/sz)*sz,sz,sz);
        prev={x:px,y:py};
      }
    }
    ctx.restore();

    // Draw text overlay on the whiteboard
    if (this.whiteboardText) drawWhiteboardText(ctx, this.whiteboardText);
  }

  // ── RENDER PLAYER ──────────────────────────────────────────────────────────
  _renderPlayer(ctx,player) {
    const char=CHARACTERS[player.character];if(!char)return;
    const s=char.config.charScale||BASE_SCALE;

    let jumpOff=0;
    if (player.isMe&&this.myPlayer.jumpTime>0){const prog=1-this.myPlayer.jumpTime/JUMP_DUR;jumpOff=-Math.sin(prog*Math.PI)*32;}
    else if (!player.isMe&&player.jumpTime>0){const prog=1-player.jumpTime/JUMP_DUR;jumpOff=-Math.sin(prog*Math.PI)*32;}

    ctx.fillStyle="rgba(0,0,0,0.22)";
    ctx.beginPath();ctx.ellipse(player.x,player.y+3,16,6,0,0,Math.PI*2);ctx.fill();

    ctx.save();if(jumpOff)ctx.translate(0,jumpOff);
    drawCharacter(ctx,char,player.x,player.y,BASE_SCALE,player.facing||"down",player.walkCycle||0,player.sitting);
    ctx.restore();

    // Camera box
    const topY=Math.round(player.y-24*s)+jumpOff;
    const vidY=topY-CAM_H-8;const vidX=player.x-CAM_W/2;
    const vsrc=player.isMe?this.localVideo:this.videoStreams.get(player.id);
    if(vsrc&&vsrc.readyState>=2){
      ctx.save();ctx.beginPath();ctx.roundRect(vidX,vidY,CAM_W,CAM_H,4);ctx.clip();
      ctx.drawImage(vsrc,vidX,vidY,CAM_W,CAM_H);ctx.restore();
    } else {
      ctx.fillStyle=player.isMe?"rgba(0,40,0,0.9)":`${char.color||"#008751"}CC`;
      ctx.beginPath();ctx.roundRect(vidX,vidY,CAM_W,CAM_H,4);ctx.fill();
      ctx.fillStyle="#FFF1E8";ctx.font=`bold ${Math.round(CAM_H*0.5)}px monospace`;
      ctx.textAlign="center";ctx.fillText((char.name||"?")[0],player.x,vidY+CAM_H*0.65);
    }
    // Pixel border on camera box
    ctx.strokeStyle=player.isMe?"#FFEC27":"rgba(255,255,255,0.45)";ctx.lineWidth=player.isMe?2.5:1.5;
    ctx.beginPath();ctx.roundRect(vidX,vidY,CAM_W,CAM_H,4);ctx.stroke();

    // Name tag (retro style)
    ctx.font="bold 9px 'Press Start 2P',monospace";ctx.textAlign="center";
    const nw=ctx.measureText(char.name).width+10;const nx=player.x-nw/2;const ny=vidY+CAM_H+1;
    ctx.fillStyle=player.isMe?"#FFEC27":"#000";
    ctx.fillRect(nx,ny,nw,14);
    ctx.strokeStyle=player.isMe?"#FFA300":"#29ADFF";ctx.lineWidth=1;
    ctx.strokeRect(nx,ny,nw,14);
    ctx.fillStyle=player.isMe?"#000":"#FFF1E8";
    ctx.fillText(char.name,player.x,ny+11);ctx.textAlign="left";

    // Held object
    if(player.heldObject){
      const OE={basketball:"🏀",volleyball:"🏐",football:"⚽",books:"📚",marker:"🖊",saxophone:"🎷",mallet:"🥁",crown:"👑",paper_plane:"✈",eraser:"🧹"};
      const type=this.worldObjects.find(o=>o.id===player.heldObject)?.type;
      ctx.font="20px serif";ctx.textAlign="center";
      ctx.fillText(OE[type]||"📦",player.x+24,vidY-4);ctx.textAlign="left";
    }

    // Reaction
    if(player.reaction&&player.reactionTimer>0){
      ctx.font="24px serif";ctx.textAlign="center";
      ctx.fillText(player.reaction,player.x,vidY-8);ctx.textAlign="left";
    }

    // Proximity chat bubble
    if(player.message&&player.messageTimer>0){
      const dist=player.isMe?0:Math.hypot(player.x-this.myPlayer.x,player.y-this.myPlayer.y);
      const alpha=player.isMe?1:Math.max(0,1-dist/380);
      if(alpha>0){ctx.save();ctx.globalAlpha=alpha;this._renderBubble(ctx,player.x,vidY-2,player.message);ctx.restore();}
    }

    if(player.isMe){ctx.strokeStyle="rgba(255,236,39,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(player.x,player.y+3,20,7,0,0,Math.PI*2);ctx.stroke();}
    if(player.hitEffect>0){ctx.font="20px serif";ctx.textAlign="center";ctx.fillText("⭐",player.x,vidY+CAM_H/2);ctx.textAlign="left";}
  }

  _renderBubble(ctx,cx,y,text){
    const pad=6,maxW=160;ctx.font="9px 'Press Start 2P',monospace";
    const words=text.split(" ");const lines=[];let line="";
    for(const w of words){const t=line+w+" ";if(ctx.measureText(t).width>maxW&&line){lines.push(line.trim());line=w+" ";}else line=t;}
    lines.push(line.trim());
    const bw=Math.min(maxW,Math.max(...lines.map(l=>ctx.measureText(l).width)))+pad*2;
    const bh=lines.length*13+pad*2;const bx=cx-bw/2;const by=y-bh-8;
    ctx.fillStyle="#FFF1E8";ctx.fillRect(bx,by,bw,bh);
    ctx.strokeStyle="#1D2B53";ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
    ctx.beginPath();ctx.moveTo(cx-5,by+bh);ctx.lineTo(cx,by+bh+6);ctx.lineTo(cx+5,by+bh);ctx.fill();ctx.stroke();
    ctx.fillStyle="#000";lines.forEach((l,i)=>ctx.fillText(l,bx+pad,by+pad+10+i*13));
  }

  _renderInteractionHints(ctx){
    const{x,y}=this.myPlayer;
    const glow=(rx,ry,rw,rh,col)=>{ctx.strokeStyle=col;ctx.lineWidth=3;ctx.setLineDash([4,2]);ctx.beginPath();ctx.rect(rx,ry,rw,rh);ctx.stroke();ctx.setLineDash([]);};
    if(isNearWhiteboard(x,y))glow(WHITEBOARD.x-6,WHITEBOARD.y-6,WHITEBOARD.w+12,WHITEBOARD.h+12,"rgba(255,236,39,.7)");
    if(isNearBulletin(x,y))  glow(BULLETIN.x-6,  BULLETIN.y-6,  BULLETIN.w+12,  BULLETIN.h+12,  "rgba(255,163,0,.7)");
    for(const obj of this.worldObjects){
      if(!obj.heldBy&&Math.hypot(obj.x-x,obj.y-y)<50){
        ctx.strokeStyle="rgba(255,236,39,0.7)";ctx.lineWidth=2;ctx.setLineDash([3,3]);
        ctx.beginPath();ctx.arc(obj.x,obj.y,(obj.radius||12)+10,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      }
    }
    const bk=isNearBook(x,y);
    if(bk){ctx.strokeStyle="rgba(255,163,0,.7)";ctx.lineWidth=2;ctx.setLineDash([3,2]);ctx.beginPath();ctx.arc(bk.x,bk.y,22,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  }

  _renderScreenHints(){
    const{x,y}=this.myPlayer;
    const hints=[];
    if(isNearWhiteboard(x,y))      hints.push("[E] PIZARRA");
    if(!this.wbMode){
      if(isNearBulletin(x,y))      hints.push("[E] TAREAS");
      if(isNearBook(x,y))          hints.push("[E] LIBRO");
      if(getNearbyDesk(x,y)>=0)    hints.push(this.myPlayer.sitting?"[E] LEVANTARSE":"[E] SENTARSE");
      if(this.myPlayer.heldObject)  hints.push("[E] SOLTAR");
      else{const near=this.worldObjects.find(o=>!o.heldBy&&Math.hypot(o.x-x,o.y-y)<46);if(near)hints.push(`[E] ${near.label}`);}
    }
    if(!hints.length) return;
    const ctx=this.ctx;const label=hints[0];
    ctx.font="bold 8px 'Press Start 2P',monospace";
    const tw=ctx.measureText(label).width+20;const hx=this.canvas.width/2-tw/2;const hy=this.canvas.height-54;
    ctx.fillStyle="#000";ctx.fillRect(hx-1,hy-1,tw+2,22+2);
    ctx.fillStyle="#1D2B53";ctx.fillRect(hx,hy,tw,22);
    ctx.strokeStyle="#FFEC27";ctx.lineWidth=2;ctx.strokeRect(hx,hy,tw,22);
    ctx.fillStyle="#FFEC27";ctx.textAlign="center";ctx.fillText(label,this.canvas.width/2,hy+15);ctx.textAlign="left";
  }

  // ── TICK ───────────────────────────────────────────────────────────────────
  tick(dt){
    const p=this.myPlayer;
    if(p.messageTimer>0)  p.messageTimer-=dt;
    if(p.reactionTimer>0) p.reactionTimer-=dt; else p.reaction=null;
    if(p.jumpTime>0)      p.jumpTime-=dt;
    if(this.interactCooldown>0) this.interactCooldown--;
    for(const op of this.otherPlayers.values()){
      if(op.messageTimer>0)  op.messageTimer-=dt;
      if(op.reactionTimer>0) op.reactionTimer-=dt; else op.reaction=null;
      if(op.jumpTime>0)      op.jumpTime-=dt;
      if(op.hitEffect>0)     op.hitEffect-=dt;
      if(!op._px){op._px=op.x;op._py=op.y;}
      if(Math.abs(op.x-op._px)>0.5||Math.abs(op.y-op._py)>0.5)op.walkCycle=((op.walkCycle||0)+0.2)%4;
      op._px=op.x;op._py=op.y;
    }
    this._updateMovement();
    this._updateCamera();
    this._checkCoins(dt);
    this.planes=this.planes.filter(pl=>{
      pl.x+=pl.vx;pl.y+=pl.vy;pl.age+=dt;
      if(!pl.hit)for(const[,op]of this.otherPlayers){if(Math.hypot(pl.x-op.x,pl.y-op.y)<32){pl.hit=true;op.hitEffect=800;}}
      return pl.age<pl.maxAge;
    });
    this.render();
  }

  start(){
    let last=performance.now();
    const loop=now=>{this.tick(now-last);last=now;requestAnimationFrame(loop);};
    requestAnimationFrame(loop);
  }
}

export function toggleFullscreen(){
  if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});
  else document.exitFullscreen?.();
}
