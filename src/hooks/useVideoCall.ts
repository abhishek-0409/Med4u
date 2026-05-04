import { useCallback, useEffect, useRef, useState } from "react";
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from "react-native-webrtc";
import { io, Socket } from "socket.io-client";
import { consultationService } from "../services/consultation.service";
import { SOCKET_URL } from "../services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

export type CallStatus =
  | "idle"
  | "joining"
  | "waiting"
  | "connecting"
  | "connected"
  | "ended"
  | "error";

interface UseVideoCallOptions {
  appointmentId: string;
  role: "patient" | "doctor";
  onCallEnded: () => void;
  isDemo?: boolean;
}

export interface UseVideoCallReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: CallStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  endCall: () => void;
  error: string | null;
}

/** SDP shape exchanged over the socket */
interface SdpPayload {
  sdp: string;
  type: string;
}

/**
 * react-native-webrtc v124 uses event-target-shim for EventTarget, whose
 * TypeScript types fail to resolve via the "/index" subpath in TS 5.x.
 * At runtime both addEventListener and on<event> setters work correctly.
 * This helper casts once so the rest of the code stays clean.
 */
function pcListen(
  pc: RTCPeerConnection,
  event: "icecandidate",
  handler: (e: { candidate: RTCIceCandidate | null }) => void,
): void;
function pcListen(
  pc: RTCPeerConnection,
  event: "track",
  handler: (e: { streams: MediaStream[] }) => void,
): void;
function pcListen(
  pc: RTCPeerConnection,
  event: "iceconnectionstatechange",
  handler: () => void,
): void;
function pcListen(pc: RTCPeerConnection, event: string, handler: (e: any) => void): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pc as any).addEventListener(event, handler);
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useVideoCall({
  appointmentId,
  role,
  onCallEnded,
  isDemo = false,
}: UseVideoCallOptions): UseVideoCallReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs keep async callbacks stable across re-renders
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const onCallEndedRef = useRef(onCallEnded);
  onCallEndedRef.current = onCallEnded;

  // ICE candidates queued until setRemoteDescription completes
  const iceCandidateQueueRef = useRef<RTCIceCandidate[]>([]);
  const isRemoteDescSetRef = useRef(false);

  // ── helpers ──────────────────────────────────────────────────────────────────

  const flushIceCandidates = useCallback(async () => {
    const pc = peerRef.current;
    if (!pc) return;
    for (const c of iceCandidateQueueRef.current) {
      try { await pc.addIceCandidate(c); } catch { /* ignore stale candidates */ }
    }
    iceCandidateQueueRef.current = [];
  }, []);

  const cleanup = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (socketRef.current) {
      if (roomIdRef.current) {
        socketRef.current.emit("leave-room", { roomId: roomIdRef.current });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    isRemoteDescSetRef.current = false;
    iceCandidateQueueRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  const endCall = useCallback(() => {
    cleanup();
    onCallEndedRef.current();
  }, [cleanup]);

  // ── RTCPeerConnection factory ─────────────────────────────────────────────

  const buildPeerConnection = useCallback(
    (iceServers: { urls: string; username?: string; credential?: string }[]) => {
      const pc = new RTCPeerConnection({ iceServers });

      pcListen(pc, "icecandidate", ({ candidate }) => {
        if (candidate && socketRef.current && roomIdRef.current) {
          socketRef.current.emit("ice-candidate", {
            roomId: roomIdRef.current,
            candidate: candidate.toJSON(),
          });
        }
      });

      pcListen(pc, "track", ({ streams }) => {
        const stream = streams?.[0];
        if (stream) {
          setRemoteStream(stream);
          setStatus("connected");
        }
      });

      pcListen(pc, "iceconnectionstatechange", () => {
        const state = pc.iceConnectionState;
        if (state === "disconnected" || state === "failed" || state === "closed") {
          setStatus("ended");
        }
      });

      return pc;
    },
    [],
  );

  // ── Main effect: start call on mount ────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function startCall() {
      setStatus("joining");

      // Demo mode — just open camera, skip backend
      if (isDemo) {
        let stream: MediaStream;
        try {
          stream = (await mediaDevices.getUserMedia({
            audio: true,
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          })) as MediaStream;
        } catch {
          if (!cancelled) {
            setError("Camera or microphone access was denied.");
            setStatus("error");
          }
          return;
        }
        if (!cancelled) {
          localStreamRef.current = stream;
          setLocalStream(stream);
          setStatus("waiting");
        }
        return;
      }

      if (!appointmentId) {
        setStatus("error");
        setError("No appointment ID provided.");
        return;
      }

      // 1 ── REST join → roomId, room token, ICE server config
      let joinData;
      try {
        joinData = await consultationService.join(appointmentId);
      } catch {
        if (!cancelled) {
          setError("Could not join the consultation. Please try again.");
          setStatus("error");
        }
        return;
      }
      if (cancelled) return;

      const { roomId, token, stunServers, turnServers } = joinData;
      roomIdRef.current = roomId;
      const iceServers = [...stunServers, ...turnServers];

      // 2 ── Acquire local camera + microphone
      let stream: MediaStream;
      try {
        stream = (await mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        })) as MediaStream;
      } catch {
        if (!cancelled) {
          setError("Camera or microphone access was denied. Check app permissions.");
          setStatus("error");
        }
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);

      // 3 ── Open socket authenticated with the room token
      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: false,
      });
      socketRef.current = socket;

      socket.on("connect_error", (err) => {
        if (!cancelled) {
          setError(`Socket connection failed: ${err.message}`);
          setStatus("error");
        }
      });

      socket.on("connect", () => {
        if (cancelled) return;
        setStatus("waiting");
        socket.emit("join-room", { roomId, role });
      });

      // ── I was already in the room; other peer just joined → I am the offerer
      socket.on("user-joined", async () => {
        if (cancelled || !localStreamRef.current) return;
        setStatus("connecting");

        const pc = buildPeerConnection(iceServers);
        peerRef.current = pc;
        localStreamRef.current.getTracks().forEach((t) =>
          pc.addTrack(t, localStreamRef.current!),
        );

        try {
          const offer: SdpPayload = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await pc.setLocalDescription(new RTCSessionDescription(offer));
          socket.emit("offer", { roomId, sdp: offer });
        } catch {
          if (!cancelled) {
            setError("Failed to create WebRTC offer.");
            setStatus("error");
          }
        }
      });

      // ── I joined second; received offer → create answer
      socket.on("offer", async (data: { sdp: SdpPayload; from: string }) => {
        if (cancelled || !localStreamRef.current) return;
        setStatus("connecting");

        const pc = buildPeerConnection(iceServers);
        peerRef.current = pc;
        localStreamRef.current.getTracks().forEach((t) =>
          pc.addTrack(t, localStreamRef.current!),
        );

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          isRemoteDescSetRef.current = true;
          await flushIceCandidates();

          const answer: SdpPayload = await pc.createAnswer();
          await pc.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit("answer", { roomId, sdp: answer });
        } catch {
          if (!cancelled) {
            setError("Failed to process the WebRTC offer.");
            setStatus("error");
          }
        }
      });

      // ── Complete negotiation on the offerer side
      socket.on("answer", async (data: { sdp: SdpPayload; from: string }) => {
        if (cancelled || !peerRef.current) return;
        try {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
          isRemoteDescSetRef.current = true;
          await flushIceCandidates();
        } catch {
          if (!cancelled) setError("Failed to process the WebRTC answer.");
        }
      });

      // ── ICE candidate: add immediately or buffer until remote desc is ready
      socket.on(
        "ice-candidate",
        async (data: { candidate: { sdpMid: string; sdpMLineIndex: number; candidate: string }; from: string }) => {
          if (cancelled) return;
          const candidate = new RTCIceCandidate(data.candidate);
          if (isRemoteDescSetRef.current && peerRef.current) {
            try { await peerRef.current.addIceCandidate(candidate); } catch { /* ignore */ }
          } else {
            iceCandidateQueueRef.current.push(candidate);
          }
        },
      );

      socket.on("user-left", () => {
        if (cancelled) return;
        setStatus("ended");
        cleanup();
        onCallEndedRef.current();
      });

      socket.on("call-ended", () => {
        if (cancelled) return;
        setStatus("ended");
        cleanup();
        onCallEndedRef.current();
      });

      socket.on("room-full", () => {
        if (!cancelled) {
          setError("This consultation room is already full.");
          setStatus("error");
        }
      });

      socket.on("error", (data: { message: string }) => {
        if (!cancelled) {
          setError(data.message);
          setStatus("error");
        }
      });
    }

    void startCall();

    return () => {
      cancelled = true;
      cleanup();
    };
    // appointmentId and role are stable for the lifetime of this screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, role]);

  // ── Controls ─────────────────────────────────────────────────────────────────

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCameraOff((prev) => !prev);
  }, []);

  return { localStream, remoteStream, status, isMuted, isCameraOff, toggleMute, toggleCamera, endCall, error };
}
