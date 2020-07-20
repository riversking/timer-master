<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入内容" v-model="roleName" style="width: 200px" size="small" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="initRoleList">
            搜索
          </el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">

          <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog">
            添加角色
          </el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-table
            :data="roleList"
            v-loading="loading"
            border
            stripe
            size="medium"
          >
            <af-table-column
              prop="id"
              label="#"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="roleName"
              label="角色名称"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="roleCode"
              label="角色编号"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="roleDesc"
              label="角色描述"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="createTime"
              label="创建时间"
              align="center"
            >
            </af-table-column>
            <af-table-column align="center" width="194px" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-s-fold"
                  @click="handleMenu(scope.$index, scope.row)">添加权限
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
        </el-col>
      </el-row>
      <el-dialog
        title="title"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <el-form :model="roleForm" :disabled="detail" ref="roleForm" label-position="left" label-width="80px"
                 style="margin-left: 50px;">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="roleForm.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!detail">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'role',
    data() {
      return {
        roleList: [],
        page: 1,
        size: 10,
        loading: true,
        total: 0,
        dialogVisible: false,
        edit: false,
        roleForm: {
          roleName: '',
          roleCode: '',
          roleDesc: ''
        },
        detail: false,
        roleName: ''
      }
    },
    mounted() {
      this.initRoleList();
    },
    methods: {
      initRoleList() {
        let query = {
          roleName: this.roleName,
          page: this.page,
          pageSize: this.size,
        }
        this.$store.dispatch('getRolePage', {
          'param': query
        }).then(resp => {
          if (resp.code === '0') {
            this.roleList = resp.data.records;
            this.total = resp.data.total;
            this.loading = false;
          }
        });
      },
      currentChange(currentPage) {
        this.page = currentPage;
        this.initRoleList();
      },
      sizeChange(currentSize) {
        this.size = currentSize;
        this.initRoleList();
      },
      showDialog() {
        this.dialogVisible = true;
        this.edit = true;
      },
      closeDialog() {
        this.dialogVisible = false;
        this.$refs['roleForm'].resetFields();
      },
      addRole() {
        let obj = {
          'roleName': this.roleForm.roleName,
          'roleCode': this.roleForm.roleCode,
          'roleDesc': this.roleForm.roleDesc
        };
        this.$store.dispatch("addRole", obj
        ).then(resp => {
          if (resp.code === '0') {
            this.dialogVisible = false
            this.initRoleList()
          }
        });
      },
      handleEdit(index, row) {
        this.edit = false;
        this.detail = false
        this.getRoleById(row.id);
      },
      handleDelete(index, row) {
        this.$store.dispatch('deleteRole', {'param': row.id})
          .then(res => {
            this.initRoleList();
          })
      },
      getRoleById(id) {
        this.$store.dispatch('getRoleById', {'param': id})
          .then(res => {
            this.roleForm = res.data;
            this.dialogVisible = true
          })
      },
      handleMenu(index, row) {

      }
    }
  }
</script>
