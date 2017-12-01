import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';

export const AppQueryParams = new QueryParams({
  query: {
    as: 'q',
    defaultValue: '',
    refresh: true,
  },
});

export default Controller.extend({
});
