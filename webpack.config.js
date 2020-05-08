const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: 'app.css'
});

const extractImages = new CopyWebpackPlugin([{
    from:'./resources/img',
    to:'img'
}]);

module.exports = {
    entry: [
        './resources/scss/app.scss',
        './resources/scripts/app.js'
    ],
    output: {
        filename: 'scripts.js',
        path: __dirname + "/public",
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'img',
                },
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            },
        ],

    },
    plugins: [
        extractSass,
        extractImages
    ]
}
