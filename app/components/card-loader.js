import Component from '@ember/component';
import { get, set } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store:                 service(),
  classNames:            ['card-search'],
  results:               [],
  lastQuery:             null,

  didReceiveAttrs() {
    let query = get(this, 'query');
    get(this, 'fetchData').perform(query);
  },

  fetchData: task(function*(query) {
    if (isBlank(query)) {
      return;
    }

    yield get(this, 'store').query('card', {
      name: query,
      contains: 'imageUrl',
    }).then((results) => {
      set(this, 'lastQuery', query);
      return set(this, 'results', results);
    });
  }).restartable(),
});
