<template>
  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artListObj.title }}</span>
          <!-- <img
            class="thumb"
            v-if="artListObj.cover.type === 1"
            :src="artListObj.cover.images[0]"
          /> -->
          <van-image lazy-load :src="artListObj.cover.images[0]" class="thumb" v-if="artListObj.cover.type === 1">
           <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <div class="thumb-box" v-if="artListObj.cover.type > 1">
          <van-image lazy-load class="thumb" :src="artListObj.cover.images[0]">
            <template v-slot:error>加载失败</template>
          </van-image>
          <van-image lazy-load class="thumb" :src="artListObj.cover.images[1]">
            <template v-slot:error>加载失败</template>
          </van-image>
          <van-image lazy-load class="thumb" :src="artListObj.cover.images[2]">
            <template v-slot:error>加载失败</template>
          </van-image>
          <!-- <img class="thumb" :src="artListObj.cover.images[0]" />
          <img class="thumb" :src="artListObj.cover.images[1]" />
          <img class="thumb" :src="artListObj.cover.images[2]" /> -->
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artListObj.aut_name }}</span>
            <span>{{ artListObj.comm_count }}评论</span>
            <span>{{ timeForm }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="feedback" />
          <van-action-sheet
            v-model="show"
            :actions="actions"
            :cancel-text="cancelText"
            close-on-click-action
            @cancel="onCancel"
            @select="onSelect($event,artListObj.art_id)"
            get-container="body"
            @click-overlay="clickOverlay"
          />
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/report'
export default {
  data () {
    return {
      timeForm: this.timeAgo(this.artListObj.pubdate),
      show: false,
      actions: firstActions,
      cancelText: '取消',
      feedbackbn: this.feedback
    }
  },
  methods: {
    timeAgo: timeAgo,
    onSelect (item, artId) {
      // 默认情况下点击选项时不会自动收起，可以通过 close-on-click-action 属性开启自动收起
      // 二级面板
      if (this.actions === secondActions) {
        this.$emit('artReports', artId, item.value)
        this.actions = firstActions
        this.cancelText = '取消'
      } else if (item.name === '反馈垃圾内容') {
        this.show = true
        this.actions = secondActions
        this.cancelText = '返回'
      } else {
        this.$emit('noInterest', artId)
        this.show = false
      }
    },
    onCancel () {
      // 底部取消按钮，点击后关闭当前面板并触发 cancel 事件。
      if (this.cancelText === '返回') {
        this.show = true
        this.actions = firstActions
        this.cancelText = '取消'
      }
    },
    clickOverlay () {
      this.actions = firstActions
      this.cancelText = '取消'
    }
  },
  props: {
    artListObj: Object,
    feedback: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
