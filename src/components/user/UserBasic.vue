<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <div>
        <div style="display: flex;justify-content: space-between">
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
            <el-button type="primary" icon="el-icon-upload2" size="small" @click="showUploadDialog">
              导入用户
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="small" @click="exportUserExcel">
              导出用户
            </el-button>
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
          v-loading="loading"
          border
          stripe
          size="medium"
        >
          <af-table-column
            prop="id"
            label="#"
            align="center"
          />
          <af-table-column
            prop="username"
            label="用户名"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="showDetail(scope.$index, scope.row)"
              >{{scope.row.username}}
              </el-button>
            </template>
          </af-table-column>
          <af-table-column
            prop="userId"
            label="工号"
            align="center"
          />
          <af-table-column
            prop="nickname"
            label="姓名"
            align="center"
          />
          <af-table-column
            prop="phone"
            label="手机"
            align="center"
          />
          <af-table-column
            prop="roles"
            label="角色"
            align="center"
          >
            <template slot-scope="scope">
              <div slot="reference" class="tag-group">
                <el-tag v-for="item in scope.row.sysRoleModels" :key="item.id" style="margin-right: 5px">{{
                  item.roleName
                  }}
                </el-tag>
              </div>
            </template>
          </af-table-column>
          <af-table-column
            prop="isDisable"
            label="状态"
            :formatter="statusFormatter"
            align="center"
          />
          <af-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          />
          <af-table-column align="center" width="388px" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-plus"
                @click="handleChangePwd(scope.$index, scope.row)">修改密码
              </el-button>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-thumb"
                @click="handleDisable(scope.$index, scope.row)">有效
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </af-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end;margin-top: 8px">
          <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <div>
          <el-form :model="userForm" :disabled="detail" ref="userForm" label-position="right" label-width="80px"
                   style="margin-left: 50px;">
            <el-row>
              <el-col :span="24">
                <el-form-item label="用户名:" prop="username">
                  <el-input size="medium" v-model="userForm.username" style="width: 80%" prefix-icon="el-icon-edit"
                            auto-complete="new-accounts"
                            placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="密码:" prop="password" v-if="edit===false && detail === false">
                  <el-input size="medium" v-model="userForm.password" style="width: 80%" prefix-icon="el-icon-edit"
                            auto-complete="new-password"
                            placeholder="请输入密码" show-password></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="工号:" prop="userId">
                  <el-input size="medium" v-model="userForm.userId" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入工号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="手机号:" prop="phone">
                  <el-input size="medium" v-model="userForm.phone" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="!edit">
                <el-form-item label="邮箱:" prop="mail">
                  <el-input size="medium" type="mail" v-model="userForm.mail" style="width: 80%"
                            prefix-icon="el-icon-edit"
                            placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="!edit">
                <el-form-item label="姓名:" prop="nickname">
                  <el-input size="medium" v-model="userForm.nickname" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="头像:" prop="upload">
                  <div class="block" v-if="detail">
                    <el-avatar shape="square" :size="158" :src="'api/v1/image/'+file"></el-avatar>
                  </div>
                  <el-upload
                    v-if="detail === false"
                    class="upload-demo"
                    action="api/file/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    ref="upload"
                    :file-list="fileList"
                    list-type="picture"
                    :limit=1
                    :on-exceed="handleExceed"
                  >
                    <el-button size="small" v-if="detail === false" type="primary">点击上传</el-button>
                    <div slot="tip" v-if="detail === false" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="角色:" prop="role">
                  <el-select v-model="userForm.roleIds" multiple placeholder="请选择">
                    <el-option
                      v-for="item in roles"
                      :key="item.roleName"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="edit==false" @click="addUser">确 定</el-button>
          <el-button type="primary" v-if="edit" @click="editUser">编 辑</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="添加角色"
        :visible.sync="pwdVisible"
        :destroy-on-close="true"
      >
        <el-row>
          <el-form status-icon ref="ruleForm" label-width="50px" class="demo-ruleForm">
            <el-form-item label="角色">
              <el-select v-model="roleForm.ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in roles"
                  :key="item.roleName"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pwdVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleByUserId">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogUpload"
        :destroy-on-close="true"
        @close="closeUpload"
        width="25%">
        <el-row>
          <el-col :span="8" style="text-align: right">
            导入用户:
          </el-col>
          <el-col :span="12" style="text-align: left;margin-left: 5px">
            <el-upload
              class="upload-demo"
              action="api/file/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              ref="uploadFile"
              :file-list="uploadFileList"
              :limit=1
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
            </el-upload>
            <a :href="`static/template.xlsx`" target="_blank" download="template.xlsx">点击下载模板</a>
          </el-col>
        </el-row>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import {getToken} from "../../utils/util";

  export default {
    name: 'user',
    data() {
      return {
        userList: [],
        keyword: '',
        showAdvanceSearchView: false,
        phone: '',
        searchDate: '',
        dialogVisible: false,
        pwdVisible: false,
        userForm: {
          id: '',
          username: '',
          password: '',
          userId: '',
          phone: '',
          roleIds: [],
          nickname: '',
          mail: ''
        },
        fileList: [],
        uploadFileList: [],
        file: '',
        roles: [],
        total: 0,
        page: 1,
        size: 10,
        edit: false,
        title: '添加用户',
        detail: false,
        roleForm: {
          ids: []
        },
        userId: '',
        loading: true,
        dialogUpload: false,
      }
    },
    mounted() {
      this.initUserList();
      this.getRoles();
    },
    methods: {
      initUserList() {
        let query = {
          page: this.page,
          pageSize: this.size,
          username: this.keyword,
          phone: this.phone,
          startDate: this.searchDate[0],
          endDate: this.searchDate[1],
        };
        this.$store.dispatch('userPage', {
          'param': query
        }).then(resp => {
          if (resp.code === '0') {
            this.userList = resp.data.records;
            this.total = resp.data.total;
            this.loading = false;
          } else {
            this.$message.warning(resp.message);
          }
        });
      },
      showDialog() {
        this.fileList = [];
        this.dialogVisible = true;
        this.title = '添加用户';
        this.userForm = {}
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(fileList) {
        this.file = fileList.rsp.filename
        console.log('fileList', fileList)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      getRoles() {
        this.$store.dispatch('roleList').then(resp => {
          if (resp.code === '0') {
            this.roles = resp.data
          } else {
            this.$message.warning(resp.message);
          }
        });
      },
      addUser() {
        let obj = {
          'username': this.userForm.username,
          'password': this.userForm.password,
          'userId': this.userForm.userId,
          'phone': this.userForm.phone,
          'avatar': this.file,
          'createUser': this.$store.state.userInfo.username,
          'roleIds': this.userForm.roleIds
        };
        this.$store.dispatch("addUser", {
          'param': obj
        }).then(resp => {
          if (resp.code === '0') {
            this.dialogVisible = false
            this.initUserList()
          } else {
            this.$message.warning(resp.message);
          }
        });
      },
      handleEdit(index, row) {
        this.edit = true;
        this.detail = false;
        this.title = '编辑用户';
        this.getUser(row.id);
      },
      handleChangePwd(index, row) {
        this.pwdVisible = true
        this.userId = row.id
      },
      handleDisable(index, row) {
        let obj = {
          'id': row.id,
          'isDisable': row.isDisable === 0 ? 1 : 0
        };
        this.$store.dispatch('isDisable', {'param': obj}).then(res => {
          this.initUserList()
        })
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteUser', {'param': row.id})
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.initUserList()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      currentChange(currentPage) {
        this.page = currentPage;
        this.dialogVisible = true;
        this.initUserList();
      },
      sizeChange(currentSize) {
        this.size = currentSize;
        this.dialogVisible = true;
        this.initUserList();
      },
      statusFormatter(row, column) {
        let status = row.isDisable;
        if (status === 0) {
          return '有效'
        } else {
          return '失效'
        }
      },
      getUser(id) {
        this.$store.dispatch('getUserById', {'param': id})
          .then(res => {
            this.userForm = res.data;
            this.fileList.push({
              'name': res.data.avatar,
              'url': 'api/v1/image/' + res.data.avatar
            });
            this.file = res.data.avatar;
            this.dialogVisible = true;
          })
      },
      editUser() {
        let obj = {
          'id': this.userForm.id,
          'userId': this.userForm.userId,
          'phone': this.userForm.phone,
          'username': this.userForm.username,
          'avatar': this.file,
          'updateUser': this.$store.state.userInfo.username,
          'roleIds': this.userForm.roleIds,
          'mail': this.userForm.mail,
          'nickname': this.userForm.nickname,
        };
        this.$store.dispatch('updateUserById', {'param': obj})
          .then(res => {
            if (res.code === '0') {
              this.dialogVisible = false;
              this.initUserList()
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      closeDialog() {
        this.dialogVisible = false
        this.edit = false
        this.detail = false
        this.fileList = []
        this.$refs['userForm'].resetFields();
      },
      showDetail(index, row) {
        this.edit = false;
        this.detail = true
        this.title = '用户详情';
        this.getUser(row.id);
      },
      addRoleByUserId() {
        let obj = {
          'userId': this.userId,
          'roleIds': this.roleForm.ids
        };
        this.$store.dispatch('addRoleByUserId', {'param': obj})
          .then(res => {
            if (res.code === '0') {
              this.pwdVisible = false;
              this.initUserList()
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      showUploadDialog() {
        this.dialogUpload = true
      },
      closeUpload() {
        this.dialogUpload = false
      },
      exportUserExcel() {
        let excelName = "用户列表.xlsx"
        axios({
          method: 'GET',
          url: 'api/file/exportUser',
          // params: params,
          headers: {
            "Authorization": 'Bearer ' + getToken()
          },
          responseType: 'arraybuffer'
        }).then(res => {
          const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const aEle = document.createElement('a');     // 创建a标签
          const href = window.URL.createObjectURL(blob);       // 创建下载的链接
          aEle.href = href;
          aEle.download = excelName;  // 下载后文件名
          document.body.appendChild(aEle);
          aEle.click();     // 点击下载
          document.body.removeChild(aEle); // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
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
