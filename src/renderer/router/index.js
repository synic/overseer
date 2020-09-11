import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'card-search',
      component: require('@/components/card-search/card-search').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
