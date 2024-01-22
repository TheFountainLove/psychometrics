// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Progress, Icon, NavBar, Tab, Tabs, RadioGroup, Radio, Button, Toast} from 'vant'

Vue.use(Progress)
  .use(Icon)
  .use(NavBar)
  .use(Tab)
  .use(Tabs)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Toast)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
