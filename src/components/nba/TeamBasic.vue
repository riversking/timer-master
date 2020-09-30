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
              width="192px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="showDetail(scope.$index, scope.row)"
                >{{ scope.row.teamId }}
                </el-button>
              </template>
            </af-table-column>
            <af-table-column
              prop="name"
              label="球队名称"
              align="center"
            >
            </af-table-column>
            <af-table-column
              prop="stadiumName"
              label="球馆"
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
      <el-dialog
        title="球队详情"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="closeDialog"
        width="80%">
        <div>
          <el-form :model="team" ref="team" :disabled="true" label-position="right" label-width="80px"
                   style="margin-left: 50px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="头像:" prop="photoUrl">
                  <div class="block">
                    <el-avatar :size="50" :src="team.logoUrl"></el-avatar>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="球队名称:" prop="teamName">
                  <el-input size="medium" v-model="team.teamName" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="城市:" prop="city">
                  <el-input size="medium" v-model="team.city" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所在区域:" prop="division">
                  <el-input size="medium" v-model="team.division" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所在战区:" prop="conference">
                  <el-input size="medium" v-model="team.conference" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-form-item label="球馆名称:" prop="stadiumId" style="text-align: left">
                <el-select v-model="team.stadiumId" placeholder="请选择球队" size="small" style="margin-left: 110px">
                  <el-option
                    v-for="item in stadiumList"
                    :key="item.stadiumId"
                    :label="item.name"
                    :value="item.stadiumId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-dialog>
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
      pageNum: 1,
      pageSize: 10,
      total: 0,
      teamName: '',
      team: {},
      dialogVisible: false,
      stadiumId: '',
      stadiumList: ''
    }
  },
  mounted() {
    this.initTeamList()
    this.getStadiumList()
  },
  methods: {
    initTeamList() {
      this.loading = true
      let query = {
        name: this.teamName,
        pageNum: this.pageNum,
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
      this.pageNum = currentPage;
      this.initTeamList();
    },
    sizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initTeamList();
    },
    showDetail(index, row) {
      this.getTeam(row.teamId);
    },
    getTeam(teamId) {
      let query = {
        teamId: teamId || 0,
      }
      this.$store.dispatch('getTeamDetail', query).then(resp => {
        if (resp.retCode === 0) {
          this.team = resp.team;
          this.dialogVisible = true
        } else {
          this.$message.warning(resp.retMsg);
        }
      });
    },
    getStadiumList() {
      this.$store.dispatch('stadiumList').then(resp => {
        if (resp.code === '0') {
          this.stadiumList = resp.data;
        } else {
          this.$message.warning(resp.message);
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false
      this.team = {}
    },
  }
}
</script>
