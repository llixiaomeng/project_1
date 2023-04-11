<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-autofocus
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-model="kw"
        @input="inputFun"
        @search="sureSearch(kw)"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length!==0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestionList"
        :key="index"
        v-html="highlightFun(str, kw)"
        @click="sureSuggestion(str)"
      ></div>
    </div>

    <!-- 搜索历史-->
    <div v-else>
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteHistory" />
        </template>
      </van-cell>
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="sureHistory(str)"
          >{{ str }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestionAPI } from '@/api/index'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖, 用的定时器
      suggestionList: [],
      history: JSON.parse(localStorage.getItem('searchHistory')) || []
    }
  },
  methods: {
    inputFun () {
      // 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        const str = this.kw.trim()
        if (str.length === 0) {
          this.suggestionList = []
          return
        } // 防止空内容触发下面逻辑
        const res = await suggestionAPI(str)
        this.suggestionList = res.data.data.options
        // console.log(this.suggestionList)
      }, 500)
    },
    highlightFun (str, kw) {
      const hlreg = new RegExp(kw, 'ig')
      return str?.replace(hlreg, (match) => {
        return `<span style="color:red">${match}</span>`
      })
    },
    deleteHistory () {
      this.history = []
    },
    // 跳转到搜索结果页的三种情况：搜索、点历史、点建议列表
    sureSearch (kw) {
      // 非空才能
      if (kw.trim().length > 0) {
        this.history.push(kw.trim())
        // console.log(this.history)
        this.history = [...new Set(this.history)]
        setTimeout(() => {
          this.$router.push({ path: `/search/${kw.trim()}` })
        })
      }
    },
    sureHistory (kw) {
      setTimeout(() => {
        this.$router.push({ path: `/search/${kw.trim()}` })
      })
    },
    sureSuggestion (kw) {
      this.history.push(kw.trim())
      this.history = [...new Set(this.history)]
      setTimeout(() => {
        this.$router.push({ path: `/search/${kw.trim()}` })
      })
    }
  },
  watch: {
    history: {
      deep: true,
      handler (arr) {
        localStorage.setItem('searchHistory', JSON.stringify(this.history))
        console.log('history changed', arr)
      }
    }
  },
  created () {}
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
