import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Activity from '../components/activity/Activity.vue'
import Publish from '../components/activity/Publish.vue'
import UserPage from '../components/user/UserPage.vue'
import Error from '../components/error/Error.vue'
import Pwd from '../components/user/Pwd.vue'
// import Users from '../components/user/Users.vue'
import Activities from '../components/activity/Activities.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/activities',
    children: [
      {
        path: '/activities',
        component: Activities
      },
      {
        path: '/publish',
        component: Publish
      },
      {
        path: '/user/findPassword',
        component: Pwd
      },
      {
        name: 'user',
        path: '/user/:uid',
        component: UserPage
      },

      {
        path: '/activities/:aid',
        component: Activity
      }
    ]
  },
  {
    path: '*',
    component: Error
  }
]

const router = new VueRouter({
  routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router
