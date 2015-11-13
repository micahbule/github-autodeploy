var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var bump = require('gulp-bump');
var git = require('gulp-git');
var argv = require('yargs').argv;
var fs = require('fs');
var semver = require('semver');

var getPackageJson = function () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('bump', function() {
    var type = 'patch';
    
    if (argv.major) {
        type = 'major';
    } else if (argv.minor) {
        type = 'minor';
    } else if (argv.patch) {
        type = 'patch';
    } else if (argv.prerelease) {
        type = 'prerelease';
    }
    
    var pkg = getPackageJson();
    var newVer = semver.inc(pkg.version, type);
    
    gulp.src('./package.json')
    .pipe(bump({type:type}))
    .pipe(gulp.dest('./'))
    .pipe(git.add())
    .pipe(git.commit('Version bumped to ' + newVer));
});

gulp.task('release', gulpSequence('bump'));