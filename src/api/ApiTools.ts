import {apiInstance} from "@/api/Api";

export const ipAddressApi = () => {
  return apiInstance.get("/api/tools/ipAddress");
};

export const portCheckerApi = async (model: {
  domain: string;
  ports: number[];
}) => {
  // Convert ports array to comma-separated string
  const portsParam = model.ports.join(',');

  const response = await fetch(`/api/tools/portChecker?domain=${encodeURIComponent(model.domain)}&ports=${encodeURIComponent(portsParam)}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body;
};

export const sqlPrettyApi = (model: {
  sql: string
}) => {
  return apiInstance.post("/api/tools/sqlPretty", model);
};

export const jsonPrettyApi = (model: {
  content: string
}) => {
  return apiInstance.post("/api/tools/jsonPretty", model, {
    responseType: 'text' // 关键：强制返回字符串，不自动解析
  });
};
