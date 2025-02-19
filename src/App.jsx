import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const App = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);
  const remoteAudioRef = useRef();

  useEffect(() => {
    // ✅ Initialize PeerJS with HTTPS backend
    const newPeer = new Peer(undefined, {
      host: "audio-backend-vw9o.onrender.com", 
      port: 443, // ✅ Use port 443 for HTTPS
      path: "/peerjs",
      secure: true, // ✅ Must be true for HTTPS
    });

    newPeer.on("open", (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);
      alert(`Your Peer ID: ${id}`);
    });

    // ✅ Handle Incoming Calls
    newPeer.on("call", async (incomingCall) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { 
            echoCancellation: true, // ✅ Reduce echo
            noiseSuppression: true, // ✅ Reduce background noise
          }
        });

        incomingCall.answer(stream); // ✅ Answer with local audio

        incomingCall.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
        });

        setCall(incomingCall);
      } catch (error) {
        console.error("Error getting audio:", error);
        alert("Failed to access microphone.");
      }
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  // ✅ Call a Peer
  const callPeer = async () => {
    if (!remotePeerId) return alert("Enter a Peer ID!");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const outgoingCall = peer.call(remotePeerId, stream);

      outgoingCall.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });

      setCall(outgoingCall);
    } catch (error) {
      console.error("Error getting audio:", error);
      alert("Failed to access microphone.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Voice Chat App (PeerJS)</h2>
      <p>Your Peer ID: <strong>{peerId}</strong></p>

      <input
        type="text"
        placeholder="Enter Peer ID to call"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <button onClick={callPeer}>Call</button>

      <div>
        <h3>Remote Audio</h3>
        <audio ref={remoteAudioRef} autoPlay controls />
      </div>
    </div>
  );
};

export default App;
