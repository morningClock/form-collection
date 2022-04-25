<template>
  <a-card>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd"
        >新建用户</a-button
      >
    </div>
    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
    </a-table>
    <!-- 新增表单弹窗 -->
    <create-form
      ref="createUserModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { getUserList, addUser } from "@/api/user";
import CreateForm from "./modules/CreateForm.vue";
import md5 from "md5";
const columns = [
  {
    title: "ID",
    dataIndex: "id"
  },
  {
    title: "用户名",
    dataIndex: "username"
  }
];
export default {
  name: "UserTable",
  components: {
    CreateForm
  },
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
      // 表单状态管理
      visible: false,
      confirmLoading: false,
      mdl: null
    };
  },
  methods: {
    // 加载数据
    loadData(params = { pageNo: 1, pageSize: 10 }) {
      this.loading = true;
      getUserList({
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }).then(res => {
        const pagination = { ...this.pagination };
        this.loading = false;
        this.data = res.result.data;
        pagination.total = res.result.totalCount;
        this.pagination = pagination;
      });
    },
    // table分页
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.loadData({
        pageSize: pagination.pageSize,
        pageNo: pagination.current
      });
    },
    // 新建用户
    handleAdd() {
      this.mdl = null;
      this.visible = true;
    },
    handleOk() {
      const form = this.$refs.createUserModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 新增
          addUser({
            username: values.username,
            password: md5(values.password)
          })
            .then(() => {
              this.visible = false;
              this.confirmLoading = false;
              // 重置表单数据
              form.resetFields();
              // 刷新表格
              this.loadData();
              this.$notification.success({
                message: "系统提示",
                description: "新增用户成功"
              });
            })
            .catch(err => {
              this.confirmLoading = false;
              this.$notification.warning({
                message: "系统提示",
                description: err.response.data.message || err
              });
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      const form = this.$refs.createUserModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style></style>
