import Ember from 'ember';

export default Ember.Component.extend({
  keyDown(event) {
    this.sendAction('searchTextInputAction', event.which, event);
  },
});
