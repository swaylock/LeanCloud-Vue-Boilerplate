// Source code from:
// https://github.com/zgldh/vuejs-laravel/blob/master/frontend%2Fsrc%2Fcomponents%2Fresources.js

import Vue from 'vue'
import VueResource from 'vue-resource'
import NProgress from 'nprogress'
import router from './router'

NProgress.configure({ showSpinner: false })

Vue.use(VueResource)
Vue.http.options.root = 'api'  // No tail slash

// Vue.http.options.emulateHTTP = true
// Vue.http.options.emulateJSON = true

Vue.http.interceptors.push({
  request: function (request) {
    if (/https?:\/\//.test(request.url) === false) {
      let xsrfToken = getXsrfToken()
      if (xsrfToken) {
        request.headers['X-XSRF-TOKEN'] = xsrfToken
      }
    }
    NProgress.start()
    return request
  },

  response: function (response) {
    NProgress.done()
    if (response.status === 401) {
      let returnUrl = this.$route.query.returnUrl || this.$route.path
      if (returnUrl === '/login')
        returnUrl = undefined
      router.go({
        path: '/login',
        query: {returnUrl}
      })
    }
    return response
  }
})

function getCookie (c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=')
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1
      let c_end = document.cookie.indexOf(';', c_start)
      if (c_end === -1) c_end = document.cookie.length
      return decodeURIComponent(document.cookie.substring(c_start, c_end))
    }
  }
  return ''
}

function getXsrfToken () {
  return getCookie('XSRF-TOKEN')
}

export default {
  resource: VueResource,
  getXsrfToken: getXsrfToken
}