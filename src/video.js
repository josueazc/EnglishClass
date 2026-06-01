// WebRTC video using simple peer-to-peer via PartyKit signaling
// Each peer streams to others directly

export class VideoManager {
  constructor(network, game) {
    this.network = network;
    this.game = game;
    this.localStream = null;
    this.peers = new Map(); // peerId -> RTCPeerConnection

    this.ICE = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
  }

  async start() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 160, height: 120, facingMode: "user" },
        audio: false,
      });
      this.game.setLocalVideo(this.localStream);
      return true;
    } catch (e) {
      console.warn("Camera not available:", e.message);
      return false;
    }
  }

  async connectTo(peerId) {
    if (this.peers.has(peerId)) return;
    const pc = this._createPeer(peerId, true);
    this.peers.set(peerId, pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this._signal(peerId, { type: "offer", sdp: offer });
  }

  async handleSignal(fromId, signal) {
    if (signal.type === "offer") {
      const pc = this._createPeer(fromId, false);
      this.peers.set(fromId, pc);
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this._signal(fromId, { type: "answer", sdp: answer });
    } else if (signal.type === "answer") {
      const pc = this.peers.get(fromId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    } else if (signal.type === "ice") {
      const pc = this.peers.get(fromId);
      if (pc && signal.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    }
  }

  removePeer(peerId) {
    const pc = this.peers.get(peerId);
    if (pc) { pc.close(); this.peers.delete(peerId); }
    this.game.removeRemoteVideo(peerId);
  }

  _createPeer(peerId, initiator) {
    const pc = new RTCPeerConnection(this.ICE);

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) this._signal(peerId, { type: "ice", candidate: e.candidate });
    };

    pc.ontrack = (e) => {
      const stream = e.streams[0];
      if (stream) this.game.setRemoteVideo(peerId, stream);
    };

    return pc;
  }

  _signal(toId, data) {
    this.network.socket.send(JSON.stringify({
      type: "webrtc",
      to: toId,
      signal: data,
    }));
  }
}
