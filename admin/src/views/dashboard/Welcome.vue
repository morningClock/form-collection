<template>
  <div>
    <h2>欢迎使用{{ this.$store.getters.title }}</h2>
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
  methods: {
    showLoading() {
      this.$loading.show({ tip: "3 秒后自动隐藏" });

      setTimeout(() => {
        this.$loading.hide();
      }, 3000);
    },
    hideLoading() {
      this.$loading.hide();
    }
  }
};
</script>

<style lang="less" scoped></style>
