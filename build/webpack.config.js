const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const inquirer = require('inquirer');//用户与命令行交互的工具
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");//Speed Measure Plugin
const pkg = require(path.resolve(__dirname, '../package.json'));

var ROOT_PATH = path.resolve(__dirname, '../');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var DIST_PATH = path.resolve(ROOT_PATH, 'dist');

const promptList = [{
    type: 'rawlist',
    name: 'ENV',
    message: '请选择打包环境',
    choices: ['dev','test','staging','prod'],
    filter: function(val){ 
        return val;
    }
}];

var config = {

    context: ROOT_PATH,

    mode: 'development',
    
    devtool: 'source-map',

    entry: path.resolve(SRC_PATH, 'index.ts'),

    output: {
        filename: `[name].build.js`,
        path: DIST_PATH
    },

    resolve: {
        extensions: ['.js', '.tsx', '.ts'],//表示在import 文件时文件后缀名可以不写
        /**
         * resolve.modules是用来设置模块搜索的目录，设定目录以后，import模块路径，就可以从一个子目录开始写，这样就可以缩短模块引入路径。例如：
        resolve:{ modules:['./src/components'] }则引入src下的components下的utils模块，就可以 import'utils'
        这样就可以省略前面的src/components路径，作用是省略路径书写，让webpack自己查找
        而resolve.alias则是给路径设置别名，作用是用别名代替前面的路径，不是省略，而是用别名代替前面的长路径。
        这样其实有个好处，就是webpack直接会去别名对应的目录去查找模块，减少了webpack自己去按目录查找模块的时间。
         */
        alias:{
            '@': path.join(__dirname,'./src')	
        },
        modules: [
            'node_modules'
        ]
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [ SRC_PATH ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { 
                test: /\.tsx?$/,
                use: [
                    {
                      loader: 'ts-loader',
                      options: {
                        transpileOnly: true
                      }
                    }
                ] 
            }
        ]
    },

    devServer: {
        /* 
        https://webpack.docschina.org/guides/development/#using-webpack-dev-server
        webpack-dev-server 在编译之后不会写入到任何输出文件。
        而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。
        如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 publicPath 选项进行修改。*/
        contentBase: path.join(ROOT_PATH),
        port: 9000,
        useLocalIp: true,
        host: '0.0.0.0',
        openPage:"index.html",
        hot : true,
        proxy: {
            "/api": "http://localhost:3001"
        }
    },

    plugins: [
        //By default, this plugin will remove all files inside webpack's output.path directory, 
        //as well as all unused webpack assets after every successful rebuild
        new CleanWebpackPlugin(),

        //生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。
        //如果你有多个 webpack 入口，他们都会在已生成 HTML 文件中的 <script> 标签内引入。
        //如果在 webpack 的输出中有任何 CSS 资源（例如，使用 MiniCssExtractPlugin 提取的 CSS），那么这些资源也会在 HTML 文件 <head> 元素中的 <link> 标签内引入。
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'head'
        })
    ],
}

//Along with exporting a single configuration as an object, function or Promise, you can export multiple configurations
module.exports = function(){
    return inquirer.prompt(promptList).then(res => {

        //DefinePlugin 允许在 编译时 创建配置的全局常量，区分开发模式与生产模式进行不同的操作时非常有用。
        config.plugins.push(new webpack.DefinePlugin({
            APP_VERSION: `${JSON.stringify(pkg.version) || '0.0.0'}`,
            NODE_ENV: JSON.stringify(res.ENV || process.env.NODE_ENV )
        }));

        return new SpeedMeasurePlugin().wrap(
            config
        )
    });
};