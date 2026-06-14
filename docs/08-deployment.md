# 08. 部署方案

## MVP 部署方案

### 方案 A：一台服务器部署

适合低成本验证。

```text
ECS/CVM
  - Nginx
  - 前端静态文件
  - 后端 API
  - PostgreSQL
```

优点：

- 成本低。
- 部署简单。
- 适合 demo。

缺点：

- 容灾弱。
- 数据库和应用互相影响。

### 方案 B：推荐正式部署

```text
CDN + OSS/COS：前端静态文件
ECS/CVM：后端 API
RDS PostgreSQL：数据库
Redis：缓存
AI API：第三方或自建
```

## Docker Compose 示例

```yaml
services:
  api:
    image: travel-globe-api:latest
    container_name: travel-globe-api
    restart: always
    env_file:
      - .env
    ports:
      - "127.0.0.1:8080:8080"
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    container_name: travel-globe-postgres
    restart: always
    environment:
      POSTGRES_DB: travel_globe
      POSTGRES_USER: travel_user
      POSTGRES_PASSWORD: change_me
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"

  redis:
    image: redis:7
    container_name: travel-globe-redis
    restart: always
    ports:
      - "127.0.0.1:6379:6379"
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

生产环境加 HTTPS：

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/nginx/ssl/api.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/api.example.com.key;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 环境变量

```env
NODE_ENV=production
PORT=8080

DATABASE_URL=postgresql://travel_user:password@127.0.0.1:5432/travel_globe
REDIS_URL=redis://127.0.0.1:6379

AI_PROVIDER=deepseek
AI_API_KEY=xxxx
AI_MODEL=deepseek-chat

GEOCODING_PROVIDER=amap
GEOCODING_API_KEY=xxxx

FRONTEND_URL=https://travel.example.com
CORS_ORIGIN=https://travel.example.com
```

## 前端部署

### Vite 构建

```bash
npm run build
```

产物：

```text
dist/
```

可以部署到：

- Nginx。
- OSS/COS 静态网站。
- Vercel。
- Cloudflare Pages。

## 阿里云/腾讯云建议

### 阿里云

- 前端：OSS + CDN。
- 后端：ECS。
- 数据库：RDS PostgreSQL。
- 文件：OSS。

### 腾讯云

- 前端：COS + CDN。
- 后端：CVM。
- 数据库：TencentDB PostgreSQL。
- 文件：COS。

## 自建 Ollama 注意

如果后端调用自建 Ollama：

- 不要把 `11434` 裸开放给所有公网。
- 只允许后端服务器公网 IP 访问。
- 或用 SSH 隧道 / VPN / 内网连接。
- 配置超时和失败兜底。

## CI/CD 简化流程

```text
git push
  -> GitHub Actions
  -> 构建前端
  -> 上传 OSS/COS
  -> 构建后端 Docker 镜像
  -> SSH 到服务器拉取镜像并重启
```

## 备份

最低要求：

- PostgreSQL 每日备份。
- 备份上传对象存储。
- 保留 7-30 天。
- 定期做恢复测试。

自建 PostgreSQL 备份命令：

```bash
pg_dump -h 127.0.0.1 -U travel_user travel_globe > backup_$(date +%F).sql
```
