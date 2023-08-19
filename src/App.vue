<template>
  <div id="app">
    <router-view v-if="$route.name === 'Login'"></router-view>
    <el-container v-else style="height: 100vh">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router unique-opened default-active="1">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>首页</template>
            <el-menu-item-group>
              <el-menu-item route="/" index="">首页</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
         </el-menu>
      </el-aside>
      <el-container>
        <el-header style="font-size: 12px" class="d-flex jc-between al-center">
          <div
            style="float: left; font-size: 18px; font-weight: 500; color: #333"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                :key="index"
                :to="{
                  path: index === navList.length - 1 ? fullPath : item.path,
                }"
                v-for="(item, index) in navList"
                >{{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>
            <span>{{ useName }}</span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-left: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="out">登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
export default {
  data() {
    return {
      tableData: [],
      navList: [],
      fullPath: "",
    };
  },

  computed: {
    useName() {
      return localStorage.getItem("userName");
    },
  },
  mounted() {
    // console.log(this.$router)
  },
  watch: {
    $route() {
      this.navList = this.$route.matched;
      this.fullPath = location.hash.replace("#", "");
    },
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push({ path: `/login` });
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "out") {
        localStorage.removeItem("token");
        this.$router.push({ path: `/login` });
      }
    },
  },
};
</script>
