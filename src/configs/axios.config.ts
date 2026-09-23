import axios from "axios";
import { store } from "@/redux/store";

const api = axios.create({
   baseURL: import.meta.env.VITE_BUSINESS_SERVICE_BASE_URL,
});

api.interceptors.request.use((config) => {
 const state = store.getState();
 const loginAs = state.loginAs.loginAs

  // eslint-disable-next-line no-param-reassign
  config.headers["login-as"] = loginAs;

  // eslint-disable-next-line no-param-reassign
  config.params = {
   ...config.params,
   loginAs: loginAs,
  };

  return config;
});

export default api;