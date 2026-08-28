FROM node:18-bullseye

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend ./backend
COPY data ./data

ENV PORT=3000
EXPOSE 3000

WORKDIR /app/backend

CMD ["npm", "start"]
