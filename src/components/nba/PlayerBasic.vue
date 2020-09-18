<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入球员名称" v-model="playerName" style="width: 200px" size="small" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="initPlayerList">
            搜索
          </el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="showDialog">
            同步球员
          </el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-table
            :data="playerList"
            v-loading="this.loading"
            border
            stripe
            size="medium">
            <af-table-column
              prop="playerId"
              label="#"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="playerName"
              label="姓名"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="team"
              label="球队"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="position"
              label="位置"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="height"
              label="身高"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="weight"
              label="体重"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="birthDate"
              label="生日"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="experience"
              label="年限"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="salary"
              label="年薪"
              align="center"
            >
            </af-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'player',
  data() {
    return {
      playerName: '',
      playerList: [],
      loading: true,
      pageNum: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.initPlayerList()
  },
  methods: {
    showDialog() {

    },
    initPlayerList() {
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      this.$store.dispatch('getPlayerList', query).then(resp => {
        if (resp.retCode === 0) {
          this.playerList = resp.players;
          this.total = resp.total;
          this.loading = false;
        } else {
          this.$message.warning(resp.message);
        }
      });
    }
  }
}
</script>
