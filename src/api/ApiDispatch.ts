import type {Query} from "@/api/Api";
import {apiInstance} from "@/api/Api";

export const getJobDetailsApi = (query?: Query) => {
  return apiInstance.get("/api/dispatch/schedule/jobs", {params: query});
};

export const delJobDetails = (jobName: string, jobGroup: string) => {
  return apiInstance.delete(` /api/dispatch/schedule/jobs/${jobGroup}/${jobName}/delete `);
};

interface CreateJobs {
  name: string;
  group: string;
  jobClass: string;
  cronExpression: string;
  startAt: string;
  endAt: string;
  input: object;
}

export const createJobs = (data: CreateJobs) => {
  return apiInstance.post(` /api/dispatch/schedule/jobs `, data);
};


export interface QueryMessageModel {
  category: string | null;
}

export const getMessagesApi = (query?: QueryMessageModel) => {
  return apiInstance.get("/api/dispatch/schedule/messages", {params: query});
};
