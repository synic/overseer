import Component from '@ember/component';
import { computed } from '@ember/object';

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
  'Ensnaring Bridge',
];

export default Component.extend({

  placeholderText: computed(() => {
    return `Type a card name, e.g. "${exampleCards.randomElement()}"`;
  }),

  keyDown(event) {
    this.sendAction('searchTextInputAction', event.which, event);
  },

});
