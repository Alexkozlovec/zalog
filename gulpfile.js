const gulp = require("gulp");
const { src, dest, parallel, series, watch } = require("gulp");

// css
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const postcssNested = require("postcss-nested");
const postcssImport = require("postcss-import");
const postcssMixins = require("postcss-mixins");
const postcssUrl = require("postcss-url");
const gcmq = require("gulp-group-css-media-queries");

//images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

//overall
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const browserSync = require("browser-sync").create();
const gulpif = require("gulp-if");

const srcPath = "src/";
const distPath = "dist/";

let isProd = false;

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
    cors: true,
    notify: false,
    ui: false
  });
};

const html = () => {
  return src(srcPath + "*.html")
    .pipe(dest(distPath))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const images = () => {
  return src(srcPath + "images/**/*")
    .pipe(
      gulpif(
        isProd,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(dest(distPath + "images/"))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const convertToWebp = () => {
  return src(srcPath + "images/**/*.{jpg, png}")
    .pipe(webp({ quality: 90 }))
    .pipe(dest(distPath + "images/"));
};

const fonts = () => {
  return src(srcPath + "fonts/**/*")
    .pipe(dest(distPath + "fonts/"))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const assets = () => {
  return src(srcPath + "assets/**/*")
    .pipe(dest(distPath + "assets/"))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const styles = () => {
  src(srcPath + "css/vendor/*.css")
  .pipe(dest(distPath + "css/vendor/"));

  return src(srcPath + "css/main.css")
    .pipe(gulpif(!isProd, plumber()))
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(
      postcss([
        postcssImport(),
        postcssMixins(),
        postcssNested(),
        postcssUrl({url: "rebase"}),
        autoprefixer({cascade: false}),
      ])
    )
    .pipe(gulpif(!isProd, sourcemaps.write(".")))
    .pipe(gulpif(isProd, gcmq()))
    .pipe(dest(distPath + "css/"))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const scripts = () => {
  return src(srcPath + "scripts/**/*.js")
    .pipe(dest(distPath + "scripts/"))
    .pipe(gulpif(!isProd, browserSync.stream()));
};

const cleanDist = () => {
  return del("./" + distPath);
};

const watchFiles = () => {
  watch(srcPath + "*.html", html);
  watch(srcPath + "css/**/*.css", styles);
  watch(srcPath + "scripts/**/*.js", scripts);
  watch(srcPath + "images/**/*.{jpg,jpeg,png,svg,gif,webp,ico}", images);
  // watch(srcPath + "images/**/*.{jpg,png}", convertToWebp);
  watch(srcPath + "fonts/**/*.{woff,woff2}", fonts);
  watch(srcPath + "assets/**/*", assets);
};

const setProd = (cb) => {
  isProd = true;
  cb();
};

const watcher = parallel(watchFiles, serve);

exports.default = series(
  cleanDist,
  parallel(html, fonts, images, assets, styles, scripts),
  watcher /*convertToWebp */
);

exports.build = series(
  setProd,
  cleanDist,
  parallel(html, fonts, images, assets, styles, scripts)
);

// exports

exports.serve = serve;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.assets = assets;
exports.convertToWebp = convertToWebp;
exports.cleanDist = cleanDist;
exports.watcher = watcher;
