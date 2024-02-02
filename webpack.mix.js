const mix = require('laravel-mix');

mix.webpackConfig({
    watchOptions: {
        ignored: ["/node_modules/", "/index.js", "/data/"]
    }
});

mix.sass("src/scss/view.scss", "public/css/view.min.css")
    .js("src/js/view/index.js", "public/js/view.min.js").react()
    .sass("src/scss/top.scss", "public/css/top.min.css")
    .js("src/js/list/index.js", "public/js/list.min.js").react()
    .sass("src/scss/list.scss", "public/css/list.min.css")
    .js("src/js/client/regist.js", "public/js/regist.min.js").react()

