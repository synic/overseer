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
  .cardlist {
    background-color: #d9d1c7;
    overflow-y: scroll;
    flex: 1 1 auto;
    border: none;
    font-size: 14px;
    -webkit-app-region: no-drag;
    font-weight: 400;
    border-radius: 4px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: 15px;

    &::-webkit-scrollbar {
      width: 5px !important;
    }
  }

  .cardlist-message {
    width: 100%;
    font-size: 24px;
    text-align: center;
    margin: 15px 15px 0 15px;
  }

</style>
