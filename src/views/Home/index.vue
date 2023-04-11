<template>
  <div>
    <van-nav-bar fixed>
      <template #right>
        <van-icon name="search" size="0.48rem" @click="$router.push({path:'/search'})"/>
      </template>
      <template #left>
        <img class="logo" src="@/assets/toutiao_logo.png" />
      </template>
    </van-nav-bar>

    <van-tabs v-model="activeid" animated sticky offset-top="1.226667rem" @change="listChange" :before-change="beforeChange">
      <van-tab v-for="item in userChannels" :key="item.id" :title="item.name" :name="item.id">
        <!--文章列表-->
        <ArticleList :channelId="item.id" />
      </van-tab>
    </van-tabs>

    <!--扩展图标-->
    <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup"/>
    <van-popup
     v-model="show"
     position="right"
     :style="{ width: '100%', height:'100%' }"
     closeable
     @click-close-icon="clickCloseicon"
     get-container="body">
      <ChannelEdit
        :userChannels="userChannels"
        :allChannels="allChannels"
        @updateChannels="updateChannels"
        ref="ChannelEdit"
        @intoChannel="intoChannel"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels, getAllChannels, updateUserChannels } from '@/api/index'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  data () {
    return {
      activeid: 0,
      userChannels: [],
      allChannels: [],
      show: false,
      scrollLen: {}
    }
  },
  methods: {
    showPopup () {
      this.show = true
    },
    async updateChannels (channelId, addordelete) {
      let updateChannelsArr = []
      if (addordelete > 0) {
        // 增加user频道
        // 传的参是对象（id&seq）组成的数组，userchannels是对象（id&name）组成的数组
        // 遍历userChannels，id=item.id，seq=i+1
        for (let i = 0; i < this.userChannels.length; i++) {
          updateChannelsArr[i] = {
            id: this.userChannels[i].id,
            seq: i + 1
          }
        }
        updateChannelsArr = [...updateChannelsArr, { id: channelId, seq: this.userChannels.length + 1 }]
      } else {
        // 删减user频道
        // 原userChannels要删去id是传进来id的对象
        this.userChannels.splice(this.userChannels.findIndex((item) => { return item.id === channelId }), 1)
        for (let i = 0; i < this.userChannels.length; i++) {
          updateChannelsArr[i] = {
            id: this.userChannels[i].id,
            seq: i + 1
          }
        }
      }
      // 更新之后要重新获取频道传给组件
      await updateUserChannels(updateChannelsArr)
      const res = await getUserChannels()
      this.userChannels = res.data.data.channels
    },
    clickCloseicon () {
      // 重置频道组件的编辑状态
      this.$refs.ChannelEdit.changeornot = false
    },
    intoChannel (channelId) {
      // 关闭频道界面；改active值为选中的seq-1=index
      this.show = false
      this.activeid = channelId
    },
    listChange (name, title) {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.scrollLen[this.activeid]
      })
    },
    // scollRem (obj) {
    //   this.scrolllen = obj.scrollTop
    // },
    beforeChange () {
      this.scrollLen[this.activeid] = document.documentElement.scrollTop
      return true
    },
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
    }
  },
  async created () {
    const res = await getUserChannels()
    const resall = await getAllChannels()
    this.userChannels = res.data.data.channels
    this.allChannels = resall.data.data.channels
  },
  activated () {
    // 失活时保存滚动距离
    // 激活时取出
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.addEventListener('scroll', this.scrollFn)
  },
  components: {
    ArticleList,
    ChannelEdit
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
/deep/ .van-tabs__content {
  padding-top: 44px;
}

// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
</style>
