<template>
  <div class="cardlist" ref="cardlist">
    <div v-if="notFoundText" class="cardlist-message">
      Nothing found for "{{ notFoundText }}".
    </div>
    <card-row
      v-else
      v-for="card in cards"
      :key="card.id"
      :card="card" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import CardRow from './CardRow';

  export default {
    name: 'card-list',
    components: { CardRow },

    computed: {
      notFoundText() {
        if (!this.loading && this.lastQuery && this.cards.length === 0) {
          return this.lastQuery;
        }
        return null;
      },
      
      ...mapState({
        loading: state => state.Cards.loading,
        cards: state => state.Cards.cards,
        lastQuery: state => state.Cards.lastQuery,
      }),
    },

    watch: {
      cards() {
        this.$refs.cardlist.scrollTop = 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/style/variables.scss';

  .cardlist {
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

    &::-webkit-scrollbar {
      width: 5px !important;
    }
  }

  .cardlist-message {
    width: 100%;
    font-size: 1.8empx;
    text-align: center;
    margin: 1% 1% 0 1%;
  }

</style>
