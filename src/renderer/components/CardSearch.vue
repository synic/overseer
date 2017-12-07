<template>
  <div class="card-search" @click="focusInput">
    <div class="card-search-input">
      <input
        id="search-txt"
        ref="search"
        :placeholder="placeholderText"
        @keydown.esc="sendApplicationCommand(':hide:');"
        @keyup.enter="search"
      >
      <img
        src="static/images/loading.gif"
        id="loading-img"
        v-if="loading">
    </div>

    <card-list />
    <div class="card-search-footer" />
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
        if (value.startsWith(':') && value.endsWith(':')) {
          this.sendApplicationCommand(value);
          this.focusInput();
        } else {
          this.$store.dispatch('performSearch', value).then(() => {
            this.focusInput();
          });
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

  .card-search {
    height: 100%;
    display: flex;
    flex-flow: column;
    margin: 15px 15px 0 15px;
  }

  .card-search-input {
    margin-bottom: 15px;
    display: block;
    flex: 0 0 auto;

    #search-txt {
      -webkit-app-region: no-drag;
      background-color: #d9d1c7;
      border: none;
      border-radius: 4px;
      color: #000;
      width: 100%;
      position: relative;
      float: left;
      height: 37px;
      padding: 6px;
      font-size: 20px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075),
        0 0 8px rgba(102, 175, 233, 0);
    }

    #loading-img {
      position: absolute;
      right: 20px;
      width: 34px;
      height: 34px;
    }
  }

  .card-search-footer {
    height: 15px;
    flex: 0 0 15px;
  }

</style>
