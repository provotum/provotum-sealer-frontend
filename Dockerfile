# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

ARG REACT_APP_SEALER_URL
ARG REACT_APP_SEALER_NAME
ARG REACT_APP_VA_URL

ENV REACT_APP_SEALER_URL $REACT_APP_SEALER_URL
ENV REACT_APP_SEALER_NAME $REACT_APP_SEALER_NAME
ENV REACT_APP_VA_URL $REACT_APP_VA_URL

# add app
COPY . ./

EXPOSE 3010

# start app
CMD ["npm", "start"]
