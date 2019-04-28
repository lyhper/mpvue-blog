<template>
  <div class="container">
    <h1 class="title">
      {{ title }}
    </h1>
    <div class="date">{{ date }}</div>
    <wemark :md="content" link highlight 
      type="wemark"
      class="content"
      ></wemark>
  </div>
</template>

<script>
import { 
  formatDate, 
  appendToken,
  generateRetryFunc,
} from "@/utils";
import frontMatter from "front-matter";

export default {
  name: "postView",

  data() {
    return {
      title: "",
      date: "",
      content: ""
    };
  },

  onUnload() {
    this.emptyData();
  },

  mounted() {
    this.loadPost();
  },

  methods: {
    loadPost() {
      generateRetryFunc(() => {
        return new Promise((resolve, reject) => {

          const { hash } = this.$root.$mp.query;
          wx.showLoading({
            title: "加载中"
          });

          wx.cloud.callFunction({
            // 云函数名称
            name: "proxy",
            // 传给云函数的参数
            data: {
              url: appendToken(
                `https://api.github.com/repos/lyhper/blog-markdown/git/blobs/${hash}?`
              ),
              headers: {
                Accept: "application/vnd.github.v3.raw"
              }
            },
            success: res => {
              const data = frontMatter(res.result);
              const attributes = data.attributes;

              this.title = attributes.title;
              this.date = formatDate(attributes.date);
              this.content = data.body;

              wx.hideLoading();

              resolve();
            },
            fail: () => {
              reject();
            }
          });
        });

      }, () => {
        wx.hideLoading();
        wx.showToast({
          title: "开小差中",
          icon: "error",
          duration: 10000
        });
      }, 10)();
    },

    emptyData() {
      this.title = "";
      this.date = "";
      this.content = "";
    }
  }
};
</script>

<style>
.title {
  text-align: left;
  font-size: 40rpx;
}
.date {
  text-align: left;
  font-size: 30rpx;
  color: #888;
}
.content {
  width: 100%;
}
</style>