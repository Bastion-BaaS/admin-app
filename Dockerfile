FROM node:16-alpine

RUN mkdir -p /admin_backend

COPY . /admin_backend

CMD ["node", "/admin_backend/index.js"]