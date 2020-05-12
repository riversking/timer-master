<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog">
            添加菜单
          </el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-table
            :data="menuTree"
            border
            stripe
            size="medium"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <af-table-column
              prop="id"
              label="编号"
              align="center"
              >
            </af-table-column>
            <af-table-column
              prop="name"
              label="名称"
              align="center"
              >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDetail(scope.$index, scope.row)"
                >{{scope.row.name}}
                </el-button>
              </template>
            </af-table-column>
            <af-table-column
              prop="path"
              label="路由路径"
              align="center"
             >
            </af-table-column>
            <af-table-column
              prop="type"
              label="类型"
              align="center"
              :formatter="typeFormatter"
              >
            </af-table-column>
            <af-table-column
              prop="icon"
              label="图标"
              align="center"
              >
              <template slot-scope="scope">
                <div slot="reference" class="tag-group">
                  <i :class="scope.row.icon"></i>
                </div>
              </template>
            </af-table-column>
            <af-table-column
              prop="code"
              label="权限标识"
              align="center"
              >
            </af-table-column>
            <af-table-column
              prop="sort"
              label="排序"
              align="center"
              >
            </af-table-column>
            <af-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)">编辑
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
        </el-col>
      </el-row>
      <el-dialog
        title="title"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <div>
          <el-form :model="menuForm" :disabled="detail" ref="menuForm" label-position="left" label-width="80px"
                   style="margin-left: 50px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="名称:" prop="name">
                  <el-input size="medium" v-model="menuForm.name" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型:" prop="type">
                  <el-radio v-model="menuForm.type" :label=0 border>菜单</el-radio>
                  <el-radio v-model="menuForm.type" :label=1 border>按钮</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="路径:" prop="path">
                  <el-input size="medium" v-model="menuForm.path" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入路径"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级菜单:" prop="path">
                  <wlTreeSelect
                    width="240"
                    :data="menuTree"
                    @change="handleChanged"
                    v-model="parentMenu"
                  ></wlTreeSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="图标:" prop="icon">
                  <icon-picker v-model="menuForm.icon" style="width: 369.75px;height: 1px"></icon-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序:" prop="sort">
                  <el-input-number v-model="menuForm.sort" controls-position="right" :min="1"
                                   :max="100"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="menuForm.type === 0">
                <el-form-item label="控件:" prop="component">
                  <el-input size="medium" v-model="menuForm.component" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入控件"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="menuForm.type === 1 ">
                <el-form-item label="权限标识:" prop="permission">
                  <el-input size="medium" v-model="menuForm.permission" style="width: 80%" prefix-icon="el-icon-edit"
                            placeholder="请输入权限标识"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer" v-if="!detail">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="edit" @click="addMenu">确 定</el-button>
          <el-button type="primary" v-if="!edit" @click="editMenu">编 辑</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        menuTree: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id'
        },
        dialogVisible: false,
        menuForm: {
          'id': '',
          'name': '',
          'path': '',
          'type': '',
          'icon': '',
          'sort': '',
          'parentId': '',
          'component': '',
          'permission': ''
        },
        detail: false,
        parentMenu: [],
        edit: false
      };
    },
    mounted() {
      this.getMenuTree();
      // this.getParentMenu();
    },
    methods: {
      getMenuTree() {
        this.$store.dispatch('getMenu')
          .then(res => {
            this.menuTree = res.data;
          })
      },
      typeFormatter(row, column) {
        let status = row.type;
        if (status === 0) {
          return '菜单'
        } else {
          return '按钮'
        }
      },
      handleDetail(index, row) {
        this.getMenuById(row.id);
        this.detail = true
      },
      getMenuById(id) {
        this.$store.dispatch('getMenuById', {'param': id})
          .then(res => {
            this.menuForm = res.data;
            this.menuForm.type = res.data.type
            this.dialogVisible = true
          })
      },
      showDialog() {
        this.dialogVisible = true;
        this.edit = true;
      },
      addMenu() {
        let obj = {
          'name': this.menuForm.name,
          'path': this.menuForm.path,
          'type': this.menuForm.type,
          'icon': this.menuForm.icon,
          'sort': this.menuForm.sort,
          'parentId': this.menuForm.parentId,
          'component': this.menuForm.component,
          'permission': this.menuForm.permission,
          'createUser': this.$store.state.userInfo.username
        };
        this.$store.dispatch('addMenu', {'param': obj})
          .then(res => {
            if (res.code === '0') {
              this.dialogVisible = false;
              this.getMenuTree()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error'
              });
            }
          })
      },
      editMenu() {
        let obj = {
          'id': this.menuForm.id,
          'name': this.menuForm.name,
          'path': this.menuForm.path,
          'type': this.menuForm.type,
          'icon': this.menuForm.icon,
          'sort': this.menuForm.sort,
          'parentId': this.menuForm.parentId,
          'component': this.menuForm.component,
          'permission': this.menuForm.permission,
          'updateUser': this.$store.state.userInfo.username
        };
        this.$store.dispatch('updateMenu', {'param': obj})
          .then(res => {
            if (res.code === '0') {
              this.dialogVisible = false
              this.getMenuTree()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error'
              });
            }
          })
      },
      closeDialog() {
        this.dialogVisible = false;
        this.$refs['menuForm'].resetFields();
      },
      handleEdit(index, row) {
        this.edit = false;
        this.detail = false
        this.getMenuById(row.id);
      },
      handleDelete(index, row) {
        this.$store.dispatch('deleteMenu', {'param': row.id}).then(res => {
          this.getMenuTree()
        })
      },
      handleChanged(val) {
        this.menuForm.parentId = val[0].id
      }
    }
  };
</script>
