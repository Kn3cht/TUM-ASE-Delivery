module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              cssOptions: {
                // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  "primary-color": "#1DA57A",
                  "link-color": "#1DA57A",
                },
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  "primary-color": "#1DA57A",
                  "link-color": "#1DA57A",
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
};
