<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-input placeholder="请输入球员名称" v-model="playerName" style="width: 200px" size="small" clearable></el-input>
          <el-select v-model="teamId" placeholder="请选择球队" size="small">
            <el-option
              v-for="item in teamList"
              :key="item.teamId"
              :label="item.name"
              :value="item.teamId">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="small" @click="initPlayerList">
            搜索
          </el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="syncPlayer">
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
  name: 'player',
  data() {
    return {
      playerName: '',
      playerList: [],
      loading: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      teamList: [],
      teamId: ''
    }
  },
  mounted() {
    this.initPlayerList();
    this.getTeamList()
  },
  methods: {
    syncPlayer() {
      this.$store.dispatch('syncPlayer').then(resp => {
        if (resp.code !== '0') {
          this.$message.warning(resp.message);
        }
      });
    },
    initPlayerList() {
      this.loading = true
      let query = {
        playerName: this.playerName,
        teamId: this.teamId,
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
    },
    currentChange(currentPage) {
      this.pageNum = currentPage;
      this.initPlayerList();
    },
    sizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initPlayerList();
    },
    getTeamList() {
      this.$store.dispatch('getTeamList').then(resp => {
        if (resp.code === '0') {
          this.teamList = resp.data;
        } else {
          this.$message.warning(resp.message);
        }
      });
    },
  }
}
</script>
