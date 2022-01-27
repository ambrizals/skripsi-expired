FROM node:lts

WORKDIR /usr/src/app

COPY . .
COPY .env.production .env

RUN npm install
RUN npm install -g @adonisjs/cli

EXPOSE ${PORT}

CMD ["npm", "start"]