<template>
  <div class="about" style="width: 1080px">
    <!-- <div class="d-flex al-center">
      渠道号:
      <div class="mr-5" style="width: 180px">
        <el-input placeholder="请输入渠道号" v-model="code"> </el-input>
      </div>
      渠道名称:
      <div class="mr-5" style="width: 180px">
        <el-input placeholder="请输入渠道名称" v-model="name" disabled> </el-input>
      </div>
      <div class="ml-2">
        <el-button type="primary" @click="getList">搜索</el-button>
      </div>
      <div class="ml-2">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div> -->
    <el-table :data="list" >
      <el-table-column prop="dayTime" label="日期" > </el-table-column>
      <el-table-column prop="name" label="渠道名称" >
      </el-table-column>
      <!-- <el-table-column prop="code" label="状态"  :formatter="formatterDate" > </el-table-column> -->
      <el-table-column prop="enterUserCount" label="登入用户数">
      </el-table-column>
      <el-table-column prop="enterCount" label="登入次数">
      </el-table-column>
      
    </el-table>
    <div class="d-flex jc-end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 40, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      type: "",
      code: "",
      name: "",
      page: 1,
      limit: 20,
      list: [],
      total: 0,
      dialogVisible: false,
      dialogTitle: "新增客户",
      ruleForm: {
        code: "",
        name: "",
        remark: "",
        status: 0,
        id: '',
        password:''
      },

      rules: {
        entName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, message: "长度应不少于3个字符", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    search() {
      this.page = 1;
      this.getList();
    },

    async del(row) {
      let params = {
        id: row.id,
      };
      const res = await this.$http.post("/directRead/delete", params);
      if (res.code === 0) {
        this.$message({
          message: "操作成功",
        });
        this.getList();
      }
    },

    async getList() {
      const { code,name, page, limit } = this;
      const params = {
        page,
        limit,
        data: {
          code,
          name
        },
      };
      const res = await this.$http.post("/distributor/dailyList", params);
      if (res.code === 0) {
        this.upDate(res.data);
      }
    },
    // 页面刷新
    upDate(data) {
      const { currPage: page, list, pageSize: limit, totalCount: total } = data;
      Object.assign(this, { page, list, limit, total });
    },
    //limit改变
    handleSizeChange(val) {
      console.log(`当前size: ${val}`, this.limit);
      this.limit = val;
      this.getList();
    },

    //page改变
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      console.log(`当前页: ${val}`, this.page);
    },
    formatter(row) {
      // console.log("column", column);
      return row.createTime;
    },

    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.addCustomer();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //表单ajax提交
    async addCustomer() {
      const url = this.dialogTitle === "新增" ? "/directRead/save" : "/directRead/edit";
      const that = this;
      const res = await this.$http.post(url, this.ruleForm);
      console.log("a");
      if (res.code === 0) {
        this.dialogVisible = false;
        that.getList();
        that.$message({
          message: "操作成功",
        });
      }
    },

    //新增/修改弹框重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增弹框
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.ruleForm = {
        code: "",
        name: "",
        remark: "",
        status: 0,
        id:''
      };
    },
    //编辑弹框
    handleEdit(data) {
      this.dialogVisible = true;
      this.dialogTitle = "修改";
      const { code, name, remark, status,id } = data;
      this.ruleForm = {
        code, name, remark, status,id 
      };
    },
    qrcode(row){
      this.$router.push({
        path:`/h5-channel-manage/qr-code/${row.code}`,
        query: {
          userName: row.nameNick
        }
      })
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
