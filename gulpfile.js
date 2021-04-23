const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');
// Подключаем модуль gulp-newer
const newer = require('gulp-newer');
// Подключаем модуль del
const del = require('del');
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
let preprocessor = 'sass'; // Выбор препроцессора в проекте - sass или less
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'app/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function scripts() {
    return src([ // Берём файлы из источников
        'app/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ])
        .pipe(concat('app.min.js')) // Конкатенируем в один файл
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}
function startwatch() {

    // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch("app/sass/**/*.{scss,sass}", styles);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/images/src/**/*', images);

}

function styles() {
    return src('app/' + preprocessor + '/main.scss' + '') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
        .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
        .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
        .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
        .pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
        .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
    return src('app/img/**/*') // Берём все изображения из папки источника
        .pipe(newer('app/img/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
        .pipe(imagemin()) // Сжимаем и оптимизируем изображеня
        .pipe(dest('app/img/dest/')) // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
    return del('app/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "app/images/dest/"
}

function cleandist() {
    return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}
function buildcopy() {
    return src([ // Выбираем нужные файлы
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/img/dest/**/*',
        'app/**/*.html',
    ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.build = series(styles, scripts, images, buildcopy, cleandist);
exports.default = parallel(styles, scripts, browsersync, startwatch);