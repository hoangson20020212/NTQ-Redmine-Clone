import { UserAccount } from "~/types/user.type";
import http from "~/utils/http";

export const URL_MY_ACCOUNT = "my/account";

const myAccountApi = {
  getAccount() {
    return http.get<UserAccount>(`${URL_MY_ACCOUNT}.json`);
  },

  updateAccount(updates: Partial<UserAccount>) {
    return http.put(`${URL_MY_ACCOUNT}`, updates);
  },
};

export default myAccountApi;
