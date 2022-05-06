import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

import './plugins/element.js'
//添加样式
import './assets/css/global.css'
//添加图标
import './assets/font/iconfont.css'
//导入axios
import axios from "axios";
//挂载axios
Vue.prototype.$http=axios
//设置访问根路径
axios.defaults.baseURL="http://localhost:9000"

Vue.prototype.$moment = Moment
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


