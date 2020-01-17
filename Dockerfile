FROM node:slim
MAINTAINER Eyevinn Technology <work@eyevinn.se>
WORKDIR /app
ADD . .
RUN npm install
CMD [ "node", "server.js" ]
