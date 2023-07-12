interface DefaultSettings {
  restBasePath: string;
  boxServicePath: string;
  deliveryServicePath: string;
  userServicePath: string;
  authServicePath: string;
}

const defaultSettings: DefaultSettings = {
  restBasePath:
    process.env.REACT_APP_BACKEND_ENDPOINT_LOCAL_DEPLOYMENT ||
    process.env.REACT_APP_BACKEND_ENDPOINT ||
    "http://localhost:8080",

  boxServicePath: "/boxes",
  userServicePath: "/users",
  authServicePath: "/auth",
  deliveryServicePath: "/deliveries",
};

export default defaultSettings;
