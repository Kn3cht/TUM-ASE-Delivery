FROM node:16-alpine as build

WORKDIR /app
COPY . /app/

RUN yarn install
RUN yarn build:localdeployment

FROM nginx:1.12-alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

ARG REACT_APP_BACKEND_ENDPOINT_LOCAL_DEPLOYMENT=it-didnt-work
ENV REACT_APP_BACKEND_ENDPOINT_LOCAL_DEPLOYMENT=$REACT_APP_BACKEND_ENDPOINT_LOCAL_DEPLOYMENT

CMD ["nginx", "-g", "daemon off;"]