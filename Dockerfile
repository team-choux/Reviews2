FROM node:8

# Create app directory
WORKDIR /home/monica/Documents/HackReactor/Week8/Reviews

# Install app dependencies
# A wildcard is used to ensure both package.json and ....
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
EXPOSE 3001

CMD [ "npm", "start"]