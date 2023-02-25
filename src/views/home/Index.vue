<template>
  <div class="pages">
    <div class="base-wrap">
      <div class="search-bar card">
        <div class="search-input">
          <el-radio-group v-model="form.type">
            <el-radio label="1">作者</el-radio>
            <el-radio label="2">标题</el-radio>
            <el-radio label="3">内容</el-radio>
          </el-radio-group>
          <el-input
            v-model="form.condition"
            placeholder="选择查询类型，并在此处输入你想查询的内容"
            size="small"
            style="width: 300px; margin-left: 30px"
          ></el-input>
        </div>
        <div>
          <el-button type="success" size="small" @click="addShow = true">新增</el-button>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </div>
      </div>
      <div class="dairy-list card">
        <div class="item" v-for="item of dairyList" :key="item.id" @click="handleDetail(item)">
          <div class="content">
            <p class="title">{{ item.title }}</p>
            <p class="info">
              <span>{{ item.name }}</span>
              <span>{{ item.time }}</span>
            </p>
            <p class="detail">{{ item.detail }}</p>
          </div>
          <div class="action">
            <el-button type="primary" icon="el-icon-edit" size="small" @click.stop="showEdit(item)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click.stop="handleDelete(item)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="addShow" width="60%">
      <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="detail">
          <el-input v-model="addForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="editShow" width="60%">
      <el-form :model="eidtForm" :rules="formRules" ref="eidtForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="eidtForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="name">
          <el-input v-model="eidtForm.name"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="detail">
          <el-input v-model="eidtForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { api } from '@/utils/api'
export default {
  data() {
    return {
      form: {
        condition: '',
        type: '1',
      },
      dairyList: [],
      addShow: false,
      addForm: {
        title: '',
        name: '',
        detail: '',
      },
      editShow: false,
      eidtForm: {
        id: '',
        title: '',
        name: '',
        detail: '',
      },
      formRules: {
        title: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getDairyList()
  },
  methods: {
    getDairyList() {
      api.get('/dairy/selectDairy').then((res) => {
        this.dairyList = res.items
      })
    },
    search() {
      if (!this.form.condition) return this.getDairyList()
      api.postParams('/dairy/selectDairyByCondition', this.form).then((res) => {
        if (res.items.length === 0) this.$message.warning('未查询到数据')
        this.dairyList = res.items
      })
    },
    showEdit(data) {
      this.eidtForm = JSON.parse(JSON.stringify(data))
      this.editShow = true
    },
    handleDetail(data) {
      sessionStorage.setItem('dairy', JSON.stringify(data))
      this.$router.push('/detail')
    },
    handleAdd() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return
        api.postParams('/dairy/addDairy', this.addForm).then(() => {
          this.$message.success('新增成功')
          this.addShow = false
          this.search()
        })
      })
    },
    handleEdit() {
      this.$refs.eidtForm.validate((valid) => {
        if (!valid) return
        api.postParams('/dairy/updateDairy', this.eidtForm).then(() => {
          this.$message.success('修改成功')
          this.editShow = false
          this.search()
        })
      })
    },
    handleDelete(data) {
      this.$confirm(`确定删除标题为【${data.title}】的数据吗？`, '温馨提示', {
        callback: (action) => {
          if (action === 'cancel') return
          api.delete('/dairy/deleteDairy', { id: data.id }).then(() => {
            this.$message.success('删除成功')
            this.search()
          })
        },
      })
    },
  },
}
</script>

<style>
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  min-height: 80px;
  margin-bottom: 20px;
}
.dairy-list {
  display: flex;
  flex-flow: column nowrap;
  padding: 20px 10px;
}
.dairy-list .item {
  margin-bottom: 15px;
  border-radius: 5px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px 0px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dairy-list .item:hover {
  background-color: #eeeeee50;
}
.dairy-list .item .title {
  font-weight: bold;
  font-size: 18px;
  margin-right: 15px;
  align-items: flex-end;
  justify-content: flex-end;
}
.dairy-list .item .info {
  display: flex;
  color: #aaa;
  font-size: 12px;
}
.dairy-list .item .info span:nth-child(1) {
  margin-right: 15px;
}
@media screen and (max-width: 480px) {
  .search-bar {
    flex-flow: column nowrap;
  }
  .search-input {
    display: flex;
    flex-flow: column nowrap;
  }
  .search-input .el-input {
    margin: 10px 0 !important;
  }
  .dairy-list .item .action {
    width: 100px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .dairy-list .item .action button {
    width: 80px;
    margin: 5px 0 !important;
  }
}
</style>
