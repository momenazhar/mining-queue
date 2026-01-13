FROM node:25-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN npm i -g pnpm@10.28.0
COPY . /app
WORKDIR /app

FROM base AS production-dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
COPY --from=production-dependencies /app/node_modules /app/node_modules
CMD [ "pnpm", "start" ]
