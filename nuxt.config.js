// import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import path from 'path'
import fs from 'fs'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href:
          'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
        rel: 'stylesheet',
      },
      {
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
    script: [
      {
        src: 'https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js',
      },
      {
        src: '/js/RTCMultiConnection.min.js',
      },
    ],
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
    },
  },
  loading: { color: '#006aac' },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/main.scss',
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/vue-dialog.js',
    // '~/plugins/VueWindow.js',
    '~/plugins/vue-toast.js',
    '~/plugins/VueSocket.js',
    // '~/plugins/vue-scroll-reveal.js',
    '~/plugins/vue-quill-editor.js',
    '~/plugins/vue-tooltip.js',
    // '~/plugins/VueEditor.js',
    // '~/plugins/vue-tour.js',
    // '~/plugins/vue-dialog.js',
  ],
  styleResources: {
    scss: ['~/assets/css/theme.scss', '~/assets/css/mixins.scss'],
  },
  env: {
    baseUrl: 'http://localhost:3000/api',
    rootUrl: 'http://localhost:3000',
  },
  router: {
    middleware: ['checkIfKickedOut'],
  },
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:3000/api',
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // plugins: [
    //   new MonacoWebpackPlugin({
    //     // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    //     languages: ['javascript', 'python', 'java', 'json', 'php', 'go'],
    //   }),
    // ],
    extend(config, ctx) {},
  },
}
