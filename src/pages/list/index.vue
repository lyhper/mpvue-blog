<template>
  <div class="container">
    <ol v-if="lists" class="list">
      <li v-for="item in sortedList" 
        :key="item.sha" 
        class="list-item"
        >
        <a class="title"
          hover-class="none"
          :href="'/pages/detail/main?hash=' + item.sha"
          >{{ item.title }}</a>
        <div class="date-wrap">
          <span class="date">{{ item.date }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { 
  getTitle, 
  getDate, 
  formatDate, 
  appendToken,
  generateRetryFunc,
} from "@/utils";

export default {
  name: "listView",

  data() {
    return {
      lists: []
    };
  },

  created() {
    this.loadList();
  },

  computed: {
    sortedList() {
      return this.lists
        .sort((itemA, itemB) => new Date(itemB.date) - new Date(itemA.date))
        .map(item => ({
          ...item,
          date: formatDate(item.date)
        }));
    }
  },

  methods: {
    loadList() {
      generateRetryFunc(() => {
      
        return new Promise((resolve, reject) => {
          wx.showLoading({
            title: "加载中"
          });

          wx.cloud.callFunction({
            // 云函数名称
            name: "proxy",
            // 传给云函数的参数
            data: {
              url: appendToken(
                "https://api.github.com/repos/lyhper/blog-markdown/contents/posts?"
              )
            },
            success: res => {
              const lists = handleData(res.result || []);

              this.lists = lists;
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
      
    }

  }
};

function handleData(list) {
  return list.map(({ name, sha }) => ({
    title: getTitle(name),
    date: getDate(name),
    sha
  }));
}
</script>

<style>
.list-item + .list-item {
  margin-top: 100rpx;
}

.title {
  font-size: 32rpx;
  color: #555;
}

.date-wrap {
  margin-top: 28rpx;
}

.date {
  font-size: 24rpx;
  color: #888;
  padding-top: 20rpx;
  border-top: solid 2rpx #ddd;
}
</style>