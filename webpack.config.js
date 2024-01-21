const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var path = require('path');
module.exports = {
    mode: 'development',   //development or production
    entry: './src//index.js',
    output: {
    filename: 'index.bundle.[hash].js',
    path:  path.resolve(__dirname, 'public/'),
    publicPath: '/',
    }, 

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-react', '@babel/preset-env'],
                },
                },
            },

            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new MiniCssExtractPlugin({filename: 'index.[hash].bundle.css'}),
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, './public'),
        },
        hot: true,
        historyApiFallback: true,
        historyApiFallback: {
            index: '/'
        } 
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
};
