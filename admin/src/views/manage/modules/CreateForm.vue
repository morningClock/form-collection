<template>
  <a-modal
    title="录入用户"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="用户名">
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写用户名'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写密码'
                  },
                  {
                    min: 6,
                    message: '最少输入6位数'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = ["username", "password"];

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    };
    return {
      form: this.$form.createForm(this)
    };
  },
  created() {
    console.log("custom modal created");

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v));

    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  }
};
</script>
