# @evlmaistrenko/dbd-stats-api

[![NPM Version](https://img.shields.io/npm/v/%40evlmaistrenko%2Fdbd-stats-api)](https://www.npmjs.com/package/@evlmaistrenko/dbd-stats-api)

GraphQL API for [DbD-stats](https://dbd-stats.fun). Uses [@apollo/server](https://www.npmjs.com/package/@apollo/server) with [graphql-ws](https://www.npmjs.com/package/graphql-ws).

## Usage

### CLI reference

```bash
npx @evlmaistrenko/dbd-stats-api -h
```

### Starting Apollo server

```bash
npx @evlmaistrenko/dbd-stats-api
```

### Environment variables (optional - command will ask you to prompt it if don't set)

```
PORT=<Port to listen>
MONGODB_MAIN_URL=<MongoDB connection string>
MONGODB_MAIN_DB_NAME=<Database name>
STEAM_API_CLIENT_KEY=<Steam API key>
```

### Programmatic usage

```bash
npm i @evlmaistrenko/dbd-stats-api
```

```javascript
import { graphql, mongo, bootstrap } from "@evlmaistrenko/dbd-stats-api";

// Query some data:
const result = await graphql({
  source: "{ stats { bloodpoints { total } } }",
});

// Or subscribe:
for await (const result of graphql(
  {
    source: "subscription { stats { bloodpoints { total } } }",
  },
  true,
)) {
}

// Or use mongo:
const user = await mongo.main.users.findOne();

// Or start Apollo server:
await bootstrap();
// Then goto http://localhost:4000/graphql and try API
```

#### Pre-configure if you want to

```javascript
import { config } from "@evlmaistrenko/dbd-stats-api/config";

config({ mongoDbMainUrl: "<customized connection string>" });

const { graphql, mongo, bootstrap } = await import(
  "@evlmaistrenko/dbd-stats-api"
);

// Use it
```

## Api docs

See [here](./docs/README.md).
