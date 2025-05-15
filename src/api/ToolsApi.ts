import {apiInstance} from "@/api/Api";

export const ipAddressApi = () => {
  return apiInstance.get("/toolsApi/ipAddress");
};

export const portCheckerApi = async (model: {
  domain: string;
  ports: number[];
}) => {
  // Convert ports array to comma-separated string
  const portsParam = model.ports.join(',');

  const response = await fetch(`/toolsApi/portChecker?domain=${encodeURIComponent(model.domain)}&ports=${encodeURIComponent(portsParam)}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body;
};
