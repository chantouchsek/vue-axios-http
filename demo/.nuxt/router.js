import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _fcd93ff6 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _792e308b = () => interopDefault(import('../pages/secure.vue' /* webpackChunkName: "pages/secure" */))
const _3ab532a7 = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _90288624 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/login",
    component: _fcd93ff6,
    name: "login"
  }, {
    path: "/secure",
    component: _792e308b,
    name: "secure"
  }, {
    path: "/users",
    component: _3ab532a7,
    name: "users"
  }, {
    path: "/",
    component: _90288624,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
