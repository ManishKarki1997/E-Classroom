
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'E-class | An Interactive Online Learning Classroom' || process.env.npm_package_name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: "https://fonts.googleapis.com/css?family=Chivo:300,400&display=swap", rel: "stylesheet" },
      { href: "https://fonts.googleapis.com/css?family=Asul:400,700&display=swap", rel: "stylesheet" },
      { href: "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap", rel: "stylesheet" },

    ]
  },
  server: {
    port: 8080
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/VueWindow.js',
    '~/plugins/VueEditor.js',
    '~/plugins/vue-toast.js',
    '~/plugins/VueSocket.js'

  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/svg',

  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  }
}
