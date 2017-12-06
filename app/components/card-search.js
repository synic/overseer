import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
const ipc = (window.requireNode !== undefined) ?
      window.requireNode('electron').ipcRenderer : null;

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

export default Component.extend({
  store:           service(),
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
      this.cardSearchFocus();
    }
  },

  click() {
    this._super(...arguments);
    this.cardSearchFocus();
  },

  cardSearchFocus() {
    this.$('#search-txt').focus().select();
  },

  sendApplicationCommand(command) {
    if (ipc === null) return;

    command = command.substr(1, command.length - 2);

    ipc.send(`application-cmd-${command}`);
  },

  placeholderText: computed(() => {
    return `Type a card name, e.g. "${exampleCards.randomElement()}"`;
  }),

  performSearch() {
    const search = this.get('search');
    this.cardSearchFocus();
    if (search.startsWith(':') && search.endsWith(':')) {
      this.sendApplicationCommand(search);
      this.set('search', '');
      return;
    }

    this.set('query', this.get('search'));
  },

  keyDown(event) {
    const code = event.which;

    if (code === 27) {
      // escape pressed, let's send the application node process the `hide`
      // command.
      this.sendApplicationCommand(':hide:');
    } else if(code === 13) {
      this.performSearch();
    }
  },

});
