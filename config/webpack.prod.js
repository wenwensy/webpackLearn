const path = require('path')
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin')


const getStyleLoaders = (pre) => {
    return [
        [
            // "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            // 处理css 兼容性问题 要在package.json中配置浏览器的兼容范围 “browserslist"
            {
                loader: "postcss-loader",
                options: {
                    postcssOption: {
                        plugins: ["postcss-preset-env"],
                    }
                }
            },
            pre
        ]
    ].filter(Boolean)
};

module.export = {
    entry: './src/index.js', //入口文件
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/[name].[contenthash:10].js",
        chunckFilename: "static/js/[name].[contenthash:10].chunk.js",
        assetMoudleFilename: "static/media/[hash:10][ext][query]",
        clear: true,
    },
    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader")
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader")
            },

            //处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: { //当图片小于10kb时将其转化为base64 这样可以减少请求，虽然体积变大 但是由于图片较小 影响范围可以忽略
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                }
            },
            // 处理其他资源 --图标
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource"
            },
            //处理js
            {
                test: /\.js|jsx$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader", //处理js语法的兼容性问题
                options: {
                    cacheDirectory: true, //开启缓存
                    cacheCompression: false ,//缓存不压缩
                }
                //需要定义一个babel.config的文件 定义babel 要做哪些事情
            }

        ]
    },
    plugins: [
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: "node_modules",
            //允许缓存，这样方便再次打包时会便利
            cache: true,
            // 缓存存放地址
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache")
                // 除此之外还要单独配置一个.eslintrc文件， 可以通过这个文件指定eslint做哪些事，查看eslint官方文档  })
        }),


        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunckFilename:  'static/css/[name].[contenthash:10].chunk.css',
        }),

       
    ],
    mode: "development",
    devtool: 'cheap-module-source-map',
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        },
        minimizer: [ 
            new CssMinimizerWebpackPlugin() ,//压缩css
            new TerserWebpackPlugin(),
            new ImageMinimizerWebpackPlugin({
                minimizer: {
                    implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                    options: {
                        plugins:[
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                              "svgo",
                              {
                                plugins: extendDefaultPlugins([
                                  {
                                    name: "removeViewBox",
                                    active: false,
                                  },
                                  {
                                    name: "addAttributesToSVGElement",
                                    params: {
                                      attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                                    },
                                  },
                                ]),
                              },
                            ],
                        ]
                    }
                }
            })
    ]
    },
    //webpack解析模块加载选项
    resolve: {
        //自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"],
    },
}