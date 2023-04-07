<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="item in articleList"
          :key="item.art_id"
          :artListObj="item"
          @noInterest="noInterest"
          @artReports="artReports"
          @click.native="$router.push(`/articledetail?article_id=${item.art_id}`)"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle, noInterestApi, artReportsApi } from '@/api'
import ArticleItem from '../../../components/ArticleItem.vue'
import { Notify } from 'vant'

export default {
  data () {
    return {
      timestamp: null,
      articleList: [],
      loading: false,
      finished: false,
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    channelId: Number
  },
  methods: {
    async getNewArtList () {
      const res = await getArticle({
        channel_id: this.channelId,
        timestamp: this.timestamp
      })
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.timestamp = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
    },
    onLoad () {
      if (this.articleList.length > 0) {
        this.getNewArtList()
      }
    },
    onRefresh () {
      this.timestamp = null
      this.articleList = []
      this.isLoading = false
      this.getNewArtList()
    },
    // 反馈面板-不感兴趣
    async noInterest (artId) {
      try {
        await noInterestApi(artId)// 401提示身份过期，重新登陆也无效
        Notify({ type: 'success', message: '反馈成功！' })
      } catch (err) {
        Notify({ type: 'danger', message: '反馈失败' })
      }
    },
    async artReports (artId, value) {
      try {
        await artReportsApi({ artId, value })
        Notify({ type: 'success', message: '举报成功！' })
      } catch (err) {
        Notify({ type: 'danger', message: '举报失败' })
      }
    }
  },
  async created () {
    this.getNewArtList()
  }
}
</script>

<style>
</style>
