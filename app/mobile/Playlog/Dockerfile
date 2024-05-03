FROM node:16

WORKDIR /app

COPY . /app

RUN npm install -g react-native-cli

RUN npm install

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
