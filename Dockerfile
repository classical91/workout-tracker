FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# The sync server's only runtime dependency is the Postgres client (used when
# DATABASE_URL is set); everything else it needs is a Node built-in or one of
# the shared merge utils copied below.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/utils/mergeActivityLog.js ./src/utils/mergeActivityLog.js
COPY src/utils/mergeSyncDocs.js ./src/utils/mergeSyncDocs.js
ENV PORT=3000
# Used only when DATABASE_URL is unset: synced data then lives in JSON files
# here, and a redeploy wipes it unless a volume is mounted at this path.
ENV DATA_DIR=/app/data
EXPOSE 3000
CMD ["node", "server/index.js"]
