<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入角色名称" v-model="roleName" style="width: 200px" size="small" clearable></el-input>
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
              width="75px"
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
            <af-table-column align="center" label="操作" width="402px">
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
                  icon="el-icon-s-unfold"
                  @click="handlePermission(scope.$index, scope.row)">添加权限
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
        :title="title"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <el-form :model="roleForm" :disabled="detail" ref="roleForm" label-position="left" label-width="80px"
                 style="margin-left: 50px;">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="roleForm.roleCode" placeholder="请输入角色编号"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc" placeholder="请输入角色介绍"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!detail">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="!edit" @click="addRole">确 定</el-button>
          <el-button type="primary" v-if="edit" @click="editRole">编 辑</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="添加权限"
        :visible.sync="permissionVisible"
        :destroy-on-close="true"
        @close="closePermissionDialog"
        width="80%">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          :data="menuList"
          node-key="id"
          ref="tree"
          :default-checked-keys="defaultList"
          :filter-node-method="filterNode"
          default-expand-all
          show-checkbox
        >
        </el-tree>
        <div slot="footer" class="dialog-footer" v-if="!detail">
          <el-button @click="permissionVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenu">确 定</el-button>
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
        permissionVisible: false,
        edit: true,
        roleForm: {
          id: '',
          roleName: '',
          roleCode: '',
          roleDesc: ''
        },
        detail: false,
        roleName: '',
        title: '',
        menuList: [],
        defaultList: [],
        roleId: '',
        menuIds: [],
        filterText: ''
      }
    },
    mounted() {
      this.initRoleList();
    },
    methods: {
      initRoleList() {
        this.loading = true;
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
          } else {
            this.$message.warning(resp.message);
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
        this.edit = false;
        this.title = "添加角色"
        this.roleForm = {}
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
          } else {
            this.$message.warning(resp.message);
          }
        });
      },
      handleEdit(index, row) {
        this.edit = true;
        this.detail = false;
        this.title = "编辑角色"
        this.getRoleById(row.id);
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteRole', {'param': row.id})
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.initRoleList();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getRoleById(id) {
        this.$store.dispatch('getRoleById', {'param': id})
          .then(res => {
            this.roleForm = res.data;
            this.dialogVisible = true
          })
      },
      handlePermission(index, row) {
        this.permissionVisible = true
        this.roleId = row.id
        this.getMenuByRoleId(row.id)
      },
      editRole() {
        let obj = {
          'id': this.roleForm.id,
          'roleName': this.roleForm.roleName,
          'roleCode': this.roleForm.roleCode,
          'roleDesc': this.roleForm.roleDesc
        };
        this.$store.dispatch('editRole', obj)
          .then(res => {
            if (res.retCode === 0) {
              this.dialogVisible = false;
              this.initRoleList()
            } else {
              this.$message.warning(res.retMsg);
            }
          })
      },
      getMenuByRoleId(id) {
        this.$store.dispatch('getMenuByRoleId', {"param": id})
          .then(res => {
            if (res.code === '0') {
              this.menuList = res.data.list
              this.defaultList = res.data.checkedMenu
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      closePermissionDialog() {
        this.defaultList = []
      },
      addMenu() {
        let obj = {
          roleId: this.roleId,
          menuIds: this.$refs.tree.getCheckedKeys()
        }
        this.$store.dispatch('updateByRoleId', {"param": obj})
          .then(res => {
            if (res.code === '0') {
              this.permissionVisible = false;
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    }
  }
</script>
