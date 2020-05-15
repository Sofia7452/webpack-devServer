const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index.js',
  },
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8009,
    hot: true,
    hotOnly: true,
    historyApiFallback: true,
    //proxy只是在开发时用的，实际上线以后页面的地址就是相当于服务器地址的路径了
    //实际上如果用的是reactrouter后端需要在apache或者ngix上面修改配置
    proxy: {
      '/react/api': {
        //当页面请求符合正则符合'/react/api'时，请求就会转发到target地址，
        //pathRewrite是页面请求名叫'header.json'但是上会去'demo.json'请求
        target: 'http://www.dell-lee.com',
        //secure:false可以实现https请求
        secure: false,
        pathRewrite: {
          'header.json': 'demo.json'
        },
        //反爬虫(不太懂)
        changeOrigin: true,
        //拦截:举例来说如果请求是个html请求，那么就会跳过proxy转发
        // bypass: function (req, res, proxyOptions) {
        //   if (req.headers.accept.indexOf('html') !== -1) {
        //     console.log('Skipping proxy for browser request.');
        //     return false;
        //   }
        // }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use:
          ['style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true
              }
            },
            'sass-loader',
            'postcss-loader']
      },
      {
        test: /\.css$/,
        use:
          ['style-loader',
            'css-loader',
            'postcss-loader'
          ]
      }, {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 204800
          }
        }
      },
      {
        test: /\.(eot|ttf|avg)$/,
        use: {
          loader: 'file-loader',
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          }],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist')
  },
}

