import Ember from 'ember';
import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';
const { computed: { or } } = Ember;

export const AppQueryParams = new QueryParams({
  query: {
    as: 'q',
    defaultValue: '',
    refresh: true,
  },
});

export default Controller.extend(AppQueryParams.Mixin, {
  queryParamsChanged: or('queryParamsState.{query}.changed')
});
