ARG NODE_VERSION=24-bookworm-slim

FROM node:${NODE_VERSION} AS deps
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:${NODE_VERSION} AS build
ARG STUDIO_REPOSITORY_OWNER=PrimalDjinn
ARG STUDIO_REPOSITORY_REPO=kenyatradex
ARG STUDIO_REPOSITORY_BRANCH=main
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV STUDIO_REPOSITORY_OWNER=$STUDIO_REPOSITORY_OWNER
ENV STUDIO_REPOSITORY_REPO=$STUDIO_REPOSITORY_REPO
ENV STUDIO_REPOSITORY_BRANCH=$STUDIO_REPOSITORY_BRANCH
RUN pnpm run build

FROM node:${NODE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
