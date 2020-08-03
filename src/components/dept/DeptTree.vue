<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="24" style="text-align: left">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit">编辑</el-button>
            <el-button type="primary" icon="el-icon-delete" size="small" @click="handleDelete">删除</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="8" style="text-align: right;margin-top: 10px">
          <el-tree :data="deptTree" default-expand-all @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="16" style="text-align: left">
          <el-form ref="deptForm" :model="deptForm" prop="deptForm" label-width="80px" :disabled="disable">
            <el-form-item label="上级部门:" prop="parentId">
              <el-select v-model="deptForm.parentId" placeholder="请选择上级部门">
                <el-option v-for="item in deptList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门名称:" prop="name">
              <el-input v-model="deptForm.name" style="width: 58%"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="orderNum">
              <el-input-number v-model="deptForm.orderNum" controls-position="right" :min="1"
                               :max="100"></el-input-number>
            </el-form-item>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" v-if="!edit" @click="addDept">确 定</el-button>
            <el-button type="primary" v-if="edit" @click="editDept">编 辑</el-button>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        showDialog: false,
        deptTree: [],
        deptList: [],
        deptForm: {
          id: '',
          name: '',
          parentId: '',
          orderNum: ''
        },
        disable: true,
        edit: true
      };
    },
    mounted() {
      this.initDept();
      this.getDeptList();
    },
    methods: {
      initDept() {
        this.$store.dispatch('getDeptTree')
          .then(res => {
            if (res.code === '0') {
              this.deptTree = res.data;
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      getDeptList() {
        this.$store.dispatch('getDeptList')
          .then(res => {
            if (res.code === '0') {
              this.deptList = res.data;
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      handleNodeClick(data) {
        this.deptForm = data
      },
      handleAdd() {
        this.disable = false;
        this.edit = false;
        this.deptForm.parentId = this.deptForm.id
        this.deptForm.name = ''
        this.deptForm.orderNum = ''
      },
      handleEdit() {
        this.disable = false;
        this.edit = true;
      },
      addDept() {
        let obj = {
          name: this.deptForm.name,
          parentId: this.deptForm.parentId,
          orderNum: this.deptForm.orderNum
        }
        this.$store.dispatch('addDept', obj)
          .then(res => {
            if (res.code === '0') {
              this.initDept();
              this.getDeptList();
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      editDept() {
        let obj = {
          id: this.deptForm.id,
          name: this.deptForm.name,
          parentId: this.deptForm.parentId,
          orderNum: this.deptForm.orderNum
        }
        this.$store.dispatch('editDept', obj)
          .then(res => {
            if (res.code === '0') {
              this.initDept();
              this.getDeptList();
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      handleDelete() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: this.deptForm.id
          }
          this.$store.dispatch('deleteDept', obj)
            .then(res => {
              if (res.retCode === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.initDept();
                this.getDeptList();
              } else {
                this.$message.warning(res.retMsg);
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      cancel() {
        this.disable = true;
      }
    }
  };
</script>
<style>

</style>
