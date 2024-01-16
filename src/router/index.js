import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import EPQAdultPage from '@/components/EPQAdultPage.vue'
import EPQChildrenPage from '@/components/EPQChildrenPage.vue'
import {RouterPath} from '@/const/RouterPath'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: RouterPath.EPQAdult.path,
      name: RouterPath.EPQAdult.name,
      component: EPQAdultPage
    },
    {
      path: RouterPath.EPQChildren.path,
      name: RouterPath.EPQChildren.name,
      component: EPQChildrenPage
    }
  ]
})
