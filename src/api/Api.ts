import axios from "axios"

const apiInstance = axios.create({
  timeout: 10000,  //超时时间设置
  // maxRedirects: 0, // 全局禁止自动重定向
});

// 响应拦截器
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;

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
      }
    } else {
      console.error('⚠️ 没有响应，可能是网络问题或者跨域:', error);
    }

    return Promise.reject(error);
  }
)

interface Query {
  page?: number;
  per_page?: number;
}

export const getUsersApi = (query?: Query) => {
  return apiInstance.get("/api/users", {params: query});
};

export const getOauthUsersApi = (query?: Query) => {
  return apiInstance.get("/api/oauthUsers", {params: query});
};

export const getClientRegistrationsApi = (query?: Query) => {
  return apiInstance.get("/api/client/registrations", {params: query});
};


export const getRegisteredClientsApi = (query?: Query) => {
  return apiInstance.get("/api/registered/clients", {params: query});
};

export const getJobDetails = (query?: Query) => {
  return apiInstance.get("/dispatchApi/schedule/jobs", {params: query});
};

export const delJobDetails = (jobName: string, jobGroup: string) => {
  return apiInstance.delete ( ` /dispatchApi/schedule/jobs/${jobGroup}/${jobName}/delete ` ) ;
};

interface CreateJobs {
  name: string;
  group: string;
  jobClass: string;
  cronExpression: string;
  startAt: string;
  endAt: string;
}
export const createJobs = (data: CreateJobs) => {
  return apiInstance.post( ` /dispatchApi/schedule/jobs ` , data ) ;
};
