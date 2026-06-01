import type * as Party from "partykit/server";

interface PlayerState {
  id: string; character: string;
  x: number; y: number;
  facing: "left"|"right"|"up"|"down";
  sitting: boolean;
  message: string; messageTimer: number;
  reaction: string|null; reactionTimer: number;
  heldObject: string|null;
  jumpTime: number;
}
interface Stroke { color:string; size:number; eraser:boolean; points:{x:number;y:number}[]; }
interface BookMsg { author:string; text:string; time:number; }

const COIN_RESPAWN = 25000;

export default class ClassroomServer implements Party.Server {
  players:  Map<string, PlayerState> = new Map();
  whiteboard  = "";
  wbStrokes:  Stroke[] = [];
  tasks:      {text:string;done:boolean}[] = [];
  books:      Map<string, BookMsg[]> = new Map();
  coins:      Map<string, {collected:boolean;by:string|null;respawnAt:number}> = new Map();
  playerCoins: Map<string, number> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    conn.send(JSON.stringify({
      type: "init",
      players:    Object.fromEntries(this.players),
      myId:       conn.id,
      whiteboard: this.whiteboard,
      wbStrokes:  this.wbStrokes.slice(-150), // last 150 strokes
      tasks:      this.tasks,
      books:      Object.fromEntries(this.books),
      coins:      Object.fromEntries(this.coins),
      coinLeaderboard: Object.fromEntries(this.playerCoins),
    }));
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    if (data.type === "join") {
      const p: PlayerState = {
        id: sender.id, character: data.character,
        x: 710, y: 560, facing:"down", sitting:false,
        message:"", messageTimer:0, reaction:null, reactionTimer:0,
        heldObject:null, jumpTime:0,
      };
      this.players.set(sender.id, p);
      this.room.broadcast(JSON.stringify({ type:"join", player:p }));
    }

    if (data.type === "move") {
      const p = this.players.get(sender.id);
      if (p) {
        p.x=data.x; p.y=data.y; p.facing=data.facing; p.sitting=data.sitting??false;
        this.room.broadcast(JSON.stringify({ type:"move", id:sender.id, x:p.x, y:p.y, facing:p.facing, sitting:p.sitting }), [sender.id]);
      }
    }

    if (data.type === "message") {
      const p = this.players.get(sender.id);
      if (p) {
        p.message = (data.text||"").slice(0,80); p.messageTimer=5500;
        this.room.broadcast(JSON.stringify({ type:"message", id:sender.id, text:p.message }));
      }
    }

    if (data.type === "whiteboard") {
      this.whiteboard = (data.text||"").slice(0,500);
      this.room.broadcast(JSON.stringify({ type:"whiteboard", text:this.whiteboard }));
    }

    if (data.type === "reaction") {
      this.room.broadcast(JSON.stringify({ type:"reaction", id:sender.id, emoji:data.emoji }));
    }

    if (data.type === "tasks") {
      this.tasks = (data.tasks||[]).slice(0,20);
      this.room.broadcast(JSON.stringify({ type:"tasks", tasks:this.tasks }));
    }

    if (data.type === "object_pickup") {
      const p = this.players.get(sender.id);
      if (p) p.heldObject = data.id;
      this.room.broadcast(JSON.stringify({ type:"object_pickup", id:data.id, by:sender.id }));
    }

    if (data.type === "object_drop") {
      const p = this.players.get(sender.id);
      if (p) p.heldObject = null;
      this.room.broadcast(JSON.stringify({ type:"object_drop", id:data.id, x:data.x, y:data.y }));
    }

    if (data.type === "draw_stroke") {
      const stroke = data.stroke as Stroke;
      if (stroke?.points?.length > 1) {
        this.wbStrokes.push(stroke);
        if (this.wbStrokes.length > 200) this.wbStrokes.splice(0, this.wbStrokes.length - 200);
      }
      this.room.broadcast(JSON.stringify({ type:"draw_stroke", stroke }), [sender.id]);
    }

    if (data.type === "wb_cursor") {
      this.room.broadcast(JSON.stringify({ type:"wb_cursor", x:data.x, y:data.y, from:sender.id }), [sender.id]);
    }

    if (data.type === "draw_clear") {
      this.wbStrokes = [];
      this.room.broadcast(JSON.stringify({ type:"draw_clear" }));
    }

    if (data.type === "coin_pickup") {
      const coinId = data.id as string;
      const existing = this.coins.get(coinId);
      if (existing?.collected) return; // already taken
      this.coins.set(coinId, { collected:true, by:sender.id, respawnAt:Date.now()+COIN_RESPAWN });
      const prev = this.playerCoins.get(sender.id) || 0;
      this.playerCoins.set(sender.id, prev+1);
      const playerName = this.players.get(sender.id)?.character || sender.id;
      this.room.broadcast(JSON.stringify({
        type:"coin_pickup", id:coinId, by:sender.id, playerName,
        coinLeaderboard: Object.fromEntries(this.playerCoins),
      }));
      // Schedule respawn (party can't use setTimeout reliably, client handles it)
    }

    if (data.type === "book_write") {
      const { bookId, text } = data;
      const msgs = this.books.get(bookId) || [];
      const p = this.players.get(sender.id);
      const msg: BookMsg = { author: p?.character||"?", text:(text||"").slice(0,200), time:Date.now() };
      msgs.push(msg);
      if (msgs.length > 50) msgs.splice(0, msgs.length-50);
      this.books.set(bookId, msgs);
      this.room.broadcast(JSON.stringify({ type:"book_write", bookId, msg }));
    }

    if (data.type === "plane") {
      this.room.broadcast(JSON.stringify({ type:"plane", ...data, fromId:sender.id }), [sender.id]);
    }

    if (data.type === "jump") {
      const p = this.players.get(sender.id);
      if (p) p.jumpTime = 550;
      this.room.broadcast(JSON.stringify({ type:"jump", id:sender.id }), [sender.id]);
    }

    if (data.type === "webrtc") {
      const target = this.room.getConnection(data.to);
      if (target) target.send(JSON.stringify({ type:"webrtc", from:sender.id, signal:data.signal }));
    }
  }

  onClose(conn: Party.Connection) {
    this.players.delete(conn.id);
    this.room.broadcast(JSON.stringify({ type:"leave", id:conn.id }));
  }
}
