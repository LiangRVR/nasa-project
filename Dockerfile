FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm install-client --only=production

COPY server/package*.json server/
RUN npm install-serevr --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

CMD ["npm","start", "--prefix", "server"]

EXPOSE 8000
