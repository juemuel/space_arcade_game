const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index:'./index.js',
        lightdark:'./lightdark.js',
    },
    mode:'none',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader:'file-loader',
                    options:{
                        // name表示原始名，hash表示hash值，ext表示资源后缀
                        name: '[name].[ext]',
                        // 打包后到存放路径，
                        outputPath:'assets/',
                        // 可直接访问的路径
                        publicPath:'assets/',
                    }
                },
            },
            {
                test: /\.wav$/,
                use: {
                    loader:'file-loader',
                    options:{
                        // name表示原始名，hash表示hash值，ext表示资源后缀
                        name: '[name].[ext]',
                        // 打包后到存放路径、src中引用的url路径
                        outputPath:'assets/',
                        // 可直接访问的路径
                        publicPath:'assets/',
                    }
                },
            }
        ]
    }
};
