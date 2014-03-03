module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		path: {
			css: 'css',
			cssSrc: 'csssrc', // in sass:dist we move the css to cssSrc folder and after bless we move them to the actual css folder
			img: 'img',
			js: 'js',
			jsSrc: 'js/src',
			jsDist: 'js/dist',
			sass: 'sass'
		},
		concat: {
			options: {
				compress: false,
				separator: ''
			},
			dist: {
				src: [
					'<%= path.jsSrc %>/vendor/jquery.min.js',
					'<%= path.jsSrc %>/3rdparty/*.js',
					'<%= path.jsSrc %>/main.js',
					'<%= path.jsSrc %>/*.js'
				],
				dest: '<%= path.jsDist %>/main.js'
			}
		},
		uglify: {
			options: {
				mangle: false,
				compress: false,
				banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
						' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
			},
			build: {
				src: '<%= path.jsDist %>/main.js',
				dest: '<%= path.jsDist %>/main.min.js'
			}
		},
		sass: {
            dist: {
                files: {
                    '<%= path.cssSrc %>/main.css': 'sass/main.scss'
                }
            }
        },
		// compass: {
		// 	dev: {
		// 		options: {
		// 			httpPath: '/',
		// 			cssDir: '<%= path.cssSrc %>',
		// 			sassDir: '<%= path.sass %>',
		// 			imagesDir: '<%= path.img %>',
		// 			javascriptsDir: '<%= path.js %>',
		// 			outputStyle: 'expanded',
		// 			noLineComments: false,
		// 			trace: true,
		// 			debugInfo: false,
		// 			force: false,
		// 			boring: true
		// 		}
		// 	},
		// 	build: {
		// 		options: {
		// 			httpPath: '/',
		// 			cssDir: '<%= path.cssSrc %>',
		// 			sassDir: '<%= path.sass %>',
		// 			imagesDir: '<%= path.img %>',
		// 			javascriptsDir: '<%= path.js %>',
		// 			outputStyle: 'compressed',
		// 			noLineComments: true,
		// 			trace: true, // we want a stack trace on this important file
		// 			force: true
		// 		}
		// 	}
		// },
		jekyll: {
			serve: {
				options: {
					server: true,
					server_port: 8000,
					auto: true,
					dest: './_site',
					src: '.'
					// excludes are configured in _config.yml
				}
			}
		},
		bgShell: {
			_defaults: {
				bg: true
			},
			jekyll: {
				cmd: 'grunt jekyll:serve'
			}
		},
		imageoptim: {
			// these paths should match directories
			files: [
				'./img'
			],
			options: {
				// also run images through ImageAlpha.app before ImageOptim.app
				imageAlpha: true,
				// also run images through JPEGmini.app after ImageOptim.app
				jpegMini: false,
				// quit all apps after optimisation
				quitAfter: true
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true
			},
			all: ['js/src/**/*.js']
		},
		bless: { // split long css files in multiple small files (is for IE bug)
			options: {
				force: true
			},
			masterAll: {
				src: '<%= path.cssSrc %>/main.css',
				dest: '<%= path.css %>/main.css'
			},
			masterOldie: {
				src: '<%= path.cssSrc %>/main-old-ie.css',
				dest: '<%= path.css %>/main-old-ie.css'
			}
		},
		watch: { // watch certain files and when the change, do something!
			// compass: {
			// 	files: ['<%= path.sass %>/*.scss','<%= path.sass %>/**/*.scss'],
			// 	tasks: ['compass:dev', 'bless']
			// },
			sass: {
				files: ['<%= path.sass %>/*.scss','<%= path.sass %>/**/*.scss'],
                tasks: ['sass:dist', 'bless']
            },
            js: {
            	files: ['<%= path.jsSrc %>/main.js', '<%= path.jsSrc %>/3rdparty/*.js', '<%= path.jsSrc %>/*.js'],
				tasks: ['concat:dist', 'uglify']
            }
		}
	});

	// Loading dependencies
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
	}

	// Default task(s).
	grunt.registerTask('default', [
		'bgShell:jekyll',
		// js specific tasks
		'concat:dist',
		'uglify:build',
		// sass specific tasks
		'sass:dist',
		// watch
		'watch'
	]);

};