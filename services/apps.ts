import {
  App,
  CreateAppResponse,
  CreateAppRequest,
  AppFilter
} from "@/model/app";
import apiLinks from "@/utils/api-links";
import httpClient from "@/utils/http-client";

const getApps = async (params?: AppFilter): Promise<App[]> => {
  const response = await httpClient.get<App[]>({
    url: apiLinks.apps.getApps,
    params: params
  });
  return response.data;
};

const createApp = async (data: CreateAppRequest): Promise<CreateAppResponse> => {
  const response = await httpClient.post<CreateAppResponse>({
    url: apiLinks.apps.getApps,
    data: data
  });
  return response.data;
};

const cleanUp = async (): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.apps.cleanUp,
  });};

const appServices = {
  getApps,
  createApp,
  cleanUp
};

export default appServices;
