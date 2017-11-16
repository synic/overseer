import Ember from 'ember';

export default Ember.Component.extend({
  store:           Ember.inject.service(),
  cards:           null,
  performedSearch: null,

  init() {
    this._super(...arguments);
    this.rendered = false;
  },

  didRender() {
    this._super(...arguments);

    if (!this.rendered) {
      this.rendered = true;
      this.$('#search-txt').focus().select();
    }
  },

  click() {
    this._super(...arguments);
    this.$('#search-txt').focus().select();
  },

  // actions
  actions: {
    cardsDidLoad(search, cards) {
      this.set('performedSearch', search);
      this.set('cards', cards);
    },

    cardSearchFocus() {
      this.$('#search-txt').focus().select();
    },
  }
});
