import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'card-search',
      component: require('@/components/CardSearch').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
