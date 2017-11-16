import DS from 'ember-data';

export default DS.Model.extend({
  name:         DS.attr('string'),
  type:         DS.attr('string'),
  manaCost:     DS.attr('string'),
  power:        DS.attr('number'),
  toughness:    DS.attr('number'),
  text:         DS.attr('string'),
  flavor:       DS.attr('string'),
  setName:      DS.attr('string'),
  set:          DS.attr('string'),
  rarity:       DS.attr('string'),
  imageUrl:     DS.attr('string'),
  legalities:   DS.attr('card-legalities'),
  multiverseid: DS.attr('number'),
});
