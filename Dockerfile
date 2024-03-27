FROM nginx:stable-alpine3.17
LABEL authors="vikazeni"
COPY ./dist/gui/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
