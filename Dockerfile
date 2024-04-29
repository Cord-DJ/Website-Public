FROM nginx:alpine
WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/cord/browser .
