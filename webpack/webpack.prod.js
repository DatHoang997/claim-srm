const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const common = require('./common.js');
const util = require('./util');
const resolve = util.resolve;

const prodEnv = {
  NODE_ENV: JSON.stringify('production'),
  PLATFORM_ENV: JSON.stringify('web'),
  SERVER_URL: JSON.stringify('https://api-bounty.ezdefi.com/api'),
  ASRM_POOL: JSON.stringify('0x1a3A8b3aF5A5F5DD9A338A16E19469E4fA36AB39'),
  ASRM_CONTRACT_ADDRESS: JSON.stringify('0xD8cD9DCB9129afd033b6C75b23C65DC5fCdcd022'),
  FB_SEND_LINK: JSON.stringify('http://m.me/1795330330742938?ref=JFSNXoL76.ref.')
};

const stagingEnv = {
  NODE_ENV: JSON.stringify('staging'),
  PLATFORM_ENV: JSON.stringify('web'),
  SERVER_URL: JSON.stringify('https://staging-server.com/api')
};

const cssFilename_lib = 'static/css/lib.css?[hash:8]';
const cssFilename_app = 'static/css/app.css?[hash:8]';
const extractCSS_LIB = new ExtractTextPlugin(cssFilename_lib);
const extractCSS_APP = new ExtractTextPlugin(cssFilename_app);
module.exports = merge(common, {
  cache: false,
  performance: {
    hints: false
  },
  output: {
    path: resolve('dist'),
    chunkFilename: 'static/js/[name].bundle.js?[hash:8]',
    filename: 'static/js/[name].js?[hash:8]',
    publicPath: ''
  },
  // devtool: 'inline-source-map',
  stats: {
    // need it
    entrypoints: false,
    children: false
  },
  module: {
    strictExportPresence: true, // need this
    rules: [
      // {
      //     test: /\.(js|jsx)$/,
      //     enforce: 'pre',
      //     use: [
      //         {
      //             options: {
      //                 formatter: eslintFormatter,
      //                 eslintPath: require.resolve('eslint'),
      //             },
      //             loader: require.resolve('eslint-loader'),
      //         },
      //     ],
      //     include: resolve('src'),
      // },
      {
        oneOf: [{
            test: /\.(png|svg|jpg|gif)$/,
            include: resolve('src'),
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]',
              publicPath: '/static/media',
              outputPath: 'static/media'
            }
          },
          {
            test: /\.(js|jsx)$/,
            include: resolve('src'),
            loader: require.resolve('babel-loader'),
            exclude: /node_modules/,
            options: {
              plugins: ['react-html-attrs'],
              compact: true
            }
          },
          {
            test: /\.css$/,
            use: extractCSS_LIB.extract({
              fallback: 'style-loader',
              use: [{
                loader: 'css-loader'
              }, {
                loader: 'postcss-loader'
              }]
            })
          },
          {
            test: /\.(scss)$/,
            include: resolve('src'),
            exclude: /node_modules/,
            loader: extractCSS_APP.extract(
              Object.assign({
                fallback: require.resolve('style-loader'),
                use: [{
                  loader: 'css-loader'
                }, {
                  loader: 'postcss-loader'
                }, {
                  loader: 'sass-loader'
                }],
              })
            )
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: '/static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(resolve('dist')),
    // new FaviconsWebpackPlugin({
    //     logo: path.join(__dirname, 'public/favicon.png'),
    //     prefix: 'static/media/icon[hash:8]/',
    //     icons: { favicons: true },
    // }),
    new HtmlWebpackPlugin({
      sinject: true,
      template: resolve('public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifySCSS: true,
        minifyURLs: true
      }
    }),
    extractCSS_LIB,
    extractCSS_APP,
    new webpack.DefinePlugin({
      'process.env': prodEnv
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
