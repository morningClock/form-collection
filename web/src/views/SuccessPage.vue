<template>
  <van-empty
    image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
    description="信息已提交"
  >
    <van-button round type="info" class="bottom-button" @click="back"
      >返回</van-button
    >
  </van-empty>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.bottom-button {
  width: 160px;
  height: 40px;
}
</style>
