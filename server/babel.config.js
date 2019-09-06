// babel.config.js
"use strict";

module.exports = {
  env: {
    production: {
      presets: [
        [
          "@babel/preset-env",
          {
            debug: false,
            targets: {
              node: "11"
            }
          }
        ]
      ],
      ignore: ["node_modules"],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-object-assign",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        [
          "babel-plugin-module-resolver",
          {
            root: ["./"]
          }
        ]
      ],
      sourceMaps: "inline",
      inputSourceMap: false
    },
    development: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "11"
            }
          }
        ]
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-object-assign",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
        [
          "babel-plugin-module-resolver",
          {
            root: ["./"]
          }
        ]
      ]
    }
  }
};
