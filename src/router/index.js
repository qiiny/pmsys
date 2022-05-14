import Vue from 'vue'
import VueRouter from 'vue-router'
//引入login组件
import Login from '../components/Login.vue'
import Home from '../components/Home'
import admin from "./admin";
import UserNavbar from "../components/UserNavbar";
import UserFee from "../components/User/UserFee";
import UserRepair from "../components/User/UserRepair";
import index from "../components/User/index";
import Test2 from "../components/User/Test2";
import UserLogin from "../components/UserLogin";
import Register from "../components/Register";
import * as path from "path";
import Welcome from "../components/Welcome";
import test2 from "../components/User/edit";
import Details from "../components/User/Details";
import Complaint from "../components/User/complaint";
import Article from "../components/User/article";
import edit from "../components/User/edit";

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/admin",
        component: Login
    },
    {
        path: "/register",
        component: Register
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: "/welcome",
        children: [
            ...admin
        ],
    },
    {
        path: '/userIndex',
        component: UserNavbar,
        redirect: '/fee',
        children: [
            {path: "/fee", component: UserFee},
            {path: "/repair", component: UserRepair},
            {path: "/index", component: index},
            {path: "/test", component: edit},
            {path: "/details",component: Details},
            {path: "/tousu",component: Complaint},
            {path: "/article",component: Article},

        ]
    }
]

const router = new VueRouter({
    routes,
    mode: "history"
})
//出问题的时候使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

/**
 * 挂载路由导航守卫
 * to 将要访问
 * from 从哪访问
 * next 接着干 next(url) 重定向 next() 继续访问 to路径
 */
// router.beforeEach((to, from, next) => {
//     let isLogin = window.sessionStorage.getItem('user');
//     if (isLogin) {
//         //如果用户信息存在则往下执行。
//         next()
//     } else {
//         //如果用户token不存在则跳转到login页面
//         if (to.path === '/login'||to.path==='/admin') {
//             next()
//         } else {
//             next('/login')
//         }
//     }
// })

export default router
