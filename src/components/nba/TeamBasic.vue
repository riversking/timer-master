<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入球队名称" v-model="teamName" style="width: 200px" size="small" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="initTeamList">
            搜索
          </el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-table
            :data="teamList"
            v-loading="this.loading"
            border
            stripe
            size="medium">
            <af-table-column
              prop="teamId"
              label="#"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="name"
              label="球队名称"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="city"
              label="城市"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="division"
              label="所在区域"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="conference"
              label="所在战区"
              align="center"
            >
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
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'team',
  data() {
    return {
      teamList: [],
      loading: true,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      teamName: ''
    }
  },
  mounted() {
    this.initTeamList()
  },
  methods: {
    initTeamList() {
      this.loading = true
      let query = {
        name: this.teamName,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.$store.dispatch('getTeamPage', query).then(resp => {
        if (resp.code === '0') {
          this.teamList = resp.data.records;
          this.total = resp.data.total;
          this.loading = false;
        } else {
          this.$message.warning(resp.message);
        }
      });
    },
    currentChange(currentPage) {
      this.pageNumber = currentPage;
      this.initTeamList();
    },
    sizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initTeamList();
    },
  }
}
</script>
