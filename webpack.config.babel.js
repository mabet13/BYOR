'use strict';

const webpack = require('webpack');
const path = require('path');
const buildPath = path.join(__dirname, './dist');
const args = require('yargs').argv;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

let isProd = args.prod;
let isDev = args.dev;
let env = args.envFile;
if (env) {
    // Load env file
    require('dotenv').config({path: env});
}

let main = ['whatwg-fetch', './src/site.js'];
let common = ['whatwg-fetch', './src/common.js'];
let devtool;

if (isDev) {
    main.push('webpack-dev-server/client?http://0.0.0.0:8080');
    devtool = 'source-map';
}

let plugins = [
    new MiniCssExtractPlugin({filename: '[name].[hash].css'}),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        inject: 'body'
    }),
    new HtmlWebpackPlugin({
        template: './src/error.html',
        chunks: ['common'],
        inject: 'body',
        filename: 'error.html'
    }),
    new webpack.DefinePlugin({
        'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }),
    new CleanWebpackPlugin()
];

module.exports = {
    entry: {
        'main': main,
        'common': common
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },

    output: {
        path: buildPath,
        filename: '[name].[hash].js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: ">0.25%",
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ]
                        ],
                        plugins: ['@babel/plugin-transform-modules-commonjs']
                    }
                }
            ]
        },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['style-loader', MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {importLoaders: 1}
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv({browsers: '>0.25%'}),
                                cssnano({preset: ['default', {discardComments: {removeAll: true}}]})
                            ]
                        }
                    }, 'sass-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|ico|svg)$/,
                exclude: /node_modules/,
                use: [{loader: 'file-loader?name=images/[name].[ext]&context=./src/images'}]
            },
            {
                test: require.resolve('jquery'),
                use: [{loader: 'expose-loader', options: 'jQuery'}, {loader: 'expose-loader', options: '$'}]
            }
        ]
    },

    optimization: {
        noEmitOnErrors: !!isProd
    },

    plugins: plugins,

    devtool: devtool,

    devServer: {
        contentBase: buildPath,
        host: '0.0.0.0',
        port: 8080
    }
};
