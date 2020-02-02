# -----------------
# Angular Build Stage
# -----------------

FROM node:12 as ng-build

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

# Configure node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm set progress=false

# Building dependencies
COPY package*.json ./
RUN npm install

# Building the actual app
COPY --chown=node:node . .
RUN $(npm bin)/ng build --prod

# -----------------
# Final Stage
# -----------------

FROM debian:stable
COPY --from=ng-build /home/node/app/dist/ngx-siostam/ /opt/public
