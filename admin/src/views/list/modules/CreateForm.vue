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
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" label="主键ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-form-item label="微信名称">
          <a-input
            v-decorator="[
              'wx_name',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写微信名称'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="微信头像">
          <a-input v-decorator="['wx_avatar']" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写姓名'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="电话">
          <a-input
            v-decorator="[
              'phone',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写电话号码'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="身份证号码">
          <a-input
            v-decorator="[
              'id_card_number',
              {
                rules: [
                  {
                    required: true,
                    message: '必须填写身份证号码'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="身份证正面">
          <ImageUpload
            v-decorator="[
              'id_card_img_front',
              {
                rules: [
                  {
                    required: true,
                    message: '必须上传身份证正面'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="身份证反面">
          <ImageUpload
            v-decorator="[
              'id_card_img_back',
              {
                rules: [
                  {
                    required: true,
                    message: '必须上传身份证反面'
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
import ImageUpload from "./ImageUpload";

// 表单字段
const fields = [
  "id",
  "wx_name",
  "name",
  "phone",
  "id_card_number",
  "id_card_img_front",
  "id_card_img_back",
  "remark"
];

export default {
  components: {
    ImageUpload
  },
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
