import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    entry: {
        index: './src/index.ts',
    },
    output: {
        filename: 'index.cjs',
        library: {
            name: 'typedFetcher',
            type: 'umd'
        },
        globalObject: 'this',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 3000,
        hot: true,
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        devMiddleware: {
            writeToDisk: true,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '...'],
        alias: {
            // "@lib": path.resolve(__dirname, "./src/"),
        },
    },
};
