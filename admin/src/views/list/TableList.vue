<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.id" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="数据状态">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择"
                  default-value="0"
                >
                  <a-select-option value="0">未审核</a-select-option>
                  <a-select-option value="1">正在处理</a-select-option>
                  <a-select-option value="2">已完成</a-select-option>
                  <a-select-option value="3">已取消</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker
                    v-model="queryParam.date"
                    style="width: 100%"
                    placeholder="请输入更新日期"
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">录入</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="handleDeleteBatch"
              ><a-icon type="delete" />删除</a-menu-item
            >
            <!-- lock | unlock -->
            <a-menu-item key="2" @click="handleStatus"
              ><a-icon type="lock" />审核</a-menu-item
            >
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="true"
        :scroll="{ x: 1600 }"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge
            :status="text | statusTypeFilter"
            :text="text | statusFilter"
          />
        </span>
        <span slot="id_card_img_front" slot-scope="text">
          <img
            :src="'http://localhost:3000' + text"
            alt=""
            width="100%"
            height="80px"
          />
        </span>
        <span slot="id_card_img_back" slot-scope="text">
          <img
            :src="'http://localhost:3000' + text"
            alt=""
            width="100%"
            height="80px"
          />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">审核</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="你确定删除此条记录吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";
import {
  getCustomerList,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  deleteBatchCustomer
} from "@/api/customer";

import StepByStepModal from "./modules/StepByStepModal";
import CreateForm from "./modules/CreateForm";

const columns = [
  {
    title: "#",
    width: "50px",
    scopedSlots: { customRender: "serial" }
  },
  {
    title: "微信头像",
    dataIndex: "wx_avatar",
    width: "100px"
  },
  {
    title: "微信名称",
    dataIndex: "wx_name",
    width: "100px"
  },
  {
    title: "联系方式",
    dataIndex: "phone",
    width: "150px"
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    width: "100px"
  },
  {
    title: "身份证号码",
    dataIndex: "id_card_number",
    width: "250px"
  },
  {
    title: "身份证正面",
    dataIndex: "id_card_img_front",
    scopedSlots: { customRender: "id_card_img_front" },
    width: "180px"
  },
  {
    title: "身份证反面",
    dataIndex: "id_card_img_back",
    scopedSlots: { customRender: "id_card_img_back" },
    width: "180px"
  },
  {
    title: "提交时间",
    dataIndex: "create_time",
    width: "150px",
    sorter: true
  },
  {
    title: "更新时间",
    dataIndex: "modified_time",
    width: "150px",
    sorter: true
  },
  {
    title: "操作",
    dataIndex: "action",
    fixed: "right",
    width: "160px",
    scopedSlots: { customRender: "action" }
  }
];

const statusMap = {
  0: {
    status: "default",
    text: "未审核"
  },
  1: {
    status: "processing",
    text: "正在处理"
  },
  2: {
    status: "success",
    text: "已完成"
  },
  3: {
    status: "error",
    text: "已取消"
  }
};

export default {
  name: "TableList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data() {
    this.columns = columns;
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return getCustomerList(requestParameters).then(res => {
          return res.result;
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text;
    },
    statusTypeFilter(type) {
      return statusMap[type].status;
    }
  },
  created() {
    // getRoleList({ t: new Date() });
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      };
    }
  },
  methods: {
    handleAdd() {
      this.mdl = null;
      this.visible = true;
    },
    handleEdit(record) {
      this.visible = true;
      this.mdl = { ...record };
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id) {
            updateCustomer(values)
              .then(() => {
                this.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                this.$refs.table.refresh();

                this.$message.info("修改成功");
              })
              .catch(() => {
                this.confirmLoading = false;
              });
          } else {
            // 新增
            addCustomer(values)
              .then(() => {
                this.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                this.$refs.table.refresh();

                this.$message.info("修改成功");
              })
              .catch(() => {
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`);
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`);
      }
    },
    handleDelete(record) {
      deleteCustomer({
        id: record.id
      })
        .then(() => {
          // 刷新表格
          this.$refs.table.refresh();
          this.$message.info("删除成功");
        })
        .catch(() => {
          this.$message.info(`删除失败`);
        });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      };
    },
    handleDeleteBatch() {
      let ids = this.selectedRows.map(item => item.id);
      deleteBatchCustomer({ ids: ids.join(",") })
        .then(res => {
          // 刷新表格
          this.$refs.table.refresh();
          this.$refs.table.clearSelected();
          this.$message.info("删除成功");
        })
        .catch(() => {
          this.$message.info("删除失败");
        });
    },
    handleStatus() {
      // 改变查阅状态
    }
  }
};
</script>

<style lang="less">
.ant-table-body::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}
.ant-table-body::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: #ccc;
}
.ant-table-body::-webkit-scrollbar-track {
  box-shadow: 0;
  border-radius: 0;
  background: #f2f2f2;
}
</style>
