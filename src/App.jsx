import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs"
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// toast.configure();

const App = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();

  useEffect(() => {
    // Initialize PeerJS
    const newPeer = new Peer(undefined, {
     host: "https://audio-backend-vw9o.onrender.com",  // Replace with your actual backend URL
  port: 443,   // Use 443 for HTTPS
  path: "/peerjs",  // Ensure the path matches your backend config
  secure: true,
    });

    newPeer.on("open", (id) => {
      setPeerId(id);
      alert(`Your Peer ID: ${id}`);
    });

    newPeer.on("call", (incomingCall) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          localAudioRef.current.srcObject = stream;
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream) => {
            remoteAudioRef.current.srcObject = remoteStream;
          });
          setCall(incomingCall);
        });
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const callPeer = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localAudioRef.current.srcObject = stream;
        const outgoingCall = peer.call(remotePeerId, stream);
        outgoingCall.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
        });
        setCall(outgoingCall);
      })
      .catch((err) => toast.error("Failed to get audio stream"));
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
        <h3>Local Audio</h3>
        <audio ref={localAudioRef} autoPlay controls />
      </div>

      <div>
        <h3>Remote Audio</h3>
        <audio ref={remoteAudioRef} autoPlay controls />
      </div>
    </div>
  );
};

export default App;
