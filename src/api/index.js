// 统一封装接口方法，每个方法负责请求一个url并暴露
// 逻辑页面导入该方法就可以发请求
import { getToken } from '@/utils/token.js'
import request from '../utils/request.js'

// 根据需求设置接口方法并暴露，逻辑页面import {apiname} from ???
export const apiname = () => request({
  url: '???',
  method: 'GET'
})

export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: { mobile, code }
})

// 获取所有频道、获取用户频道、更新用户频道
export const getAllChannels = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

export const getUserChannels = () => request({
  url: '/v1_0/user/channels',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const updateUserChannels = (channels) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels: channels
  }
})

export const getArticle = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params: {
    channel_id,
    timestamp: timestamp || (new Date()).getTime()
  }
})

// 反馈面板
export const noInterestApi = (artId) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: { target: artId }
})

export const artReportsApi = ({ artId, value, remark = '其他问题的说明' }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: value,
    remark
  }
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 搜索页面
export const suggestionAPI = (searchWord) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q: searchWord
  }
})

export const searchResultsAPI = ({ page, perpage = 10, kw }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page: perpage,
    q: kw
  }
})

// 文章详情
export const articleDetailAPI = (article_id) => request({
  url: `/v1_0/articles/${article_id}`,
  method: 'GET'
})

export const followAutAPI = (target) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target
  }
})

export const notfollowAutAPI = (target) => request({
  url: `/v1_0/user/followings/${target}`,
  method: 'DELETE'
})

export const likeArtAPI = (target) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target
  }
})

export const dislikeArtAPI = (target) => request({
  url: `/v1_0/article/likings/${target}`,
  method: 'DELETE'
})

// 文章评论相关接口
export const getCommentsAPI = ({ type = 'a', source, offset = null }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type, // 'a'代表对文章的评论列表, 'c'代表对评论的回复列表
    source,
    offset,
    limit: '5'
  }
})

export const likeCommentAPI = (target) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target
  }
})

export const dislikeCommentAPI = (target) => request({
  url: `/v1_0/comment/likings/${target}`,
  method: 'DELETE'
})

export const addCommentAPI = ({ target, content, art_id = null }) => request({
  url: '/v1_0/comments',
  method: 'POST',
  data: {
    target,
    content,
    art_id
  }
})

// 个人中心
export const getUserProAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'GET'
})

export const updatePhotoAPI = (formObj) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: formObj
})

export const updateProAPI = (obj) => {
  const dataobj = { name: '', gender: 1, birthday: '', real_name: '', intro: '' }

  for (const prop in obj) {
    if (dataobj[prop] === undefined) {
      delete dataobj[prop]
    } else {
      dataobj[prop] = obj[prop]
    }
  }

  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: dataobj
  })
}
