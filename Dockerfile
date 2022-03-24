FROM node:16-alpine as base

RUN mkdir -p /usr/admin_backend

WORKDIR /usr/admin_backend

COPY . .

# Shared env vars between development and prod
ENV DB_USER=admin-app \
  DB_PASSWORD=password \
  DB_PORT=27017 \
  DB_NAME=admin-db

FROM base as development

ENV NODE_ENV=development \
  DB_HOST=admin-db

RUN npm install

CMD ["node", "index.js"]

FROM base as production

ENV NODE_ENV=production \
  DB_HOST=localhost

ENV PORT=3001

EXPOSE 3001

RUN npm install --only=production \
    && npm cache clean --force

CMD ["node", "index.js"]
