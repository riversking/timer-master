<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row>
        <el-col :span="19" style="text-align: left">
          <el-input placeholder="请输入球员名称" v-model="playerName" style="width: 200px" size="small" clearable></el-input>
          <el-input placeholder="请输入球员位置" v-model="position" style="width: 200px" size="small" clearable></el-input>
          <el-input placeholder="请输入球员id" v-model="playerId" style="width: 200px" size="small" clearable></el-input>
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
        <el-col :span="5" style="text-align: right">
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
              width="192px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="showDetail(scope.$index, scope.row)"
                >{{ scope.row.playerId }}
                </el-button>
              </template>
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
      <el-dialog
        title="球员详情"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <div>
          <el-form :model="player" ref="player" :disabled="true" label-position="right" label-width="80px"
                   style="margin-left: 50px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="头像:" prop="photoUrl">
                  <div class="block">
                    <el-avatar :size="50" :src="player.photoUrl"></el-avatar>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="球员姓名:" prop="playerName">
                  <el-input size="medium" v-model="player.playerName" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="球员身高:" prop="height">
                  <el-input size="medium" v-model="player.height + 'cm'" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="球员体重:" prop="weight">
                  <el-input size="medium" v-model="player.weight + 'g'" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="球员号码:" prop="jersey">
                  <el-input size="medium" v-model="player.jersey" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="球员位置:" prop="position">
                  <el-input size="medium" v-model="player.position" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="大学:" prop="college">
                  <el-input size="medium" v-model="player.college" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-dialog>
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
      teamId: '',
      position: '',
      playerId: '',
      player: {},
      dialogVisible: false
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
        position: this.position,
        playerId: this.playerId || 0,
        teamId: this.teamId || 0,
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
    showDetail(index, row) {
      this.getPlayer(row.playerId);
    },
    getPlayer(playerId) {
      let query = {
        playerId: playerId || 0,
      }
      this.$store.dispatch('getPlayerDetail', query).then(resp => {
        if (resp.retCode === 0) {
          this.player = resp.player;
          this.dialogVisible = true
        } else {
          this.$message.warning(resp.retMsg);
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false
      this.player = {}
    },
  }
}
</script>
