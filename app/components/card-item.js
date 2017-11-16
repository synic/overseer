import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    this._super(...arguments);
    const img = this.$('.card-img');
    const cardImageUrl = this.$('.card-image-url');

    img.one('load', () => {
      img.addClass('card-img-loaded');
    });

    img.attr('src', cardImageUrl.val());
  }
});
