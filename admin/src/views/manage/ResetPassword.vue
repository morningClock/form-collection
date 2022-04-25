<template>
  <div>
    <a-card>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="原密码"
        >
          <a-input-password
            v-decorator="[
              'oldPassword',
              { rules: [{ required: true, message: '必须填写旧密码' }] }
            ]"
            placeholder="请输入您的原密码"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="新密码"
        >
          <a-input-password
            v-decorator="[
              'newPassword',
              {
                rules: [{ required: true, message: '必须填写新密码' }]
              }
            ]"
            placeholder="请输入您的新密码"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="再次输入"
        >
          <a-input-password
            v-decorator="[
              'newPasswordRepeat',
              {
                rules: [
                  { required: true, message: '必须再次填写新密码' },
                  { validator: checkRepeat }
                ]
              }
            ]"
            placeholder="请再次输入您的新密码"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          :wrapper-col="{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 4 }
          }"
        >
          <a-button type="primary" html-type="submit">
            重置密码
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { resetPassword } from "@/api/login";
import md5 from "md5";
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
export default {
  name: "ResetPassword",
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this, { name: "resetPasswordForm" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const { oldPassword, newPassword } = fieldsValue;

        resetPassword({
          oldPassword: md5(oldPassword),
          newPassword: md5(newPassword)
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: "系统提示",
              description: "密码修改成功,请重新登录!"
            });
            this.$store.dispatch("Logout").then(() => {
              this.$router.push({ name: "login" });
            });
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    checkRepeat(rule, value, callback, form) {
      if (
        this.form.getFieldValue("newPassword") ===
        this.form.getFieldValue("newPasswordRepeat")
      ) {
        callback();
        return;
      }
      callback("两次密码不一致");
    }
  }
};
</script>
