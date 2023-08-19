import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "../views/LoginPage";


Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    name: "首页",
    component: () => import('../views/ChannelManage/H5ChannelList.vue'),
        meta: {
          keepAlive: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name != "Login" && !localStorage.getItem("token")) {
    next({
      name: "Login",
      query: {
        redirect: to.fullPath,
      },
    });
  } else {
    next();
  }
});


export default router;
