import { Claim } from "@/model/account";
import apiLinks from "@/utils/api-links";
import httpClient from "@/utils/http-client";

const logout = (returnUrl?: string) => {
    const url =
      `${apiLinks.account.logout}?redirectUri=${encodeURIComponent(
        returnUrl ?? window.location.href
      )}`;
  
    window.location.href = url;
}

const getInfo = async (): Promise<Claim[]> => {
  const response = await httpClient.get<Claim[]>({
    url: apiLinks.account.info,
  });
  return response.data;
};
  
const accountServices = {
    logout,
    getInfo
};
  
export default accountServices;