FROM node:22.5.1-alpine3.19

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

CMD ["serve", "-s", "dist", "-l", "3000"]