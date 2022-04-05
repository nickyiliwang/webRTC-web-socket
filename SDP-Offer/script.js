let peerConnection;
let localStream;
let remoteStream;

// ICE
const servers = {
  iceServers: [
    { urls: ["stun1.l.google.com:19302", "stun2.l.google.com:19302"] },
  ],
  iceCandidatePoolSize: 10,
};

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  document.getElementById("user-1").srcObject = localStream;
  document.getElementById("user-2").srcObject = remoteStream;
};

let createOffer = async () => {
  remoteStream = new MediaStream();
  peerConnection = new RTCPeerConnection(servers);

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  document.getElementById("offer-sdp").value = JSON.stringify(offer);
};

init();
