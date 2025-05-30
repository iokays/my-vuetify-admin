import type {Query} from "@/api/Api";
import {apiInstance} from "@/api/Api";

export const pageProcessDefinitionsApi = (query?: Query) => {
  return apiInstance.get("/api/flowable/processDefinitions", {params: query});
};

export const pageProcessInstancesApi = (query?: Query) => {
  return apiInstance.get("/api/flowable/processInstances", {params: query});
};

export const pageProcessTasksApi = (query?: Query) => {
  return apiInstance.get("/api/flowable/processTasks", {params: query});
};

export const uploadProcessDefinitionApi = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiInstance.post("/api/flowable/processDefinitions/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
