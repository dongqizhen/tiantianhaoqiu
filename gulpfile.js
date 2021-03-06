
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename')
var changed = require('gulp-changed')
var watcher = require('gulp-watch')
//自动监听
gulp.task('default', gulp.series(function() {
 watcher(['./components/**/*.scss','./pages/**/*.scss'], function(path){
   if(path.base.endsWith('pages')){
     miniPageSass()
   }else if(path.base.endsWith('components')){
     miniSass();
   }
   
 });
}));
//手动编译
gulp.task('sass', function(){
 miniSass();
});
function miniSass(){
 return gulp.src(['./components/**/*.scss'])//需要编译的文件
   .pipe(sass({
     outputStyle: 'expanded'//展开输出方式 expanded 
    }))
    .pipe(rename((path)=> {
     path.extname = '.wxss'
   }))
   .pipe(changed((path)=>{
     return './components'
   }))//只编译改动的文件
   .pipe(gulp.dest('./components'))//编译
   .pipe(rename((path)=> {
     console.log('编译完成文件：' + 'components\\' + path.dirname + '\\' + path.basename + '.scss')
   }))
}

function miniPageSass(){
  return gulp.src(['./pages/**/*.scss'])//需要编译的文件
    .pipe(sass({
      outputStyle: 'expanded'//展开输出方式 expanded 
     }))
     .pipe(rename((path)=> {
      path.extname = '.wxss'
    }))
    .pipe(changed((path)=>{
      return './pages'
    }))//只编译改动的文件
    .pipe(gulp.dest('./pages'))//编译
    .pipe(rename((path)=> {
      console.log('编译完成文件：' + 'pages\\' + path.dirname + '\\' + path.basename + '.scss')
    }))
 }
