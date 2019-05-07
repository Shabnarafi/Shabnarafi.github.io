import Vue from 'vue' // Import Vue from node_modules
import Router from 'vue-router' // Import Vue Router from node_modules
import Home from '../components/Home' //The Home component that's in charge of everything we see on the app's homepage
import Dashboard from '../components/Dashboard' //The Home component that's in charge of everything we see on the app's homepage

//Specify that we want to use Vue Router
Vue.use(Router)

const scrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}

    // scroll to # by returning the selector
    if (to.hash) {
      position.selector = to.hash,
        position.offset = {x: 0, y: 200}


      if (document.querySelector(to.hash)) {
        return position
      }

      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      return false
    }

    return new Promise(resolve => {
      // check if any matched route config has meta that requires scrolling to top
      if (to.matched.some(m => m.meta.scrollToTop)) {
        // coords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0
        position.y = 0
      }

      // wait for the out transition to complete (if necessary)
      this.app.$root.$once('triggerScroll', () => {
        // if the resolved position is falsy or an empty object,
        // will retain current scroll position.
        resolve(position)
      })

    })
  }
}

export default new Router({
  mode: 'history',
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          title: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'dashboard#build-health-trend-chart',
          name: 'stability',
          title: 'stability',
          component: Dashboard,
          meta: {scrollToTop: true}
        },
        {
          path: 'dashboard#build-vs-feature',
          name: 'feature Trend',
          title: 'feature Trend',
          component: Dashboard
        },
        {
          path: 'dashboard#EPGPerformance',
          name: 'EPGPerformance',
          title: 'EPGPerformance',
          component: Dashboard
        },
        {
          path: 'dashboard#BasicParameters',
          name: 'BasicParameters',
          title: 'BasicParameters',
          component: Dashboard
        },
        {
          path: 'dashboard#MenuNavigation',
          name: 'MenuNavigation',
          title: 'MenuNavigation',
          component: Dashboard
        },
        {
          path: 'dashboard#Connectivity',
          name: 'Connectivity',
          title: 'Connectivity',
          component: Dashboard
        },
        {
          path: 'dashboard#Key_Response',
          name: 'Key_Response',
          title: 'Key_Response',
          component: Dashboard
        },
        {
          path: 'dashboard#LaunchAppScreens',
          name: 'LaunchAppScreens',
          title: 'LaunchAppScreens',
          component: Dashboard
        },
        {
          path: 'dashboard#build-health-trend-chart-func',
          name: 'Functional Health',
          title: 'Functional Health',
          component: Dashboard
        },
        {
          path: 'dashboard#build-vs-feature-func',
          name: 'Functional Status',
          title: 'Functional Status',
          component: Dashboard
        }
      ]
    }
  ]
})
