<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入球馆名称" v-model="stadiumName" style="width: 200px" size="small" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="initStadiumList">
            搜索
          </el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-table
            :data="stadiumList"
            v-loading="this.loading"
            border
            stripe
            size="medium">
            <af-table-column
              prop="stadiumId"
              label="#"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="name"
              label="球馆名称"
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
              prop="country"
              label="国家"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="address"
              label="地址"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="capacity"
              label="容纳人数"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="zip"
              label="邮编"
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
  name: 'stadium',
  data() {
    return {
      stadiumList: [],
      loading: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      stadiumName: ''
    }
  },
  mounted() {
    this.initStadiumList()
  },
  methods: {
    initStadiumList() {
      this.loading = true
      let query = {
        name: this.stadiumName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      this.$store.dispatch('getStadiumPage', query).then(resp => {
        if (resp.code === '0') {
          this.stadiumList = resp.data.records;
          this.total = resp.data.total;
          this.loading = false;
        } else {
          this.$message.warning(resp.message);
        }
      });
    },
    currentChange(currentPage) {
      this.pageNum = currentPage;
      this.initStadiumList();
    },
    sizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initStadiumList();
    },
  }
}
</script>
