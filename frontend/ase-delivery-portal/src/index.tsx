import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { AseConfigProvider } from "./components/AseConfigProvider";

import store from "./redux/index";
import { Provider } from "react-redux";
import Home from "./pages/Home";
import Users from "./pages/Users";
import FourOhFour from "./pages/404";
import Forbidden from "./pages/Forbidden";
import UserDetails from "./pages/UserDetails";
import { AseRoute } from "./utils/auth";
import Deliveries from "./pages/Deliveries";
import Boxes from "./pages/Boxes";
import Delivery from "./pages/Deliveries/Delivery";
import { PickUpDelivery } from "./pages/Api/PickUpDelivery";
import BoxPreview from "./pages/Boxes/Box";
import DeliveryConfig from "./pages/Deliveries/NewDelivery";
import { DeliveryConfigWrapper } from "./pages/Deliveries/NewDelivery/DeliveryConfigWrapper";
import Privacy from "./pages/Privacy";
import Imprint from "./pages/Imprint";
import Statistics from "./pages/Statistics";

const router = createBrowserRouter([
  {
    path: AseRoute.HOME,
    element: <Home />,
  },
  {
    path: AseRoute.LOGIN,
    element: <Login />,
  },
  {
    path: AseRoute.USERS,
    element: <Users />,
  },
  {
    path: AseRoute.USER_DETAILS,
    element: <UserDetails />,
  },
  {
    path: AseRoute.FORBIDDEN,
    element: <Forbidden />,
  },
  {
    path: AseRoute.DELIVERIES,
    element: <Deliveries />,
  },
  {
    path: AseRoute.DELIVERY,
    element: <Delivery />,
  },
  {
    path: AseRoute.DELIVERY_CONFIGURATION,
    element: <DeliveryConfigWrapper />,
    children: [
      {
        path: AseRoute.DELIVERY_CONFIGURATION,
        element: <DeliveryConfig />,
      },
      {
        path: AseRoute.EDIT_DELIVERY,
        element: <DeliveryConfig />,
      },
    ],
  },
  {
    path: AseRoute.BOXES,
    element: <Boxes />,
  },
  {
    path: AseRoute.BOX,
    element: <BoxPreview />,
  },
  {
    path: AseRoute.SCAN_QR,
    element: <PickUpDelivery />,
  },
  {
    path: AseRoute.PRIVACY,
    element: <Privacy />,
  },
  {
    path: AseRoute.IMPRINT,
    element: <Imprint />,
  },
  {
    path: AseRoute.STATISTICS,
    element: <Statistics />,
  },
  {
    path: "*",
    element: <FourOhFour />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AseConfigProvider>
        <RouterProvider router={router} />
      </AseConfigProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
