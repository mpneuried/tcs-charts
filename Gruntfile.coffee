module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")
		regarde:
			coffee:
				files: ["_src/js/*.coffee"]
				tasks: [ "coffee:base", "component" ]
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

		component:
			build:
				options: {}

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
	grunt.loadNpmTasks('grunt-component')

	# ALIAS TASKS
	grunt.registerTask "watch", "regarde"
	grunt.registerTask "default", "build"

	grunt.registerTask "build", [ "coffee", "component" ]
