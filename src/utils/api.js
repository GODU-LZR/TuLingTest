import axios from 'axios'
import { Message } from 'element-ui'

const instance = axios.create({
  baseURL: 'http://pve.lycoris.site:9780',
  timeout: 30000,
  // 允许返回所有状态码，不会遇到错误就停止
  validateStatus: (status) => status >= 200 && status <= 600,
})

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    console.error(err)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (res) => {
    if (res.status < 200 || res.status > 400) {
      const statusText = res.statusText
      Message.error(`网络请求错误，错误：${statusText}`)
      throw new Error(statusText)
    }
    if (res.data.code !== 200) {
      const message = res.data.message || '网络请求错误'
      Message.error(message)
      throw new Error(message)
    }
    return res.data // 配置只返回data
  },
  (err) => {
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      Message.error('请求超时，请尝试刷新页面')
    } else {
      Message.error(`网络请求错误，错误：${err}` || '网络请求错误')
    }
    throw new Error(err)
  },
)

// 封装get/post方法
export const api = {
  async get(url, params) {
    const res = await instance.get(url, { params })
    return res.data
  },
  async post(url, data) {
    const res = await instance.post(url, data)
    return res.data
  },
  async postParams(url, params) {
    const res = await instance.post(url, null, { params })
    return res.data
  },
  async delete(url, params) {
    const res = await instance.delete(url, { params })
    return res.data
  },
}
