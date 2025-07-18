FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY jest.config.ts ./
COPY tsconfig.json ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src 
COPY package*.json ./

EXPOSE 3000

CMD ["npm", "start"]