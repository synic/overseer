const mtg = require('mtgsdk');

const state = {
  loading: false,
  lastQuery: null,
  cards: [],
};

const mutations = {
  SET_LAST_QUERY(state, query) {
    state.lastQuery = query;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_CARDS(state, cards) {
    state.cards = cards;
  },
};

const actions = {
  performSearch({ commit }, query) {
    commit('SET_LOADING', true);
    commit('SET_CARDS', []);
    return new Promise((resolve) => {
      mtg.card.where({
        name: query,
        contains: 'imageUrl',
      }).then((cards) => {
        // eslint-disable-next-line no-console
        console.log(`Found ${cards.length} cards...`);

        commit('SET_CARDS', cards);
        commit('SET_LOADING', false);
        commit('SET_LAST_QUERY', query);
        resolve();
      });
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
