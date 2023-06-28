/*!
 * Available Main Task Command : production, gulp, zip
 */

(function () {
  "use strict";
  /*
    =============================
        Let's see all CSS/JS Plugin into [package.json]
    =============================
    */

  var File_Name = "ue-theme-template.zip";

  var CSS_Files = [
    "./app/libs/custom.css"
  ];
  var JS_Files = [
    "./magic/app.js"
  ];
  var Production_CSS_Files = [
    "./dist/production/assets/css/swiper-bundle.min.css"
  ];
  var Production_JS_Files = [
    "./dist/production/assets/js/app.js"
  ];

  /*
=============================
	Include Gulp & Plugins
=============================
*/
  const gulp = require("gulp"),
    cleanCSS = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    terser = require("gulp-terser"),
    jshint = require("gulp-jshint"),
    plumber = require("gulp-plumber"),
    exec = require("child_process").exec,
    c = require("ansi-colors"),
    replace = require("gulp-replace"),
    size = require("gulp-size"),
    zip = require("gulp-zip"),
    // postcss 		= require('postcss'),
    atimport = require("postcss-import"),
    purgecss = require("@fullhuman/postcss-purgecss"),
    tailwindcss = require("tailwindcss"),
    del = require("del"),
    gulpCopy = require("gulp-copy"),
    runSequence = require("run-sequence"),
    inject = require("gulp-inject"),
    postcss = require("gulp-postcss");
    
  const sass = require("gulp-sass")(require("sass"));

  gulp.task("clean", function () {
    return del("dist", {
      force: true,
    });
  });
  gulp.task("copy_css_files", function (done) {
    return gulp
      .src(CSS_Files)
      .pipe(gulp.dest("./dist/production/assets/css"))
      .pipe(size());
    done();
  });

  gulp.task("shello", function (cb) {
    exec(
      "git add . && git commit -am 'shell' && git ftp push",
      function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      }
    );
  });

  gulp.task("copy_js_files", function (done) {
    return gulp
      .src(JS_Files)
      .pipe(gulp.dest("./dist/production/assets/js"))
      .pipe(size());

    done();
  });

  gulp.task("copy_all_files", function (done) {
    return gulp
      .src([
        "./**/*",
        "!.jshintignore",
        "!.jshintrc",
        "!bower.json",
        "!gulpfile.js",
        "!package.json",
        "!package-lock.json",
        "!.gitattributes",
        "!gitignore",
        "!README.md",
        "!.gitignore",
        "!./node_modules/**",
        "!./bower_components/**",
        "!./dist/**",
        "!./git/**",
      ])
      .pipe(gulp.dest("./dist/production"))
      .pipe(size());
    done();
  });

  gulp.task("inject_code_html", function (cb) {
    return gulp
      .src("./dist/production/*.html") //file with tags for injection
      .pipe(
        inject(gulp.src(Production_JS_Files), {
          starttag: "<!-- gulp:{{ext}} -->",
          endtag: "<!-- endgulp -->",
          relative: true,
        })
      )
      .pipe(gulp.dest("./dist/production")); //where index.html will be saved. Same dir for overwrite old one
  });
  gulp.task("inject_code_html_2", function (cb) {
    return gulp
      .src("./dist/production/*.html") //file with tags for injection
      .pipe(
        inject(gulp.src(Production_CSS_Files), {
          starttag: "<!-- gulp:{{ext}} -->",
          endtag: "<!-- endgulp -->",
          relative: true,
        })
      )
      .pipe(gulp.dest("./dist/production")); //where index.html will be saved. Same dir for overwrite old one
  });

  gulp.task("remove_extra_code", function () {
    return gulp
      .src("./dist/production/*.html")
      .pipe(
        replace('<link rel="stylesheet" href="assets/css/app.min.css">', "")
      )
      .pipe(replace('<script src="assets/js/build.min.js"></script>', ""))
      .pipe(gulp.dest("./dist/production"));
  });
  gulp.task("production-zip", function (done) {
    gulp
      .src(["./dist/production/**/*"])
      .pipe(zip("production-" + File_Name))
      .pipe(gulp.dest("./dist/"))
      .pipe(size());
    done();
  });

  gulp.task("sass", function (done) {
    return gulp
      .src("./assets/scss/*.scss")
      .pipe(
        plumber({
          // errorHandler: onError
        })
      )
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gulp.dest("./assets/css"))
      .pipe(cleanCSS())
      .pipe(size());
    done();
  });

  gulp.task("tw", function (done) {
    return gulp
      .src("./node_modules/tailwindcss/tailwind.css")
      .pipe(postcss())
      .pipe(concat("tailwind.css"))
      .pipe(gulp.dest("./assets/css"))
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(cleanCSS())
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(gulp.dest("./assets/css"))
      .pipe(size());
    done();
  });
  gulp.task("output", function (done) {
    return gulp
      .src([
        "./node_modules/tailwindcss/tailwind.css",
        "./assets/css/custom.css",
        "./assets/css/page-preview.css",
      ])
      .pipe(postcss())
      .pipe(concat("output.css"))
      .pipe(gulp.dest("./"))
      .pipe(cleanCSS())
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(size());
    done();
  });
  gulp.task("js", function (done) {
    return gulp
      .src(JS_Files)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(concat("build.js"))
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(terser())
      .pipe(gulp.dest("./assets/js"))
      .pipe(size());
    done();
  });
  gulp.task("app_css", function (done) {
    return gulp
      .src(CSS_Files)
      .pipe(concat("app.css"))
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(cleanCSS())
      .pipe(postcss())
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulp.dest("./assets/css"))
      .pipe(size());
    done();
  });
  gulp.task("zip", function (done) {
    gulp
      .src([
        "./**/*",
        ".jshintignore",
        ".jshintrc",
        "!.gitattributes",
        "!README.md",
        "!.gitignore",
        "!./node_modules/**",
        "!./bower_components/**",
        "!./dist/**",
        "!./git/**",
      ])
      .pipe(zip("dev-" + File_Name))
      .pipe(gulp.dest("dist"))
      .pipe(size());
    done();
  });
  gulp.task("watch", function () {
    gulp.watch("tailwind.config.js", gulp.series("build"));
    gulp.watch(["./assets/js/app.js"], gulp.series("js"));
    gulp.watch("./**/*.scss", gulp.series("build_css"));
    gulp.watch("./**/*.html", gulp.series("build_css"));
    gulp.watch("./**/*.php", gulp.series("build_css"));
  });
  gulp.task("build_css", gulp.series("sass", "tw", "output", "app_css"));
  gulp.task("build", gulp.series("build_css", "js"));
  gulp.task(
    "production",
    gulp.series(
      "clean",
      "copy_all_files",
      "copy_css_files",
      "copy_js_files",
      "inject_code_html",
      "inject_code_html_2",
      "remove_extra_code",
      "production-zip",
      "zip"
    )
  );
  gulp.task("default", gulp.series("build", "watch"));
})();
