# Stage 1: Build React 19 production bundle
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent || npm install

COPY . .
RUN npm run build

# Stage 2: Nginx high-performance static asset server
FROM nginx:alpine

# Copy custom nginx configuration for SPA routing
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /screenshots/ {
        proxy_pass http://backend:8080/screenshots/;
        proxy_set_header Host \$host;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
