<template>
  <div class="home-wrapper">
    <div class="home">
      <h1>{{ title }}</h1>
      <img class="home-img" src="../assets/background.png" alt="" />
      <router-link :to="{ path: 'form' }">
        <van-button
          class="form-button"
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
        >
          填写表单
        </van-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormHome",
  data() {
    return {
      title: localStorage.getItem("title"),
    };
  },
  created() {
    this.$http.get("/system/title").then((res) => {
      this.title = res.result.title;
      localStorage.setItem("title", res.result.title);
      document.title = res.result.title;
    });
  },
};
</script>

<style scoped>
.home {
  position: relative;
  text-align: center;
  width: 100%;
}
.home h1 {
  margin-top: 30px;
  margin-bottom: 10px;
  height: 31px;
  font-size: 24px;
}
.home-img {
  width: 100%;
  top: 20%;
}
.form-button {
  display: block;
  width: 80%;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
