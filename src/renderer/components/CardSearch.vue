<template>
  <div class="content" @click="focusInput">
    <div class="input-container">
      <input ref="search"
        :placeholder="placeholderText"
        @keydown.esc="sendApplicationCommand(':hide:');"
        @keyup.enter="search"
        >
      <img
        src="static/images/loading.gif"
        v-show="loading"
        >
    </div>

    <card-list></card-list>
    <div class="footer"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import CardList from './CardSearch/CardList';
  const ipc = require('electron').ipcRenderer;

  const exampleCards = [
    'Lifecrafter\'s Bestiary',
    'Fatal Push',
    'Lantern of Insight',
    'Whir of Invention',
    'Mox Opal',
    'Blood Artist',
    'Harmless Offering',
    'Snapcaster Mage',
    'Inventors\' Fair',
    'Tezzeret, Agent of Bolas',
    'Spell Snare',
    'Cryptic Command',
    'Mana Leak',
    'Black Lotus',
    'Blighted Agent',
    'Whip of Erebus',
    'Ensnaring Bridge',
  ];

  export default {
    name: 'card-search',
    components: { CardList },

    computed: {
      placeholderText() {
        const item = exampleCards[
          Math.floor(Math.random() * exampleCards.length)];
        return `Type a card name, e.g. "${item}"`;
      },

      ...mapState({
        loading: state => state.Cards.loading,
      }),
    },

    methods: {
      sendApplicationCommand(command) {
        if (ipc === null) return;
        command = command.substr(1, command.length - 2);
        ipc.send(`application-cmd-${command}`);
      },

      search(event) {
        const value = event.target.value;
        this.focusInput();
        if (value.startsWith(':') && value.endsWith(':')) {
          this.sendApplicationCommand(value);
        } else {
          this.$store.dispatch('performSearch', value);
        }
      },

      focusInput() {
        this.$refs.search.focus();
        this.$refs.search.select();
      },
    },

    mounted() {
      this.focusInput();
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/style/variables.scss';

  .content {
    height: 100%;
    display: flex;
    flex-flow: column;
    margin: 1% 1% 0 1%;

    .input-container {
      margin-bottom: 1%;
      display: block;
      flex: 0 0 auto;

      input {
        -webkit-app-region: no-drag;
        background-color: $color4;
        border: none;
        border-radius: 4px;
        color: black;
        width: 100%;
        position: relative;
        float: left;
        height: 37px;
        padding: 1%;
        font-size: 1.2em;
      }

      img {
        position: absolute;
        right: 20px;
        width: 34px;
        height: 34px;
      }
    }
  }

  .footer {
    height: 15px;
    flex: 0 0 15px;
  }

</style>
