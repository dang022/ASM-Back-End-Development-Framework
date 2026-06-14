import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
// use express.json() for body parsing
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWT_SECRET } from '../config/jwt.js';
import User from '../models/User.js';
import { userType, userQuery, userMutation } from './schemas/user.js';
import { categoryType } from './schemas/category.js';
import { productType } from './schemas/product.js';
import { resolvers } from './resolvers/index.js';
dotenv.config();

const typeDefs = [
  `type Query { _empty: String }`,
  `type Mutation { _empty: String }`,
  userType, userQuery, userMutation, categoryType, productType
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

function graphqlPlaygroundHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ShopOnline GraphQL</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 24px; }
    h1 { margin: 0 0 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea, input { width: 100%; box-sizing: border-box; border: 1px solid #334155; border-radius: 10px; background: #020617; color: #e2e8f0; padding: 12px; }
    textarea { min-height: 280px; font-family: Consolas, monospace; }
    .card { background: rgba(15, 23, 42, 0.9); border: 1px solid #1e293b; border-radius: 16px; padding: 16px; }
    .row { display: grid; gap: 12px; margin-bottom: 12px; }
    button { border: 0; border-radius: 999px; background: #22c55e; color: #052e16; font-weight: 700; padding: 12px 18px; cursor: pointer; }
    button:hover { background: #4ade80; }
    pre { white-space: pre-wrap; word-break: break-word; background: #020617; border: 1px solid #334155; border-radius: 12px; padding: 12px; min-height: 280px; overflow: auto; }
    .hint { color: #94a3b8; font-size: 14px; margin-top: 8px; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .actions input { max-width: 420px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>ShopOnline GraphQL</h1>
    <p class="hint">Local GraphQL tester. Paste a query on the left, see JSON result on the right.</p>

    <div class="card row">
      <label>
        Authorization token
        <input id="token" placeholder="Bearer token (optional)" />
      </label>
      <div class="actions">
        <button id="run">Run Query</button>
        <button id="loadProducts" type="button">Load Products</button>
        <button id="loadLogin" type="button">Load Login Mutation</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <label for="query">Query</label>
        <textarea id="query">query {\n  products {\n    id\n    name\n    price\n    stock\n    category {\n      id\n      name\n    }\n  }\n}</textarea>
      </div>
      <div class="card">
        <label>Response</label>
        <pre id="output">Run a query to see results here.</pre>
      </div>
    </div>
  </div>
  <script src="/graphql-ui.js"></script>
</body>
</html>`;
}

function graphqlPlaygroundScript() {
  return `(() => {
    const queryEl = document.getElementById('query');
    const tokenEl = document.getElementById('token');
    const outputEl = document.getElementById('output');
    const runBtn = document.getElementById('run');
    const loadProductsBtn = document.getElementById('loadProducts');
    const loadLoginBtn = document.getElementById('loadLogin');

    async function runQuery() {
      outputEl.textContent = 'Loading...';
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = tokenEl.value.trim();
        if (token) headers.Authorization = token.startsWith('Bearer ') ? token : 'Bearer ' + token;

        const response = await fetch('/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: queryEl.value })
        });

        const data = await response.json();
        outputEl.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        outputEl.textContent = String(error);
      }
    }

    runBtn.addEventListener('click', runQuery);
    loadProductsBtn.addEventListener('click', () => {
      queryEl.value = 'query {\\n  products {\\n    id\\n    name\\n    price\\n    stock\\n    category {\\n      id\\n      name\\n    }\\n  }\\n}';
    });
    loadLoginBtn.addEventListener('click', () => {
      queryEl.value = 'mutation {\\n  login(email: "admin@example.com", password: "password123") {\\n    token\\n  }\\n}';
    });
  })();`;
}

export async function mountGraphql(app) {
  app.get('/graphql', (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;");
    res.type('html').send(graphqlPlaygroundHtml());
  });

  app.get('/graphql-ui.js', (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;");
    res.type('application/javascript').send(graphqlPlaygroundScript());
  });

  const server = new ApolloServer({ schema });
  await server.start();
  app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      if (auth) {
        try {
          const token = auth.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password');
          return { req, user };
        } catch (e) { return { req }; }
      }
      return { req };
    }
  }));
}
