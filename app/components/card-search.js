import Ember from 'ember';
import { task } from 'ember-concurrency';
const ipc = (window.requireNode !== undefined) ? window.requireNode('electron').ipcRenderer : {};


export default Ember.Component.extend({
  store:           Ember.inject.service(),
  cards:           null,
  searchPerformed: null,

  searchCards: task(function* (search) {
    if([':debug:'].includes(search)) {
      Ember.$('#search-txt').focus().select();
      yield null;
    } else {
      yield Ember.get(this, 'store').query('card', {
        name: search,
        contains: 'imageUrl',
      }).then((results) => {
        Ember.set(this, 'cards', results);
        Ember.set(this, 'searchPerformed', search);
        Ember.$('#search-txt').focus().select();
      });
    }
  }).restartable(),

  init() {
    this._super(...arguments);
    this.rendered = false;
  },

  keyDown: function(event) {
    if (event.which === 27) {
      // escape pressed, let's hide the window
      ipc.send('mainwindow-hide');
    } else if(event.which === 13) {
      if (this.get('search') === ':debug:') {
        ipc.send('mainwindow-debug');
        event.preventDefault();
      } else if (this.get('search') === ':exit:') {
        ipc.send('application-exit');
        event.preventDefault();
      }
    }
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
});
