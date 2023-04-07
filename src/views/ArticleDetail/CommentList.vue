<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有评论了,请点击添加评论~"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <!-- 评论的 Item 项 -->
        <div
          class="cmt-item"
          v-for="(item, index) in commentsList"
          :key="index"
        >
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="item.is_liking"
                @click="likeComment(false, item)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeComment(true, item)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ item.content }}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeForm(item.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <div
      class="cmt-list"
      :class="addcmt ? 'art-cmt-container-1' : 'art-cmt-container-2'"
    >
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="addcmt">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="addcmt = !addcmt">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? null : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="scrollToCmt"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>
      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-autofocus
          @blur="blurFun"
          v-model.trim="cmtContent"
        ></textarea>
        <van-button
          type="default"
          :disabled="cmtContent.length === 0 ? true : false"
          @click="addCmt"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import {
  getCommentsAPI,
  likeCommentAPI,
  dislikeCommentAPI,
  addCommentAPI
} from '@/api/index'
export default {
  data () {
    return {
      commentsList: [],
      totalCount: null,
      offset: null,
      addcmt: true, // ture小box，false输入
      cmtContent: '',
      newObj: {},
      loading: false,
      finished: false
    }
  },
  methods: {
    timeForm: timeAgo,
    async likeComment (bool, item) {
      if (bool === true) {
        // 点了灰心，要变红
        item.is_liking = !item.is_liking
        await likeCommentAPI(item.com_id)
      } else {
        item.is_liking = !item.is_liking
        await dislikeCommentAPI(item.com_id)
        // http://localhost:8080/#/articledetail?article_id=8202
      }
    },
    scrollToCmt () {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    async addCmt () {
      const res = await addCommentAPI({
        target: this.$route.query.article_id,
        content: this.cmtContent
      })
      this.newObj = res.data.data.new_obj
      this.totalCount++
      this.commentsList.unshift(this.newObj)
      this.cmtContent = []
      this.scrollToCmt()
    },
    blurFun () {
      setTimeout(() => {
        this.addcmt = !this.addcmt
      }, 0)
    },
    async onLoad () {
      if (this.totalCount > 0) {
        const res = await getCommentsAPI({ source: this.$route.query.article_id, offset: this.offset })
        this.commentsList = [...this.commentsList, ...res.data.data.results]
        this.offset = res.data.data.last_id
        this.loading = false
        // 数据全部加载完成
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      }
    }
  },
  async created () {
    const res = await getCommentsAPI({ source: this.$route.query.article_id })
    this.totalCount = res.data.data.total_count
    this.commentsList = res.data.data.results
    this.offset = res.data.data.last_id
    // 没评论finished=true
    if (res.data.data.total_count === 0) this.finished = true
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
