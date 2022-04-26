<template>
  <div>
    <a-card>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="表单端标题"
        >
          <a-input
            v-decorator="[
              'web_title',
              { rules: [{ required: true, message: '必须填写表单端标题' }] }
            ]"
            placeholder="请输入您的表单端标题"
          ></a-input>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="后台标题"
        >
          <a-input
            v-decorator="[
              'admin_title',
              {
                rules: [{ required: true, message: '必须填写后台标题' }]
              }
            ]"
            placeholder="请输入您的后台标题"
          ></a-input>
        </a-form-item>
        <a-form-item
          :wrapper-col="{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 4 }
          }"
        >
          <a-button type="primary" html-type="submit">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { getSystemTitle, setSystemTitle } from "@/api/system";
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
export default {
  name: "SetTitle",
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this, { name: "setTitleForm" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const { web_title, admin_title } = fieldsValue;

        setSystemTitle({
          web_title: web_title,
          admin_title: admin_title
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: "系统提示",
              description: "标题设置成功,请刷新网页!"
            });
          } else {
            this.$message.error(res.message);
          }
        });
      });
    }
  },
  mounted() {
    getSystemTitle().then(res => {
      const webTitle = res.result.data.web_title;
      const adminTitle = res.result.data.admin_title;
      this.form.setFieldsValue({
        web_title: webTitle,
        admin_title: adminTitle
      });
      this.$store.dispatch("setTitle", adminTitle);
    });
  }
};
</script>
