const webpack = require('webpack');
// const PurifyCSSPlugin = require('purifycss-webpack');
// constglob = require('glob');

module.exports = {
    plugins: [
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), //// Ignore all locale files of moment.js
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fa/), //If you want to specify the including locale files in the webpack config file, you can use ContextReplacementPlugin.
        //new PurifyCSSPlugin({      paths: glob.sync(__dirname + '/*.html'),      minimize: true,    }), 
    ]
}