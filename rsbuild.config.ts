import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

import { app } from "./src-server/express-app";

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
