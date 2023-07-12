import { configureStore } from "@reduxjs/toolkit";
import { boxApi } from "./api/boxApi";
import { userApi } from "./api/userApi";
import { authApi } from "./api/authApi";
import { deliveryApi } from "./api/deliveryApi";

const store = configureStore({
  devTools: true,
  preloadedState: {},
  reducer: {
    [boxApi.reducerPath]: boxApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(boxApi.middleware)
      .concat(userApi.middleware)
      .concat(authApi.middleware)
      .concat(deliveryApi.middleware),
});

export default store;
