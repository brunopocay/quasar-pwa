<template>
    <div>
      <q-btn @click="startCamera">Abrir Câmera</q-btn>
      <q-btn @click="startRecording">Gravar Áudio</q-btn>
      <video ref="video" autoplay></video>
      <audio ref="audio" controls></audio>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const video = ref(null);
  const audio = ref(null);
  
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video.value) {
        video.value.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar a câmeraa: ', error);
    }
  }
  
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
  
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
  
      mediaRecorder.onstop = (e) => {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        if (audio.value) {
          audio.value.src = URL.createObjectURL(blob);
        }
      };
  
      mediaRecorder.start();
  
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // grava por 5 segundos
    } catch (error) {
      console.error('Erro ao acessar o microfone: ', error);
    }
  }
  </script>
  