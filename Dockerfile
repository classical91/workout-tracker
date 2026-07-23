FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# The sync server has zero runtime dependencies; it just needs the built app,
# the server code, and the shared merge util it imports at runtime.
COPY package.json ./
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/utils/mergeActivityLog.js ./src/utils/mergeActivityLog.js
ENV PORT=3000
# Persist synced logs here; mount a volume at this path to survive redeploys.
ENV DATA_DIR=/app/data
EXPOSE 3000
CMD ["node", "server/index.js"]
