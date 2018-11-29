const express = require("express");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const compiler = webpack(require("../webpack.config.js"));

const app = express();
// This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
function normalizeAssets(assets) {
  return Array.isArray(assets) ? assets : [assets];
}
app.use(middleware(compiler, { serverSideRender: true }));
// The following middleware would not be invoked until the latest build is finished.
app.use((req, res) => {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
  // then use `assetsByChunkName` for server-sider rendering
  // For example, if you have only one main chunk:
  res.send(
    `<html>
      <head>
        <title>Test</title>
      </head>
      <body>
        <h1>Test</h1>
        <div id="root"></div>
        ${normalizeAssets(assetsByChunkName.main)
          .filter(path => path.endsWith(".js"))
          .map(path => `<script src="${path}"></script>`)
          .join("\n")}
      </body>
    </html>`
  );
});

module.exports = app;
