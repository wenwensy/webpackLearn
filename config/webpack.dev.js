const path = require('path')
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("react-refresh-webpack-plugin")


const getStyleLoaders = (pre) => {
    return [
        [
            "style-loader",
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
        path: undefined,
        filename: "static/js/[name].js",
        chunckFilename: "static/js/[name].chunk.js",
        assetMoudleFilename: "static/media/[hash:10][ext][query]",
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
                    plugins: ['react-refresh/babel'] //激活js 的hmr功能
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

        new ReactRefreshWebpackPlugin() //激活js 的hmr功能

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
        }
    },
    //webpack解析模块加载选项
    resolve: {
        //自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"],
    },
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, //解决前端路由刷新 404
        
    }
}