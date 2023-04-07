<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <!-- <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" />
      </template> -->
    </van-nav-bar>

    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span
          >我的频道
          <span class="small-title"> 点击{{changeornot?'编辑':'进入'}}频道 </span>
        </span>
        <span @click="changeChannels">{{changeornot?'完成':'编辑'}}</span>
      </div>

      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="useritem in userChannels" :key="useritem.id" @click="deleteChannel(useritem.id)">
          <div class="channel-item van-hairline--surround">
            {{useritem.name}}
            <!-- 删除的徽标 -->
            <van-badge
              color="transparent"
              class="cross-badge"
              v-if="changeornot && useritem.name!=='推荐' "
            >
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in chooseChannel" :key="item.id" @click="addChannel(item.id)">
          <div class="channel-item van-hairline--surround">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      changeornot: false
    }
  },
  props: {
    userChannels: Array,
    allChannels: Array
  },
  methods: {
    changeChannels () { // 编辑按钮控制叉叉出现否
      this.changeornot = !this.changeornot
    },
    // 触发parent的更改频道api，把对应item.id传过去
    addChannel (channelId) {
      if (this.changeornot) { this.$emit('updateChannels', channelId, 1) }
    },
    deleteChannel (channelId) {
      if (this.changeornot && channelId !== 0) { this.$emit('updateChannels', channelId, -1) }
      if (!this.changeornot) {
        // 进入频道
        this.$emit('intoChannel', channelId)
      }
    }
  },
  computed: {
    chooseChannel () {
      const newArr = this.allChannels.filter((allitem) => {
        return !this.userChannels.find((useritem) => {
          return useritem.id === allitem.id
        })
      })
      // console.log(newArr)
      return newArr
    }
  },
  created () {
    // console.log(this.allChannels, this.userChannels)
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
