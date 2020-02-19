var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var spritesmith = require("gulp.spritesmith");
var imagemin = require("gulp-imagemin");
var buffer = require("vinyl-buffer");
var browserSync = require("browser-sync");

gulp.task("sass", function() {
  console.log("gulp sass 호출");
  return gulp
    .src("scss/*.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream({ match: "**.*.css" }));
});

gulp.task("sprite", function() {
  const spriteData = gulp.src("sprites/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "_sprite.scss",
      imgPath: "../img/sprite.png"
    })
  );

  const imgStream = new Promise(function(resolve) {
    spriteData.img
      .pipe(buffer())
      .pipe(imagemin())
      .pipe(gulp.dest("img/"))
      .on("end", resolve);
  });

  const cssStream = new Promise(function(resolve) {
    spriteData.css.pipe(gulp.dest("scss/")).on("end", resolve);
  });

  return Promise.all([imgStream, cssStream]);
});

gulp.task("copy", function() {
  return gulp.src("*.txt").pipe(gulp.dest("text/"));
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// gulp 3.x
// gulp.task("watch", ["browser-sync"], function() {
//   gulp.watch("scss/*.scss", ["sass"]);
//   gulp.watch("*.html").on("change", browserSync.reload);
// });

// gulp.task("default", ["watch"]);

// gulp 4 버전
gulp.task(
  "watch",
  gulp.series("browser-sync", function() {
    gulp.watch("scss/*.scss", ["sass"]);
    gulp.watch("*.html").on("change", function() {
      browserSync.reload;
    });
  })
);

gulp.task("default", gulp.series("watch"));
