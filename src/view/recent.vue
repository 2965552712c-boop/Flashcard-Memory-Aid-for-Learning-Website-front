<template>
    <div>
      <h1>recent</h1>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const message = ref('Hello, Vue 3!');
      const increment = () => {
        message.value += '!';
      };
  
      return {
        message,
        increment,
      };
    },
  };
  </script>
  
  <style>
  /* Your styles here */
  </style>
  