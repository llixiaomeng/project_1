<template>
  <div>
    <keep-alive exclude="ArticleDetail,Login,Search,SearchResult,UserInfo">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
</style>
