<template>
  <div>
    <el-container class="home-container">
      <el-aside width="180px" class="home-aside" style="overflow-x: hidden;">
        <div class="home-logo">
          <span class="home_title">管理系统</span>
        </div>
        <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
          <el-menu style="background: #ececec;width: 180px;" unique-opened router :default-active="$route.path">
            <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="item.children !== undefined"
                        :key="index">
              <template slot="title">
                <i style="color: #409eff;margin-right: 5px" :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj"
                            @click="addTab(child)">
                <template slot="title">
                  <i style="color: #409eff;margin-right: 5px" :class="child.icon"></i>
                  <span>{{ child.name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-for="(item,index) in routes" v-if="item.children === undefined" :key="index"
                          :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="home-header" style="height: 64px;">
          <span class="home_title"></span>
          <div style="display: flex;align-items: center;margin-right: 7px;">
            <el-badge style="margin-right: 30px" :is-dot="this.$store.state.nfDot">
              <i class="fa fa-bell-o" @click="goChat" style="cursor: pointer"></i>
            </el-badge>
            <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
    {{ user.nickname }}
    <i><img v-if="user.avatar!=''" :src="'api/v1/image/'+user.avatar"
            style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-tabs v-model="editableTabsValue" type="card" style="margin-left: 5px" @tab-click="tabClick"
                 @tab-remove="removeTab">
          <el-tab-pane name="/home" label="首页" key="home"/>
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.title"
            :label="item.title"
            :name="item.path"
            closable
          />
        </el-tabs>
        <el-main class="home-main">
          <!--          <el-breadcrumb separator-class="el-icon-arrow-right">-->
          <!--            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
          <!--            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>-->
          <!--          </el-breadcrumb>-->
          <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
            欢迎来到微人事！
          </div>
          <keep-alive>
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  mounted: function () {
//      this.devMsg();
//       this.loadNF();
    this.activerouter = window.location.pathname;
    this.beforeUnload();
  },
  methods: {
    loadNF() {
      const _this = this;
      this.getRequest("/chat/sysmsgs").then(resp => {
        let isDot = false;
        resp.data.forEach(msg => {
          if (msg.state === 0) {
            isDot = true;
          }
        })
        _this.$store.commit('toggleNFDot', isDot);
      })
    },
    goChat() {
      this.$router.push({path: '/chat'});
    },
    devMsg() {
      this.$alert('为了确保所有的小伙伴都能看到完整的数据演示，数据库只开放了查询权限和部分字段的更新权限，其他权限都不具备，完整权限的演示需要大家在自己本地部署后，换一个正常的数据库用户后即可查看，这点请大家悉知!', '友情提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$notify({
            title: '重要重要!',
            type: 'warning',
            message: '小伙伴们需要注意的是，目前只有权限管理模块完工了，因此这个项目中你无法看到所有的功能，除了权限管理相关的模块。权限管理相关的模块主要有两个，分别是 [系统管理->基础信息设置->权限组] 可以管理角色和资源的关系， [系统管理->操作员管理] 可以管理用户和角色的关系。',
            duration: 0
          });
        }
      });
    },
    handleCommand(cmd) {
      const _this = this;
      if (cmd === 'logout') {
        this.$confirm('注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // _this.getRequest("/logout");
          _this.$store.commit('logout');
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("menu");
          sessionStorage.removeItem("tabView");
          sessionStorage.removeItem("tabViews");
          _this.$router.replace({path: '/'});
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '取消'
          });
        });
      }
    },
    handleSelect: function (a, b) {
      this.reload()  // 点击侧边栏重新载入页面
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    addTab(menu) {
      let exist = false;
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (menu.name === this.editableTabs[i].name) {
          exist = true;
          break;
        }
      }
      if (exist === true) {
        this.editableTabsValue = menu.path;
        sessionStorage.setItem("tabView", menu.path);
        return;
      }
      this.editableTabs.push({
        title: menu.name,
        name: menu.name,
        showItem: menu.showItem,
        content: menu.component,
        path: menu.path
      });
      this.editableTabsValue = menu.path;
      sessionStorage.setItem("tabView", menu.path);
    },
    tabClick(tag) {
      this.$router.push({path: tag.name});
      sessionStorage.setItem("tabView", tag.name);
    },
    // 刷新前缓存tab
    beforeUnload() {
      // 监听页面刷新
      window.addEventListener("beforeunload", () => {
        // visitedViews数据结构太复杂无法直接JSON.stringify处理，先转换需要的数据
        let tabViews = this.editableTabs.map(item => {
          return {
            fullPath: item.fullPath,
            hash: item.hash,
            meta: {...item.meta},
            name: item.name,
            params: {...item.params},
            path: item.path,
            query: {...item.query},
            title: item.title
          };
        });
        sessionStorage.setItem("tabViews", JSON.stringify(tabViews));
      });
      // 页面初始化加载判断缓存中是否有数据
      let oldViews = JSON.parse(sessionStorage.getItem("tabViews")) || [];
      if (oldViews.length > 0) {
        this.editableTabs = oldViews;
      }
      let oldView = sessionStorage.getItem("tabView") || '';
      if (oldView !== '') {
        this.editableTabsValue = oldView
        this.$router.push({path: oldView});
      }
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      let newTab = {}
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.path;
              newTab = {
                name: nextTab.path
              };
            } else {
              activeName = "/home";
              newTab = {
                name: "/home"
              };
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.path !== targetName);
      this.tabClick(newTab)
    }
  },
  data() {
    return {
      isDot: false,
      isRouterAlive: true,
      activerouter: '',
      editableTabsValue: '/home',
      editableTabs: [],
      tabIndex: 2,
      TabsValue: "",
    }
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    }
    ,
    routes() {
      return this.$store.state.routes
    }
  }
}
</script>
<style>
.home-container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  transition: width .2s;
}

.home-header {
  background-color: #20a0ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  height: 64px;
  padding: 0 20px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.home-logo {
  background-color: #3a8ee6;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 0px;
  height: 64px;
}

.home-aside {
  background-color: #ECECEC;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  position: relative;
  transition: width .2s;
  box-sizing: border-box;
}

.home-main {
  position: relative;
  padding: 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
  margin-left: 18px;
}

.home_userinfo {
  color: #fff;
  cursor: pointer;
}

.home_userinfoContainer {
  display: inline;
  margin-right: 20px;
}

.el-submenu .el-menu-item {
  width: 180px;
  min-width: 175px;
}
</style>
