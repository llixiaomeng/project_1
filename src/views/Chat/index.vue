<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item,index) in conversation" :key="index">
          <!-- 左侧是机器人小思 -->
          <div class="chat-item left" v-if="item.name==='ai'">
            <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <div class="chat-pao">{{item.msg}}</div>
          </div>

          <!-- 右侧是当前用户 -->
          <div class="chat-item right" v-else>
            <div class="chat-pao">{{item.msg}}</div>
            <van-image fit="cover" round :src="$store.state.userphoto" />
          </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field  placeholder="说点什么..." v-model="word">
        <template #button>
          <span  style="font-size:12px;color:#999" @click="sendFun">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入 socket.io-client 包
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
export default {
  data () {
    return {
      word: '',
      conversation: [
        { name: 'ai', msg: '这里是别人说的话' },
        { name: 'me', msg: '这里是我说的话' },
        { name: 'ai', msg: 'hi' },
        { name: 'me', msg: 'hello' },
        { name: 'ai', msg: 'hi' },
        { name: 'me', msg: 'hello' }
      ],
      socket: null // 定义变量，存储 websocket 实例
    }
  },
  methods: {
    sendFun () {
      if (this.word.trim().length === 0) return
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      this.conversation.push({
        name: 'me',
        msg: this.word
      })
      this.$nextTick(() => {
        document.querySelector('.chat-list>div:last-child').scrollIntoView({
          behavior: 'smooth'
        })
      })
      this.word = ''
    }
  },
  created () {
    // 创建实例
    this.socket = io('http://toutiao.itheima.net', { // 'http://geek.itheima.net:8001'拒绝建立
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    // 建立连接&监听
    this.socket.on('connect', () => {
      console.log('success')
    })
    // 接收
    this.socket.on('message', obj => {
      this.conversation.push({
        name: 'ai', msg: obj.msg
      })
      // 最后一条滚入
      this.$nextTick(() => {
        document.querySelector('.chat-list>div:last-child').scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  destroyed () {
    // 关闭&销毁
    this.socket.close()
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
