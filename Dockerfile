FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /app

RUN yarn install --production

COPY dist /app/
COPY package.json /app/package.json
COPY prisma /app/prisma
COPY node_modules /app/node_modules

CMD ["node", "./app.js"]

EXPOSE 3000
