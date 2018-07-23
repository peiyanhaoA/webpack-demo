const path = require('path');

const webpack = require('webpack')
// 压缩js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const glob = require('glob')
const PurifyCssPlugin = require('purifycss-webpack')

const entry = require('./webpack_config/entry')


console.log(encodeURIComponent(process.env.type))
let website ;
if(process.env.type == 'build'){
   website = {
        publicPath: 'http://192.168.8.156:7777/'
    }
}else if(process.env.type == 'dev'){
    website = {
        publicPath: 'http://www.peiyanhao.com:7777/'
    }
}else{
    website = {
        publicPath: 'http://192.168.8.156:7777/'
    }
}


module.exports = {
    devtool: 'source-map',
    entry: entry.path,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: website.publicPath
    },
    module: {
        /*
            style-loader: 处理css中URL路径
            css-loader: 处理css样式中的标签
        */
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                  fallback: "style-loader",
                  use: [
                      {
                          loader: 'css-loader',
                          options: {
                              importLoaders: 1
                          }
                      },
                      'postcss-loader'
                  ]
                })
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                // 处理HTML中的img图片引用
                test: /\.(htm|html)$/,
                use: ['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        // new UglifyJsPlugin()
        // 引入第三方库
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            // 防止缓存
            hash: true,
            template: './src/index.html'
        }),
        new extractTextPlugin("css/index.css"),
        // 清除没有用到的css
        new PurifyCssPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        new webpack.BannerPlugin('peiyanhao')
    ],
    // optimization:{
        
      
    //         splitChunks: {
    //             chunks: 'async',
    //             minSize: 30000,
    //             minChunks: 1,
    //             maxAsyncRequests: 5,
    //             maxInitialRequests: 3,
    //             automaticNameDelimiter: '~',
    //             name: true,
    //             cacheGroups: {
    //                 vendors: {
    //                     test: /[\\/]node_modules[\\/]/,
    //                     priority: -10
    //                 },
    //                 default: {
    //                     minChunks: 2,
    //                     priority: -20,
    //                     reuseExistingChunk: true
    //                 }
    //             }
    //         }
          
    // },
    devServer: {
        // 基本目录结构，要监听的代码路径
        contentBase: path.resolve(__dirname, 'dist'),
        // IP地址(服务器路径)
        host: '192.168.8.156',
        // 是否启用服务器压缩
        compress: true,
        port: 7777
    },
    // watchOptions: {
    //     poll:1000,//监测修改的时间(ms)
    //     aggregeateTimeout:500, //防止重复按键，500毫米内算按键一次
    //     ignored:/node_modules/,//不监测
    // }
}