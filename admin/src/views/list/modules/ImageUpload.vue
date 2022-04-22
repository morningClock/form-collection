<template>
  <div class="clearfix">
    <a-upload
      :showRemoveIcon="false"
      :action="url"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < max && isShow">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import config from "@/views/list/config";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: "ImageUpload",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String
      // 这个参数是v-decorator给子组件传值用的
      // 这里不要给默认值， 在form下使用会爆警告 Warning: SquareUpload `default value` can not collect,  please use `option.initialValue` to set default value.
    },
    // 上传地址
    url: {
      type: String,
      default: config.uploadUrl
    },
    isShow: {
      type: Boolean,
      default: true
    },
    // 最多上传数量
    max: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      previewVisible: false,
      previewImage: "",
      fileList: []
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    // 处理预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange(info) {
      this.fileList = info.fileList;
    }
  },
  watch: {
    // 监听数据变化，及时提交给父组件
    fileList: {
      deep: true,
      immediate: true,
      handler: function(newV, oldV) {
        if (
          this.fileList.length === 0 ||
          this.fileList[0].status === "uploading"
        ) {
          return;
        }
        this.fileList = newV;
        const temp = this.fileList
          .filter(item => item.status !== "uploading")
          .map(item => {
            return (item.uid < 0 && item.name) || item.response.url;
          })
          .join(",");
        // 向父组件更新
        this.$emit("change", temp);
      }
    },
    // 监听父组件传递过来的图片列表信息
    value: {
      deep: true,
      immediate: true,
      handler: function(newV) {
        // 数据为空的三种情况
        if (newV === null || newV === "" || newV === undefined) {
          this.fileList = [];
          return;
        }
        let count = -1;
        let temp = [];
        const tempList = [];
        temp = newV.split(",");
        temp.forEach(item => {
          tempList.push({
            uid: count,
            name: item,
            status: "done",
            url: config.baseImgUrl + item
          });
          count--;
        });
        this.fileList = [...tempList];
      }
    }
  }
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
