<template>
  <div>
    <div class="header">信息登记</div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="formData.wx_name"
        name="微信名称"
        label="微信名称"
        placeholder="请输入微信名称"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="formData.name"
        name="姓名"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[
          { required: true, message: '请填写姓名' },
          { validator: isName, message: '请填写汉字姓名' },
        ]"
      />
      <van-field
        v-model="formData.phone"
        name="联系电话"
        label="联系电话"
        placeholder="请输入联系电话"
        :rules="[
          { required: true, message: '请填写联系电话' },
          { validator: isPhone, message: '请填写正确的国内13位手机号' },
        ]"
      />
      <van-field
        v-model="formData.address"
        type="textarea"
        name="配送地址"
        label="配送地址"
        placeholder="请输入配送地址"
        :rules="[{ required: true, message: '请填写配送地址' }]"
      />
      <van-field
        v-model="formData.id_card_number"
        name="身份证号码"
        label="身份证号码"
        placeholder="请输入身份证号码"
        :rules="[
          { required: true, message: '请填写身份证号码' },
          { validator: isIDCard, message: '请填写正确的15或18位身份证号码' },
        ]"
      />
      <van-field
        name="uploader"
        label="身份证正反面"
        :rules="[{ validator: uploadValidator, message: '请上传身份证正反面' }]"
      >
        <template #input>
          <div class="upload-wrapper">
            <van-uploader
              class="upload-img"
              v-model="idCardImgFrontPreview"
              preview-size="100px"
              :before-read="beforeRead"
              :after-read="(file) => afterRead(file, 'id_card_img_front')"
              max-count="1"
              :max-size="2 * 1024 * 1024"
              @oversize="onOversize"
              :delete="removeImg"
            />
            <div class="preview-cover van-ellipsis">身份证正面</div>
          </div>
          <div class="upload-wrapper">
            <van-uploader
              class="upload-img"
              v-model="idCardImgBackPreview"
              preview-size="100px"
              :before-read="beforeRead"
              :after-read="(file) => afterRead(file, 'id_card_img_back')"
              max-count="1"
              :max-size="2 * 1024 * 1024"
              @oversize="onOversize"
              :delete="removeImg"
            />
            <div class="preview-cover van-ellipsis">身份证反面</div>
          </div>
        </template>
      </van-field>

      <van-field
        v-model="formData.remark"
        type="textarea"
        name="备注"
        label="备注"
        placeholder="请输入备注"
      />
      <div style="margin: 16px">
        <van-button round block type="info" size="small" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { isName, isIDCard, isPhone } from "@/utils/validate";
export default {
  name: "FormCollection",
  data() {
    return {
      imgHost: "http://localhost:3000",
      formData: this.createForm(),
      idCardImgFrontPreview: [],
      idCardImgBackPreview: [],
    };
  },
  methods: {
    isName,
    isIDCard,
    isPhone,
    createForm() {
      return {
        wx_name: undefined,
        wxAvatar: undefined,
        name: undefined,
        phone: undefined,
        address: undefined,
        id_card_number: undefined,
        id_card_img_front: undefined,
        id_card_img_back: undefined,
        remark: "",
      };
    },
    async onSubmit() {
      this.$toast.loading({
        message: "正在提交...",
        forbidClick: true,
      });
      try {
        await this.$http.post("/customer/add", this.formData);
        this.$toast.success("提交成功");
        this.$router.push({ name: "success" });
      } catch (e) {
        this.$toast.loading({
          message: "正在提交...",
          forbidClick: true,
        });
      }
    },
    uploadValidator() {
      const { id_card_img_front, id_card_img_back } = this.formData;
      if (id_card_img_front == "" || id_card_img_front == undefined) {
        return false;
      } else if (id_card_img_back == "" || id_card_img_back == undefined) {
        return false;
      }
      return true;
    },
    beforeRead(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$toast("只允许上传jpg/png格式的图片！");
        return false;
      }
      return true;
    },
    async afterRead(file, dataName) {
      file.content = "";
      file.status = "uploading";
      file.message = "上传中";
      try {
        let imgURL = await this.uploadImage(file.file);
        this.formData[dataName] = imgURL;
        file.content = this.imgHost + imgURL;
        file.status = "";
        file.message = "";
      } catch (e) {
        file.content = "";
        file.status = "fail";
        file.message = "上传失败";
      }
    },
    uploadImage(file) {
      let data = new FormData();
      data.append("file", file);
      let config = {
        headers: {
          //添加请求头
          "Content-Type": "multipart/form-data",
        },
      };
      return new Promise((resolve, reject) => {
        //把 uploadUrl 换成自己的 上传路径
        this.$http
          .post("/customer/upload", data, config)
          .then((res) => {
            if (res.status === "success") {
              resolve(res.url);
            } else {
              this.$toast.fail(res.message);
              reject(res.message);
            }
          })
          .catch((err) => {
            this.$toast.fail("系统异常");
            reject(err);
          });
      });
    },
    onOversize() {
      this.$toast("最大只能上传1MB大小的图片！");
    },
    removeImg() {
      this.formData.id_card_img_front = "";
      this.formData.id_card_img_back = "";
    },
  },
};
</script>

<style scoped>
.header {
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #eee;
}
.upload-wrapper {
  position: relative;
}
.preview-cover {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 8px;
  box-sizing: border-box;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
</style>
