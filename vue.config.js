module.exports = {
    // 项目打包生成目录
    outputDir: 'dist',
    // 静态资源生成目录（相对于outputDir
    assetsDir: 'static',
    // css相关配置
    css: {
        modules: false,
        // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
        extract: true,
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
                localIdentName: '[name]-[hash]',
                camelCase: 'only'
            },
            postcss: {
                // 这里的选项会传递给 postcss-loader
            }
        }
    },
    // 图片在10kb以内使用内联base64图片
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, {limit: 10240}))
    },
    // 部署应用包时的基本 URL(解决build打包后资源文件404问题) :https://cli.vuejs.org/zh/config/#baseurl
    publicPath: './',
    devServer: {
        open: true,
        compress: true,
        port: 8020,
        https: false,
        hotOnly: false,
        proxy: null,
        before: app => {
        }
    }
}
