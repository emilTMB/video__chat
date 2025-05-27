const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const localPeerConnection = new RTCPeerConnection();
const remotePeerConnection = new RTCPeerConnection();

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localVideo.srcObject = stream;

    // Добавляем все треки в localPeerConnection
    stream.getTracks().forEach((track) => {
      localPeerConnection.addTrack(track, stream);
    });

    // Когда удалённый получает треки — устанавливаем их в remoteVideo
    remotePeerConnection.addEventListener("track", (event) => {
      if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    });

    // ICE
    localPeerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        remotePeerConnection.addIceCandidate(e.candidate);
      }
    };

    remotePeerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        localPeerConnection.addIceCandidate(e.candidate);
      }
    };

    // Обмен SDP
    localPeerConnection
      .createOffer()
      .then((offer) => {
        return localPeerConnection.setLocalDescription(offer).then(() => offer);
      })
      .then((offer) => {
        return remotePeerConnection.setRemoteDescription(offer);
      })
      .then(() => {
        return remotePeerConnection.createAnswer();
      })
      .then((answer) => {
        return remotePeerConnection
          .setLocalDescription(answer)
          .then(() => answer);
      })
      .then((answer) => {
        return localPeerConnection.setRemoteDescription(answer);
      })
      .catch(console.error);
  });
