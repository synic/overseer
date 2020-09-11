import Vue from 'vue';
import axios from 'axios';

import Overseer from './overseer';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { Overseer },
  router,
  store,
  template: '<Overseer/>',
}).$mount('#app');
