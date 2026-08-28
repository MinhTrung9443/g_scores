FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y mariadb-server && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend ./backend
COPY data ./data

RUN /etc/init.d/mariadb start && \
    sleep 5 && \
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`g-scores\`;" && \
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '123456'; FLUSH PRIVILEGES;"

ENV DB_HOST=127.0.0.1
ENV DB_USER=root
ENV DB_PASSWORD=123456
ENV DB_NAME=g-scores
ENV PORT=3000

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
