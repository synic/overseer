import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
const ipc = (window.requireNode !== undefined) ?
      window.requireNode('electron').ipcRenderer : null;

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

  cardsLoaded(search, cards) {
    this.setProperties({
      cards,
      search,
      performedSearch: search,
    });
    this.cardSearchFocus();
  },

  sendApplicationCommand(command) {
    if (ipc === null) return;

    command = command.substr(1, command.length - 2);

    ipc.send(`application-cmd-${command}`);
  },

  searchCardsTask: task(function* (search) {
    if([':debug:', ':exit:', ''].includes(search)) {
      this.cardsLoaded('', []);
      yield null;
    } else {
      yield this.get('store').query('card', {
        name: search,
        contains: 'imageUrl',
      }).then((results) => {
        this.cardsLoaded(search, results);
      });
    }
  }).restartable(),

  // actions
  actions: {
    searchTextInputAction(code, event) {
      const search = this.get('search');

      if (code === 27) {
        // escape pressed, let's send the application node process the `hide`
        // command.
        this.sendApplicationCommand(':hide:');
      } else if(code === 13) {

        // if the search terms begin with `:` and end with `:` (for example,
        // `:debug`:, it's a special command we should send to the electron
        // node process.
        if (search.startsWith(':') && search.endsWith(':')) {
          if (event !== undefined) {
            event.preventDefault();
          }
          this.sendApplicationCommand(search);
        } else {
          // perform the actual search
          this.get('searchCardsTask').perform(search);
        }
      }
    },
  }
});
