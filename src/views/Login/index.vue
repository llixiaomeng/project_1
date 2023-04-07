<template>
  <div>
    <van-nav-bar
      title="柠檬头条-登录"
    />
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        placeholder="请输入11位手机号"
        required
        :rules="[{ required: true, message: '请填写手机号', pattern:/^1[3-9]\d{9}$/ }]"
      />
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        placeholder="请输入6位密码"
        required
        :rules="[{ required: true, message: '请填写密码', pattern:/^\d{6}$/ }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit" :loading="isloading" :disabled="isloading" loading-text="加载中...">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/index'
import { Notify } from 'vant'
import { setToken } from '@/utils/token'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '',
        code: '246810'// 必须是246810
      },
      isloading: false,
      disabled: false
    }
  },
  methods: {
    async onSubmit (values) {
      this.isloading = true
      try {
        const res = await loginAPI(values)
        // re:e64b2b9e-ec6b-4947-9e96-15f613d6ed04
        const { data: tokendata } = res.data
        console.log(tokendata)
        // const res2 = await refreshTokenApi(tokendata.refresh_token)
        // console.log(res2)
        // setToken(res2.data.data.token)
        setToken(tokendata.token)
        this.$router.replace({
          path: '/layout/home'
        })
        Notify({ type: 'success', message: '登陆成功！' })
      } catch (err) {
        Notify({ type: 'danger', message: '请输入正确的密码' })
      }
      this.isloading = false
    }
  }
}
</script>

<style lang="less"></style>
