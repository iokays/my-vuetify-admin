import axios from "axios"
import {useSnackbarStore} from '@/stores/Snackbar'

// 由于 axios 不在组件中，要手动创建 pinia 实例（如果你没用 SSR）
const snackbar = useSnackbarStore()

export const apiInstance = axios.create({
  timeout: 10000,  //超时时间设置
  // maxRedirects: 0, // 全局禁止自动重定向
});

// 响应拦截器
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {response, config} = error;

    console.warn('❌ 请求失败');
    console.log('请求地址:', config?.url);
    console.log('完整配置信息:', config);

    if (response) {
      if (response.status === 401) {
        console.warn('401 未授权，跳转登录')// 保存当前页面的 URL
        // 获取当前页面的 URL
        const currentUrl = window.location.href;
        console.warn('currentUrl: ' + currentUrl);
        window.location.href = '/login?targetUrl=' + encodeURIComponent(currentUrl);
      } else if (response.status === 403) {
        // 全局提示（通过事件、Pinia、inject 等方式实现）
        console.warn('403 未授权，您没有权限访问该资源')// 保存当前页面的 URL
        snackbar.open('您没有权限访问该资源')
        console.log('Snackbar visibility before:', snackbar.visible); // 调试
      }
    } else {
      console.error('⚠️ 没有响应，可能是网络问题或者跨域:', error);
    }

    return Promise.reject(error);
  }
)

export interface Query {
  page?: number;
  size?: number;
}
