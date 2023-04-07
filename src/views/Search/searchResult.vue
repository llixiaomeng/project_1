<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="50"
      :immediate-check="false"
    >
      <ArticleItem
        v-for="item in searchResultList"
        :key="item.art_id"
        :artListObj="item"
        :feedback="false"
        @click.native="$router.push(`/articledetail?article_id=${item.art_id}`)"
      />
    </van-list>
  </div>
</template>

<script>
import { searchResultsAPI } from '@/api/index'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  data () {
    return {
      kw: this.$route.params.keyword,
      page: 1,
      searchResultList: [],
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    async onLoad () {
      if (this.searchResultList.length > 0) {
        this.page++
        const res = await searchResultsAPI({ page: this.page, kw: this.kw })
        this.searchResultList = [...this.searchResultList, ...res.data.data.results]
        this.loading = false
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      }
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    const res = await searchResultsAPI({ page: this.page, kw: this.kw })
    this.searchResultList = res.data.data.results
    // console.log(this.searchResultList)
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
