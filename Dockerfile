FROM icracked/icr-docker-node:latest

ENV APP_HOME /app/
ENV TEMP_NPM /temp

RUN mkdir $APP_HOME

# caching npm packages
WORKDIR $TEMP_NPM
COPY package.json $TEMP_NPM
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --silent
RUN cp -a $TEMP_NPM/node_modules $APP_HOME

WORKDIR $APP_HOME

COPY ./ $APP_HOME

# Will need to set NODE_ENV=production for built environment
# (as opposed to Webpack dev server).
RUN ["npm", "build"]
CMD ["npm", "start"]

EXPOSE 8080
