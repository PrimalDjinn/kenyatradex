FROM mcr.microsoft.com/devcontainers/base:noble

ARG NODE_MAJOR=24

# Install Node.js 24 (Active LTS)
RUN apt-get update && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@latest

# Install other utilities and GitHub CLI
RUN apt-get update && apt-get install -y \
    git \
    ssh-client \
    openssh-client \
    iproute2 \
    net-tools \
    iputils-ping \
    gh \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    libasound2-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

USER vscode
