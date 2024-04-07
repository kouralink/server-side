FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install --no-package-lock


COPY . .
ENV PORT=5000
ENV HOST=localhost
ENV HOST_URL=http://localhost:5000
ENV API_KEY=AIzaSyDhI_9pXqzS94SXWZPugBsxo2SYzDA51JI
ENV AUTH_DOMAIN=koura-link.firebaseapp.com
ENV PROJECT_ID=koura-link
ENV STORAGE_BUCKET=koura-link.appspot.com
ENV MESSAGING_SENDER_ID=253921160459
ENV APP_ID=1:253921160459:web:154c37f0f1f19ffc00060e
ENV MEASUREMENT_ID=G-2ZYY05SC4N

EXPOSE 5000

CMD [ "npm", "start" ]