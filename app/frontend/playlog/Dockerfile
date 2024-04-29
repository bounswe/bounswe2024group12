FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
