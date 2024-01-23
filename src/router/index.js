import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import EPQAdultPage from '@/components/EPQAdultPage.vue'
import EPQChildrenPage from '@/components/EPQChildrenPage.vue'
import SDSPage from '@/components/SDSPage.vue'
import SASPage from '@/components/SASPage.vue'
import SCL90Page from '@/components/SCL90Page.vue'
import CSQPage from '@/components/CSQPage.vue'
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
    },
    {
      path: RouterPath.SDS.path,
      name: RouterPath.SDS.name,
      component: SDSPage
    },
    {
      path: RouterPath.SAS.path,
      name: RouterPath.SAS.name,
      component: SASPage
    },
    {
      path: RouterPath.SCL90.path,
      name: RouterPath.SCL90.name,
      component: SCL90Page
    },
    {
      path: RouterPath.CSQ.path,
      name: RouterPath.CSQ.name,
      component: CSQPage
    }
  ]
})
