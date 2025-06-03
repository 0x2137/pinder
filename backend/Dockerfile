FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . ./

# Expose backend port
EXPOSE 3000

# Run the backend
CMD ["npm", "start"]