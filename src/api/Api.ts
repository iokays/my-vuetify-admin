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

export const getJobDetailsApi = (query?: Query) => {
  return apiInstance.get("/dispatchApi/schedule/jobs", {params: query});
};

export const delJobDetails = (jobName: string, jobGroup: string) => {
  return apiInstance.delete(` /dispatchApi/schedule/jobs/${jobGroup}/${jobName}/delete `);
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
  return apiInstance.post(` /dispatchApi/schedule/jobs `, data);
};

// src/types/oauth/CreateRegisteredClientModel.ts
export interface CreateRegisteredClientModel {
  clientId: string;
  clientIdIssuedAt: string; // ISO8601格式时间字符串
  clientSecret: string;
  clientSecretExpiresAt: string | null; // ISO8601格式时间字符串，null表示永不过期
  clientName: string;
  clientAuthenticationMethods: string[];
  authorizationGrantTypes: string[];
  redirectUris: string[];
  postLogoutRedirectUris: string[];
  scopes: string[];
  clientSettings: ClientSettings; // 解析后的客户端设置对象
  tokenSettings: TokenSettings; // 解析后的令牌设置对象
}

// 客户端设置类型
export interface ClientSettings {
  requireProofKey?: boolean; // 是否要求PKCE
  requireAuthorizationConsent?: boolean; // 是否需要授权确认
  jwkSetUrl?: string; // JWK Set URL
  tokenEndpointAuthenticationSigningAlgorithm?: string; // 令牌端点认证签名算法
}

// 令牌设置类型
export interface TokenSettings {
  authorizationCodeTimeToLive?: number; // 授权码有效期(秒)
  accessTokenTimeToLive?: number; // 访问令牌有效期(秒)
  refreshTokenTimeToLive?: number; // 刷新令牌有效期(秒)
  reuseRefreshTokens?: boolean; // 是否重用刷新令牌
  idTokenSignatureAlgorithm?: string; // ID Token签名算法
}

export const createRegisteredClientApi = (data: CreateRegisteredClientModel) => {
  return apiInstance.post(` /api/registered/clients`, data);
};

export const removeRegisteredClientApi = (clientRegistrationId: string) => {
  return apiInstance.delete(`/api/registered/clients/${clientRegistrationId}`);
};

export interface CreateClientRegistrationModel {
  registrationId: string, //客户端标识符
  clientRegistrationType: string; // 客户端注册类型
  clientId: string; // 客户端ID
  clientName: string; // 客户端名称
  clientSecret: string; // 客户端密钥
  clientAuthenticationMethod: string; // 认证方法
  authorizationGrantType: string; // 授权类型
  scopes: Set<string>; // 权限范围
  authorizationUri: string; // 授权端点
  tokenUri: string; // 令牌端点
  userInfoUri?: string; // 用户信息端点(OIDC可选)
  userNameAttributeName?: string; // 用户名属性名(OIDC)
  jwkSetUri?: string; // JWKS端点(OIDC)
}

export const createClientRegistrationApi = (data: CreateClientRegistrationModel) => {
  return apiInstance.post(`/api/client/registrations`, data);
};

export const deleteClientRegistrationApi = (clientRegistrationId: string) => {
  return apiInstance.delete(`/api/client/registrations/${clientRegistrationId}`);
};

export interface QueryMessageModel {
  category: string | null;
}


export const getMessagesApi = (query?: QueryMessageModel) => {
  return apiInstance.get("/dispatchApi/schedule/messages", {params: query});
};
