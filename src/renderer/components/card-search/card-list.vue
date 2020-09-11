<template>
  <div class="list" ref="list">
    <div v-if="isSearchEmpty" class="message">
      Nothing found for "{{ lastQuery }}".
    </div>
    <div v-if="loading" class="message">
      Loading...
    </div>
    <card-row
      v-else
      v-for="card in cards"
      :key="card.id"
      :card="card"
      >
    </card-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import CardRow from './card-row';

  export default {
    name: 'card-list',
    components: { CardRow },

    computed: {
      isSearchEmpty() {
        if (!this.loading && this.lastQuery && this.cards.length === 0) {
          return true;
        }
        return false;
      },

      ...mapState({
        loading: state => state.cards.loading,
        cards: state => state.cards.cards,
        lastQuery: state => state.cards.lastQuery,
      }),
    },

    watch: {
      cards() {
        this.$refs.list.scrollTop = 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/style/variables.scss';

  .list {
    background-color: $color4;
    overflow-y: scroll;
    flex: 1 1 auto;
    border: none;
    font-size: .8em;
    -webkit-app-region: no-drag;
    font-weight: 400;
    border-radius: 4px;
    padding: 1% 0 1% 0;
    margin-bottom: 1%;

    .message {
      width: 100%;
      font-size: 1.8em;
      text-align: center;
      margin: 1% 1% 0 1%;
    }

    &::-webkit-scrollbar {
      width: 5px !important;
    }
  }

</style>
