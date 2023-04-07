<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userPro.photo"
            @click="$refs.imginput.click()"
          />
          <input
            type="file"
            v-show="false"
            ref="imginput"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userPro.name"
        @click="changeName"
      />
      <van-cell
        title="生日"
        is-link
        :value="userPro.birthday"
        @click="showPopup"
      />
    </van-cell-group>

    <van-dialog
      v-model="show"
      title="修改昵称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <input type="text" v-autofocus v-model.trim="changename" />
    </van-dialog>

    <van-popup v-model="showData" position="bottom" :style="{ height: '30%' }" @confirm="confirmData" @cancel="showData = false">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment'
import { getUserProAPI, updatePhotoAPI, updateProAPI } from '@/api/index'
import { Notify } from 'vant'
export default {
  data () {
    return {
      userPro: {},
      changename: '',
      show: false,
      showData: false,
      minDate: new Date(1923, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  methods: {
    async onFileChange (e) {
      // 获取img对象，转格式为formdata，调用api
      if (e.target.files.length === 0) return
      const formObj = new FormData()
      formObj.append('photo', e.target.files[0])
      const res = await updatePhotoAPI(formObj)
      this.userPro.photo = res.data.data.photo
    },
    changeName () {
      this.show = true
      this.changename = this.userPro.name
    },
    async beforeClose (action, done) {
      // 调用 done() 后关闭弹窗，调用 done(false) 阻止弹窗关闭
      if (action === 'confirm') {
        const nameReg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        // 正则校验，符合：关闭&调用api保存&更新；不符合：阻止关闭，弹窗提醒
        if (nameReg.test(this.changename)) {
          await updateProAPI({ name: this.changename })
          this.userPro.name = this.changename
          done()
        } else {
          done(false)
          Notify({
            type: 'danger',
            message: '请输入不多于7位、由字母或数字组成的昵称'
          })
        }
      } else if (action === 'cancel') {
        // 取消之后直接关闭
        done()
      }
    },
    showPopup () {
      this.showData = true
      // 默认自己的生日
      this.currentDate = new Date(this.userPro.birthday)
    },
    async confirmData (value) {
      // 确认时间传给api&显示在页面
      const datestring = moment(value).format('YYYY-MM-DD')
      await updateProAPI({ birthday: datestring })
      this.userPro.birthday = datestring
      this.showData = false
    }
  },
  async created () {
    const res = await getUserProAPI()
    this.userPro = res.data.data
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

//input居中 van-dialog__content
/deep/ .van-dialog__content {
  text-align: center;
  input {
    text-align: center;
    border: none;
    outline: none;
    padding: 0;
  }
}
</style>
