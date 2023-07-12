import { createApi } from "@reduxjs/toolkit/query/react";
import { Box, BoxInput, BoxUpdate } from "../../repository/types/box";
import { baseQuery } from "./index";
import defaultSettings from "../../defaultSettings";

const { boxServicePath: route } = defaultSettings;

// Define a service using a base URL and expected endpoints
export const boxApi = createApi({
  reducerPath: "boxApi",
  tagTypes: ["Boxes", "AvailableBoxes"],
  baseQuery,
  endpoints: (builder) => ({
    listBoxes: builder.query<Box[], void>({
      query: () => route,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Boxes", id } as const)),
              { type: "Boxes", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Boxes", id: "LIST" }],
    }),
    listAvailableBoxes: builder.query<Box[], String>({
      query: (customerEmail) => `${route}/available/${customerEmail}`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(
                ({ id }) => ({ type: "AvailableBoxes", id } as const)
              ),
              { type: "AvailableBoxes", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "AvailableBoxes", id: "LIST" }],
    }),
    getBox: builder.query<Box, String | undefined>({
      query: (id: string) => `${route}/${id}`,
    }),
    createBox: builder.mutation<Box, BoxInput>({
      query: (box: BoxInput) => ({
        url: route,
        method: "POST",
        body: box,
      }),
      invalidatesTags: [{ type: "Boxes", id: "LIST" }, { type: "AvailableBoxes", id: "LIST" }],
    }),
    deleteBox: builder.mutation<{ deletedBoxId: string }, String>({
      query: (id: string) => ({
        url: `${route}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Boxes", id: "LIST" }, { type: "AvailableBoxes", id: "LIST" }],
    }),
    updateBox: builder.mutation<Box, BoxUpdate>({
      query: (box: BoxUpdate) => ({
        url: `${route}/${box.id}`,
        method: "PUT",
        body: box,
      }),
      invalidatesTags: [{ type: "Boxes", id: "LIST" }, { type: "AvailableBoxes", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useListBoxesQuery,
  useCreateBoxMutation,
  useDeleteBoxMutation,
  useUpdateBoxMutation,
  useGetBoxQuery,
  useLazyGetBoxQuery,
  useListAvailableBoxesQuery,
} = boxApi;
