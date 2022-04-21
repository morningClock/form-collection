import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import { Form, Field, Button, Uploader, Toast, Empty } from 'vant';

Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(Uploader);
Vue.use(Toast);
Vue.use(Empty);

import http from './api/request'
Vue.prototype.$http = http;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
