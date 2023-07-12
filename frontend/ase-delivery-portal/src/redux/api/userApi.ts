import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./index";
import defaultSettings from "../../defaultSettings";
import { User, UserInput, UserUpdate } from "../../repository/types/user";

const { userServicePath: route } = defaultSettings;

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users", "User"],
  baseQuery,
  endpoints: (builder) => ({
    currentUser: builder.query<User | undefined, void>({
      query: () => route + "/current",
      providesTags: (result, error, arg) => [{ type: 'User', id: result?.id }]
    }),
    getUserByEmail: builder.query<User, String | undefined>({
      query: (email: string) => `${route}/${email}`,
    }),
    listUsers: builder.query<User[], void>({
      query: () => route,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Users", id } as const)),
              { type: "Users", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Users", id: "LIST" }],
    }),
    createUser: builder.mutation<User, UserInput>({
      query: (user: UserInput) => ({
        url: route,
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<User, UserUpdate>({
      query: (user: UserUpdate) => ({
        url: `${route}/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation<String, String>({
      query: (id: string) => ({
        url: `${route}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useListUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
} = userApi;
