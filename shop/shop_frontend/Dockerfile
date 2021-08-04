FROM node as builder
# USER root
# RUN mkdir /frontend
# WORKDIR /frontend
# COPY . /frontend
# ARG API_URL
# ENV REACT_APP_HOST_IP_ADDRESS $API_URL
# RUN npm run build
# COPY --from=build-stage /frontend/build/ /var/www/frontend
WORKDIR /app
COPY package.json /app/package.json
RUN npm install --only=prod
COPY . /app
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
