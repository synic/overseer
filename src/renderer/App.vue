<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'overseer',
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,400i');
  html, body {
    height: 100%;
    width: 100%;
    background-color: #666a73;
    font-family: 'Raleway', sans-serif;
    /* -webkit-app-region: drag; */
  }

  body {
    overflow: hidden;

    /* disable text selection so it doesn't seem like a web app */
    /* -webkit-user-select: none; */
    border: 1px solid #444;
    border-radius: 4px;
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ::selection {
    background-color: #aaa;
    color: #000;
  }

  textarea, input, button { outline: none; }

  #app {
    height: 100%;
  }

</style>
