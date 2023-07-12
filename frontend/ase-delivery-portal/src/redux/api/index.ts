import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import defaultSettings from "../../defaultSettings";
import Cookies from "js-cookie";

export const baseQuery = fetchBaseQuery({
  baseUrl: defaultSettings.restBasePath,
  mode: "cors",
  credentials: "include",
  isJsonContentType: () => true,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("token");

    const csrfToken = Cookies.get("XSRF-TOKEN");

    // set csrfToken
    if (csrfToken) {
      headers.set("X-XSRF-TOKEN", csrfToken);
    }

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
