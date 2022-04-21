import Vue from 'vue'
import Router from 'vue-router'

import Form from '@/views/FormCollection'
import SuccessPage from '@/views/SuccessPage'
import NotFound from '@/views/NotFound'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/form',
      component: Form,
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessPage,
    },
    {
      path: '*',
      component: NotFound
    }

  ]
})


export default router