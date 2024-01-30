FROM node:20.3.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

ARG PORT=3000

FROM base AS build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output

ENV PORT=$PORT
EXPOSE $PORT

CMD [ "node", ".output/server/index.mjs" ]
