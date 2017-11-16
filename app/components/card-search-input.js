import Ember from 'ember';
import { task } from 'ember-concurrency';
const ipc = (window.requireNode !== undefined) ?
      window.requireNode('electron').ipcRenderer : {};

export default Ember.Component.extend({
  store:           Ember.inject.service(),

  keyDown(event) {
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

  searchCardsTask: task(function* (search) {
    if([':debug:', ':exit:', ''].includes(search)) {
      this.set('search', '');
      this.sendAction('cardsDidLoad', '', []);
      this.sendAction('cardSearchFocus');
      yield null;
    } else {
      yield this.get('store').query('card', {
        name: search,
        contains: 'imageUrl',
      }).then((results) => {
        this.sendAction('cardsDidLoad', search, results);
        this.sendAction('cardSearchFocus');
      });
    }
  }).restartable(),

});
