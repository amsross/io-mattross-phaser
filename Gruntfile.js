'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			js: {
				files: [
					'!**/*.min.js',
					'assets/js/**/*.js',
					'Gruntfile.js',
				],
				tasks: ['jshint', 'uglify'],
				options: {
					livereload: true,
				},
			},
			img: {
				files: [
					'!**/.DS_Store',
					'!**/Thumbs.db',
					'assets/img/**/*.*',
				],
				tasks: ['imagemin'],
				options: {
					livereload: true,
				},
			},
			less: {
				files: [
					'assets/less/**/*.less'
				],
				tasks: ['less'],
				options: {
					livereload: true
				}
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: 'assets/bower_components/phaser/build/',
				src: [
					'phaser.min.js',
					'phaser.map',
				],
				dest: 'build/js/',
				flatten: true,
				filter: 'isFile',
			},
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: [
				'assets/js/**/*.js',
				'Gruntfile.js',
			]
		},
		uglify: {
			dist: {
				files: {
					'build/js/main.min.js': [
						'assets/js/game.js',
					]
				},
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapName: 'build/js/main.min.js.map'
				}
			}
		},
		less: {
			dist: {
				files: {
					'build/css/main.min.css': [
						'assets/less/game.less',
					]
				},
				options: {
					compress: true,
					outputSourceFiles: true,
					sourceMap: true,
					sourceMapBasepath: '../../',
					sourceMapFilename: 'build/css/main.min.css.map',
					sourceMapURL: 'main.min.css.map'
				}
			}
		},
		imagemin: {
			dist: {
				options: {
					interlaced: true,
					optimizationLevel: 7,
					pngquant: true,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'assets/img/',
					src: [
						'**/*.*',
						'!**/Thumbs.db',
						'!**/.DS_Store',
					],
					dest: 'assets/img/'
				}]
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'copy',
		'jshint',
		'uglify',
		'less',
		'imagemin',
	]);

	grunt.registerTask('dev', [
		'default',
		'watch',
	]);

	grunt.registerTask('build', [
		'default',
	]);
};
