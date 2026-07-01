# Todo Web

Frontend for a todo list application. Built with React, Redux Toolkit, and Vite.

## Stack

- React
- Redux Toolkit
- TypeScript
- Vite

## Requirements

- Node.js 20+
- Running [todo-api](../todo-api) backend

## Quick start

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

During development, Vite proxies `/api` requests to `http://localhost:3000`.

## Features

- Add todo items
- Edit todo title
- Toggle completed status
- Delete todo items

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — lint code

## Environment variables

See `.env.example`.

## CI/CD note

This repository is intended as a standalone frontend service for CI/CD learning exercises.
