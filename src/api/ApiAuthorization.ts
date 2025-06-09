import type {Query} from "@/api/Api";
import {apiInstance} from "@/api/Api";

export const logoutApi = () => {
  return apiInstance.get("/logout", {});
};

export const getUsersApi = (query?: Query) => {
  return apiInstance.get("/api/authorization/users", {params: query});
};

export const getGroupsApi = (query?: Query) => {
  return apiInstance.get("/api/authorization/groups", {params: query});
};

export const getOauthUsersApi = (query?: Query) => {
  return apiInstance.get("/api/authorization/oauthUsers", {params: query});
};

export const getClientRegistrationsApi = (query?: Query) => {
  return apiInstance.get("/api/authorization/client/registrations", {params: query});
};


export const getRegisteredClientsApi = (query?: Query) => {
  return apiInstance.get("/api/authorization/registered/clients", {params: query});
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
  clientSettings?: ClientSettings; // 解析后的客户端设置对象
  tokenSettings?: TokenSettings; // 解析后的令牌设置对象
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
  return apiInstance.post(` /api/authorization/registered/clients`, data);
};

export const removeRegisteredClientApi = (clientRegistrationId: string) => {
  return apiInstance.delete(`/api/authorization/registered/clients/${clientRegistrationId}`);
};

export const createClientRegistrationApi = (data: {
  registrationId: string, //客户端标识符
  clientRegistrationType: string; // 客户端注册类型
  clientId: string; // 客户端ID
  clientName: string; // 客户端名称
  clientSecret: string; // 客户端密钥
  clientAuthenticationMethod: string; // 认证方法
  authorizationGrantType: string; // 授权类型
  scopes: string[]; // 权限范围
  authorizationUri: string; // 授权端点
  tokenUri: string; // 令牌端点
  userInfoUri?: string; // 用户信息端点(OIDC可选)
  userNameAttributeName?: string; // 用户名属性名(OIDC)
  jwkSetUri?: string; // JWKS端点(OIDC)
}) => {
  return apiInstance.post(`/api/authorization/client/registrations`, data);
};

export const deleteClientRegistrationApi = (clientRegistrationId: string) => {
  return apiInstance.delete(`/api/authorization/client/registrations/${clientRegistrationId}`);
};

export const getUserGroupsApi = (username: string) => {
  return apiInstance.get(`/api/authorization/users/groups`, {params: {"username": username}});
};

export const setUserGroupsApi = (data: {
                                   username: string,
                                   groupIds: string[]
                                 }) => {
  return apiInstance.post(`/api/authorization/users/groups`, data);
};
