// 封装三个专门用于操作token的接口
const key = 'myuser'

// 增
export const setToken = (token) => {
  localStorage.setItem(key, token)
}

// 获取
export const getToken = () => localStorage.getItem(key)

// 删
export const removeToken = () => {
  localStorage.removeItem(key)
}

export const setRefreshToken = (refreshToken) => {
  localStorage.setItem(key + 'refresh', refreshToken)
}
