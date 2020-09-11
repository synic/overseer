<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Overseer',
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,400i');
  @import '~@/style/variables.scss';

  html, body {
    height: 100%;
    width: 100%;
    background-color: $page-bg-color;
    font-family: $page-font-family;
    font-size: 16px;
    -webkit-app-region: drag;
  }

  body {
    overflow: hidden;

    /* disable text selection so it doesn't seem like a web app */
    -webkit-user-select: none;
    border: 1px solid $color1;
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ::selection {
    background-color: #999;
    color: black;
  }

  textarea, input, button {
    outline: none;
  }

  #app {
    height: 100%;
  }

</style>
