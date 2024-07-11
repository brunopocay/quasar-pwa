const { configure } = require('quasar/wrappers');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = configure(function (/* ctx */) {
  return {
    // outras configurações...

    build: {

      extendWebpack(cfg) {
        // Encontrar a instância do HTMLWebpackPlugin no webpack config
        const htmlPlugin = cfg.plugins.find(
          (plugin) => plugin instanceof HtmlWebpackPlugin
        );

        if (htmlPlugin) {
          // Manipular o template do HTML gerado pelo HTMLWebpackPlugin
          htmlPlugin.options.minify = {
            ...htmlPlugin.options.minify,
            processScripts: ['text/html'],
          };
        }
        // Configurações específicas para PWA com Quasar
        cfg.plugins.push(
          new HtmlWebpackPlugin({
            filename: 'index.html', // Nome do arquivo HTML gerado
            template: 'src-pwa/index.template.html', // Template HTML para o PWA
            inject: true,
            minify: {
              // Configurações de minificação (opcional)
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
            meta: {
              viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui',
            },
            chunksSortMode: 'dependency',
            serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname, 'sw-loader.js'), 'utf-8')}</script>`,
          })
        );
      },

      // Configurações específicas do PWA no Quasar
      pwa: {
        workboxPluginMode: 'InjectManifest', // 'GenerateSW' ou 'InjectManifest' dependendo de suas necessidades
        workboxOptions: {
          // Configurações do Workbox (opcional)
          // ... configure conforme suas necessidades ...
        },
        manifest: {
          // Configurações do manifest.json (opcional)
          // ... configure conforme suas necessidades ...
        },
      },

      // outras configurações...
    },

    // outras configurações...
  };
});
