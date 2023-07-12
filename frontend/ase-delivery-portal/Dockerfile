FROM node:16-alpine as build

WORKDIR /app
COPY . /app/

RUN yarn install
RUN yarn build

FROM nginx:1.12-alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

ARG REACT_APP_BACKEND_ENDPOINT=it-didnt-work
ENV REACT_APP_BACKEND_ENDPOINT=$REACT_APP_BACKEND_ENDPOINT

CMD ["nginx", "-g", "daemon off;"]