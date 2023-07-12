import {createApi, } from "@reduxjs/toolkit/query/react";
import {baseQuery} from "./index";
import defaultSettings from "../../defaultSettings";
import {LoginCredentials, LoginResult} from "../../repository/types/auth";
import {credentialsToBaseAuthHeader} from "../../utils/auth";

const { authServicePath: route } = defaultSettings;

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    getCsrf: builder.query<Boolean, void>({
      query: () => `${route}/csrf`,
    }),
    login: builder.mutation<LoginResult, LoginCredentials>({
      query: (loginCredentials: LoginCredentials) => ({
        url: route + "/login",
        method: "POST",
        headers: {
          Authorization: `Basic ${credentialsToBaseAuthHeader(
            loginCredentials
          )}`,
        },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: route + "/logout",
        method: "POST",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation, useLazyGetCsrfQuery } = authApi;
