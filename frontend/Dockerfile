# Start of Selection
FROM node:22-alpine3.19 AS deps

COPY package*.json ./
RUN npm install


FROM node:22-alpine3.19 AS builder

COPY . .
COPY --from=deps /node_modules ./node_modules
ENV SECRET_KEY $key
RUN npm run build

FROM node:22-alpine3.19 AS runner

COPY --from=builder /.next/standalone ./
# COPY --from=builder /public ./public
# COPY --from=builder /.next/static ./static

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME='0.0.0.0' node server.js