let peerConnection;
let localStream;
let remoteStream;

// STUN
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
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

let createPeerConnection = async (sdpType) => {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  // adding local stream array and add each track to peerConnection object
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // responding and adding tracks to the remoteStream interface
  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // generating the ICE candidate all at once and appending to the text box
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById(sdpType).value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };
};

let createOffer = async () => {
  createPeerConnection("offer-sdp");
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  document.getElementById("offer-sdp").value = JSON.stringify(offer);
};

let createAnswer = async () => {
  createPeerConnection("answer-sdp");
  let offer = document.getElementById("offer-sdp").value;
  if (!offer) return alert("Retrieve offer from peer first");

  offer = JSON.parse(offer);
  // like localDescription, but for remote
  await peerConnection.setRemoteDescription(offer);
  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  document.getElementById("answer-sdp").value = JSON.stringify(answer);
};

let addAnswer = async () => {
  let answer = document.getElementById("answer-sdp").value;
  if (!answer) return alert("Retrieve offer from peer first");
  answer = JSON.parse(answer);
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};

init();
document.getElementById("offer").addEventListener("click", createOffer);
document.getElementById("answer").addEventListener("click", createAnswer);
document.getElementById("add-answer").addEventListener("click", addAnswer);
