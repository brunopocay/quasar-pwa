<template>
  <div>
    <q-btn @click="startRecordingVideo">Gravar Vídeo</q-btn>
    <q-btn @click="stopRecordingVideo" :disabled="!isRecordingVideo">Parar Gravação</q-btn>
    <video ref="video" autoplay></video>
    <video ref="recordedVideo" controls></video>
    <q-btn @click="startRecordingAudio">Gravar Áudio</q-btn>
    <q-btn @click="stopRecordingAudio" :disabled="!isRecordingAudio">Parar Gravação de Áudio</q-btn>
    <audio ref="audio" controls></audio>
    <q-btn @click="uploadFile">Upload arquivos sistema</q-btn>
    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
    <ul>
      <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      videoChunks: [],
      videoStream: null,
      audioStream: null,
      isRecordingVideo: false,
      isRecordingAudio: false,
      selectedFiles: []
    };
  },
  methods: {
    async startRecordingVideo() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.videoStream;
        this.mediaRecorder = new MediaRecorder(this.videoStream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.videoChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const videoBlob = new Blob(this.videoChunks, { type: 'video/webm' });
          this.$refs.recordedVideo.src = URL.createObjectURL(videoBlob);
          this.videoChunks = [];
          this.downloadVideo(videoBlob);
        };
        this.mediaRecorder.start();
        this.isRecordingVideo = true;
      } catch (error) {
        console.error("Erro ao iniciar a gravação de vídeo:", error);
      }
    },
    stopRecordingVideo() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.videoStream.getTracks().forEach(track => track.stop());
        this.isRecordingVideo = false;
      }
    },
    async startRecordingAudio() {
      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.audioStream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.$refs.audio.src = URL.createObjectURL(audioBlob);
          this.audioChunks = [];
        };
        this.mediaRecorder.start();
        this.isRecordingAudio = true;
      } catch (error) {
        console.error("Erro ao gravar áudio:", error);
      }
    },
    stopRecordingAudio() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.audioStream.getTracks().forEach(track => track.stop());
        this.isRecordingAudio = false;
      }
    },
    downloadVideo(videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'video.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    uploadFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.selectedFiles = Array.from(files);
        console.log("Arquivos selecionados:", this.selectedFiles);
        // Implementar a lógica de upload dos arquivos aqui
      }
    }
  }
};
</script>

