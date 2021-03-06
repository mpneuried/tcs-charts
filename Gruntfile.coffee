module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")
		regarde:
			coffee:
				files: ["_src/js/*.coffee"]
				tasks: [ "build-dev" ]
			#stylus:
			#	files: ["_src/css/*.styl"]
			#	tasks: [ "stylus" ]
			
		coffee:
			base:
				expand: true
				cwd: '_src/js/',
				src: ["*.coffee"]
				dest: "js/"
				ext: ".js"
			options:
				flatten: false
				bare: false

		concat: 
			build:
				src: ['js/*.js', "!js/index.js"],
				dest: 'tcscharts.js'

		copy: 
			build:
				src: ['tcscharts.js'],
				dest: '../WMSearch_stats/js/tcscharts.js'

		uglify: 
			component:
				src: [ "build/build.js"],
				dest: 'build/build.min.js'
			regular:
				src: ["tcscharts.js"],
				dest: 'tcscharts.min.js'

		component:
			build:
				options: 
					action: 'build'
			install:
				options:
      				action: 'install'

	###
		stylus:
			compile:
				files: "css/main.css": "_src/css/main.styl"
	###

	# keep grunt running
	grunt.option('force', not grunt.option('force'))

	# Load npm modules
	grunt.loadNpmTasks "grunt-regarde"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-stylus"
	grunt.loadNpmTasks "grunt-contrib-concat"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks('grunt-component')

	# ALIAS TASKS
	grunt.registerTask "watch", "regarde"
	grunt.registerTask "default", "build"

	grunt.registerTask "build-dev", [ "coffee", "component:build", "concat", "copy" ]
	grunt.registerTask "build", [ "coffee", "component:install", "component:build", "concat", "uglify" ]
