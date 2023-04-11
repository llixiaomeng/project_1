<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <van-loading color="#1989fa" vertical v-if="articleObj.title===undefined">加载中...</van-loading>

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{articleObj.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleObj.aut_name" :label="timeForm(articleObj.pubdate)">
        <template #icon>
          <img :src="articleObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="isfollowed"
              @click="notfollowAut(articleObj.aut_id)"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="followAut(articleObj.aut_id)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="attitude === 1"
          @click="dislikeArt(articleObj.art_id)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="likeArt(articleObj.art_id)"
          >点赞</van-button
        >
      </div>
    </div>

    <!-- 评论区域 -->
    <CommentList />
  </div>
</template>

<script>
import {
  articleDetailAPI,
  followAutAPI,
  notfollowAutAPI,
  likeArtAPI,
  dislikeArtAPI
} from '@/api/index'
import CommentList from '@/views/ArticleDetail/CommentList.vue'
import { timeAgo } from '@/utils/date'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      articleObj: {}, // 含关注作者、点赞文章，create时挂到data相关数据上。点击动作关联data和接口函数
      isfollowed: false,
      attitude: 0 // 0未点赞, 1点赞
    }
  },
  methods: {
    timeForm: timeAgo,
    // 点赞和关注
    async notfollowAut (autId) {
      this.isfollowed = !this.isfollowed
      await notfollowAutAPI(autId)
    },
    async followAut (autId) {
      this.isfollowed = !this.isfollowed
      await followAutAPI(autId)
    },
    async dislikeArt (artId) {
      this.attitude = 0
      await dislikeArtAPI(artId)
    },
    async likeArt (artId) {
      this.attitude = 1
      await likeArtAPI(artId)
    }
  },
  components: {
    CommentList
  },
  async created () {
    try {
      const res = await articleDetailAPI(this.$route.query.article_id)
      this.articleObj = res.data.data
    } catch (err) {
      console.log('articleDetailAPI出错啦')
    }
    this.isfollowed = this.articleObj.is_followed
    this.attitude = this.articleObj.attitude
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

/deep/ .van-loading{
  padding-top: 46px;
}
</style>
