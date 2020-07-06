FROM node:alpine

WORKDIR /app
COPY package.json ./
# --ony=prod does not install dev dependencies. Because the dev dependencies are only required for test which is in local machine.
RUN npm install --only=prod
COPY ./ ./

CMD ["npm", "start"]