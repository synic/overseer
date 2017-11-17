import Ember from 'ember';

const exampleCards = [
  'Lifecrafter\'s Bestiary',
  'Fatal Push',
  'Lantern of Insight',
  'Whir of Invention',
  'Mox Opal',
  'Blood Artist',
  'Harmless Offering',
  'Snapcaster Mage',
];

export default Ember.Component.extend({
  keyDown(event) {
    this.sendAction('searchTextInputAction', event.which, event);
  },

  didInsertElement() {
    this._super(...arguments);

    const name = exampleCards[Math.floor(Math.random()*exampleCards.length)];

    this.$('#search-txt').prop(
      'placeholder', `Type a card name, e. g. "${name}"`);
  },
});
