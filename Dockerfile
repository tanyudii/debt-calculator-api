FROM node:14-alpine as development

WORKDIR /usr/local/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:14-alpine as build

WORKDIR /usr/local/app

COPY dist package.json yarn.lock ./

RUN yarn install --production

FROM node:14-alpine

WORKDIR /usr/local/app

COPY --from=build /usr/local/app .

EXPOSE 3000

CMD ["node", "main.js"]