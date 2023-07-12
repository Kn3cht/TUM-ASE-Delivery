import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./index";
import defaultSettings from "../../defaultSettings";
import {
  CreateDeliveryResponse,
  DeliveryInput,
  DeliveryUpdate,
  DeliveryWithTrackingUrl,
} from "../../repository/types/delivery";

const { deliveryServicePath: route } = defaultSettings;

export const deliveryApi = createApi({
  reducerPath: "deliveryApi",
  tagTypes: ["Deliveries", "DeliveriesForBox"],
  baseQuery,
  endpoints: (builder) => ({
    listDeliveries: builder.query<DeliveryWithTrackingUrl[], void>({
      query: () => route,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ delivery }) =>
                  ({ type: "Deliveries", id: delivery.id } as const)
              ),
              { type: "Deliveries", id: "LIST" },
            ]
          : [{ type: "Deliveries", id: "LIST" }],
    }),
    listDeliveriesForBox: builder.query<
      DeliveryWithTrackingUrl[],
      String | undefined
    >({
      query: (boxId: string) => `${route}/box/${boxId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ delivery }) =>
                  ({ type: "DeliveriesForBox", id: delivery.id } as const)
              ),
              { type: "DeliveriesForBox", id: "LIST" },
            ]
          : [{ type: "DeliveriesForBox", id: "LIST" }],
    }),
    getDelivery: builder.query<DeliveryWithTrackingUrl, String | undefined>({
      query: (id: string) => `${route}/${id}`,
    }),
    trackDelivery: builder.query<DeliveryWithTrackingUrl, String | undefined>({
      query: (id: string) => `${route}/track/${id}`,
    }),
    createDelivery: builder.mutation<CreateDeliveryResponse, DeliveryInput>({
      query: (delivery: DeliveryInput) => ({
        url: route,
        method: "POST",
        body: delivery,
      }),
      invalidatesTags: [{ type: "Deliveries", id: "LIST" }],
    }),
    deleteDelivery: builder.mutation<{ deletedDeliveryId: string }, String>({
      query: (id: string) => ({
        url: `${route}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Deliveries", id: "LIST" }],
    }),
    pickUpDelivery: builder.mutation<String, String>({
      query: (id: string) => ({
        url: `${route}/en_route/${id}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Deliveries", id: "LIST" }],
    }),
    updateDelivery: builder.mutation<DeliveryWithTrackingUrl, DeliveryUpdate>({
      query: (delivery: DeliveryUpdate) => ({
        url: `${route}/${delivery.id}`,
        method: "PUT",
        body: delivery,
      }),
      invalidatesTags: [{ type: "Deliveries", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useListDeliveriesForBoxQuery,
  useListDeliveriesQuery,
  useCreateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetDeliveryQuery,
  useLazyGetDeliveryQuery,
  useUpdateDeliveryMutation,
  usePickUpDeliveryMutation,
  useLazyTrackDeliveryQuery,
} = deliveryApi;
