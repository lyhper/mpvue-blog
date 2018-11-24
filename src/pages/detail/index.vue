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
import { formatDate, appendToken } from "@/utils";
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
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: "小店暂时打烊了",
            icon: "error",
            duration: 10000
          });
        }
      });

      // wx.request({
      //   url: appendToken(
      //     `https://api.github.com/repos/lyhper/blog-markdown/git/blobs/${hash}?`
      //   ),
      //   header: {
      //     Accept: "application/vnd.github.v3.raw"
      //   },
      //   success: res => {
      //     const data = frontMatter(res.data);
      //     const attributes = data.attributes;

      //     this.title = attributes.title;
      //     this.date = formatDate(attributes.date);
      //     this.content = data.body;

      //     wx.hideLoading();
      //   },
      //   fail: () => {
      //     wx.hideLoading();
      //     wx.showToast({
      //       title: "小店暂时打烊了",
      //       icon: "none",
      //       duration: 10000
      //     });
      //   }
      // });
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