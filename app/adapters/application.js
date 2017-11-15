// https://docs.magicthegathering.io
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'v1',
  host:      'https://api.magicthegathering.io',
});
