import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import express from 'express';

import { addMiddlewares } from "./src-server/app-middlewares";
const app = express();
addMiddlewares(app);

export default defineConfig({

  html: {
    template: "./src/index.html",
  },

  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [],
    },
  },
  dev: {
    setupMiddlewares: [
      (middlewares) => {
        middlewares.unshift(app);
      }
    ]
  }
});
