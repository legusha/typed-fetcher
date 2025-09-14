import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commonJSConfig = {
    mode: 'production',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.cjs',
        library: {
            name: 'typedFetcher',
            type: 'umd'
        },
        globalObject: 'this',
        path: path.resolve(__dirname, 'dist'),
    },
};

const umdConfig = {
    ...commonJSConfig,
    output: {
        ...commonJSConfig.output,
        filename: 'index.umd.js',
    },
};

export default [
    commonJSConfig,
    umdConfig,
]

