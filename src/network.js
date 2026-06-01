export class Network {
  constructor(roomId, onEvent) {
    this.id      = crypto.randomUUID();
    this.onEvent = onEvent;
    this._queue  = [];
    this._open   = false;

    const host  = location.hostname === "localhost"
      ? location.host
      : "pochisclass.josue.partykit.dev";
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    this.socket = new WebSocket(`${proto}//${host}/parties/main/${roomId || "main"}`);

    this.socket.addEventListener("open", () => {
      this._open = true;
      this._queue.forEach(m => this.socket.send(m));
      this._queue = [];
    });
    this.socket.addEventListener("message", e => {
      try { this.onEvent(JSON.parse(e.data)); } catch {}
    });
    this.socket.addEventListener("close", () => { this._open = false; });
  }

  _send(data) {
    const msg = JSON.stringify(data);
    if (this._open) this.socket.send(msg);
    else this._queue.push(msg);
  }

  join(character)             { this._send({ type:"join", character, clientId:this.id }); }
  sendMove(player)            { this._send({ type:"move", x:Math.round(player.x), y:Math.round(player.y), facing:player.facing, sitting:player.sitting }); }
  sendMessage(text)           { this._send({ type:"message", text }); }
  sendWhiteboard(text)        { this._send({ type:"whiteboard", text }); }
  sendReaction(emoji)         { this._send({ type:"reaction", emoji }); }
  sendTasks(tasks)            { this._send({ type:"tasks", tasks }); }
  sendObjectPickup(id)        { this._send({ type:"object_pickup", id }); }
  sendObjectDrop(id, x, y)   { this._send({ type:"object_drop", id, x, y }); }

  // Whiteboard drawing
  sendDrawStroke(stroke)      { this._send({ type:"draw_stroke", stroke }); }
  sendClearWhiteboard()       { this._send({ type:"draw_clear" }); }
  sendWbCursor(x, y)          { this._send({ type:"wb_cursor", x, y }); }

  // Coins
  sendCoinPickup(id)          { this._send({ type:"coin_pickup", id }); }

  // Books
  sendBookMessage(bookId, text) { this._send({ type:"book_write", bookId, text }); }

  // Paper planes & jump
  sendPlane(data)             { this._send({ type:"plane", ...data }); }
  sendJump()                  { this._send({ type:"jump" }); }
}
