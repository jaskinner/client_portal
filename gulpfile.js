const gulp = require("gulp");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");

gulp.task("default", () => {
    gulp.src("src/**/*.js").pipe(eslint()).pipe(eslint.format());
    gulp.src("src/**/*.js").pipe(babel()).pipe(gulp.dest("dist"));
});
