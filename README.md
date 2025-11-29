Getting started

- Install Deno and its vscode extension
- Install Docker and Docker Compose
- Run `docker-compose up -d` to start Postgres
- Run `deno cache deno.json` to cache dependencies
- Create a `.env` file defining the environment variables
- Generate the Prisma client with `deno run -A npm:prisma generate`
- Initialize the database with `deno run -A npm:prisma migrate dev`
- Start the project in development mode with `deno task dev`
