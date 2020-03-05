<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between;margin-top: 10px">
        <div>
          <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                    clearable
                    size="small"
                    @clear="initUserList"
                    style="width: 350px;margin-right: 10px" v-model="keyword"
                    @keydown.enter.native="initUserList"
                    :disabled="showAdvanceSearchView"
          ></el-input>
          <el-button icon="el-icon-search" type="primary" @click="initUserList" size="mini"
                     :disabled="showAdvanceSearchView">
            搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView" size="mini">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog">
            添加用户
          </el-button>
        </div>
      </div>
      <transition name="el-fade-in-linear">
        <div v-show="showAdvanceSearchView" class="transition-box">
          <div v-show="showAdvanceSearchView"
               style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
            <el-row>
              <el-col :span="9">
                手机号:
                <el-input placeholder="请输入手机号进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                          clearable
                          size="small"
                          @clear="initUserList"
                          style="width: 350px;margin-right: 10px" v-model="phone"
                          @keydown.enter.native="initUserList"
                ></el-input>
              </el-col>
              <el-col :span="9">
                创建时间:
                <el-date-picker
                  v-model="searchDate"
                  type="daterange"
                  size="small"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <el-col :span="5">
                <el-button icon="el-icon-search" type="primary" @click="initUserList" size="mini">
                  搜索
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="userList"
        border
        stripe
        size="small"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="工号"
          align="left"
          width="85px"/>
        <el-table-column
          prop="username"
          label="用户名"
          align="left"
          width="85px"/>
        <el-table-column
          prop="phone"
          label="手机"
          align="left"
          width="110px"/>
        <el-table-column
          prop="roles"
          label="角色"
          align="left"
          width="200px"
        >
          <template slot-scope="scope">
            <div slot="reference" class="tag-group">
              <el-tag v-for="item in scope.row.sysRoleModels" :key="item.id" style="margin-right: 5px">{{
                item.roleName
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="创建人"
          align="left"
          width="110px"/>
        <el-table-column
          prop="updateUser"
          label="更新人"
          align="left"
          width="110px"/>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="left"
          width="156px"/>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="left"
          width="156px"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="80%">
      <div>
        <el-form :model="userForm" ref="empForm" label-position="left" label-width="80px" style="margin-left: 50px;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户名:" prop="name">
                <el-input size="mini" style="width: 80%" prefix-icon="el-icon-edit" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="密码:" prop="name">
                <el-input size="mini"  style="width: 80%" prefix-icon="el-icon-edit" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userList: [],
        keyword: '',
        showAdvanceSearchView: false,
        phone: '',
        searchDate: '',
        dialogVisible: false,
        userForm: {
          username: '',
          password: '',
          phone: '',
          roleIds: []
        }
      }
    },
    mounted() {
      this.initUserList();
    },
    methods: {
      initUserList() {
        let query = {
          page: 1,
          pageSize: 20,
          username: this.keyword,
          phone: this.phone,
          startDate: this.searchDate[0],
          endDate: this.searchDate[1],
        };
        this.$store.dispatch('userPage', {
          'param': query
        }).then(resp => {
          if (resp.code === '0') {
            this.userList = resp.data.records
            console.log()
          }
        });
      },
      showDialog() {
        this.dialogVisible = true
      }
    }
  }
</script>
<style>
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
