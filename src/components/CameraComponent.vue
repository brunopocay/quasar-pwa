<template>
  <div>
    <q-btn @click="startCamera">Abrir Câmera</q-btn>
    <q-btn @click="startRecording">Gravar Áudio</q-btn>
    <video ref="video" autoplay></video>
    <audio ref="audio" controls></audio>
    <q-btn @click="uploadFile">Upload arquivos sistema</q-btn>
    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      videoStream: null
    };
  },
  methods: {
    async startCamera() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
      }
    },
    async startRecording() {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(audioStream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks);
          this.$refs.audio.src = URL.createObjectURL(audioBlob);
          this.audioChunks = [];
        };
        this.mediaRecorder.start();
      } catch (error) {
        console.error("Erro ao gravar áudio:", error);
      }
    },
    uploadFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("Arquivo selecionado:", file);
        // Implementar o upload do arquivo para o servidor ou outra lógica necessária
      }
    }
  }
};
</script>

