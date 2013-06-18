_Base = class Base
	
	defaults: {}

	getter: ( prop, fnGet, obj = @ )=>
		Object.defineProperty obj, prop, get: fnGet
		return

	setter: ( prop, fnGet, obj = @ )=>
		Object.defineProperty obj, prop, set: fnGet
		return
	
	define: ( prop, oDef, obj )=>
		Object.defineProperty obj, prop, oDef
		return

	_extend: ( objects... )=>
		for object in objects
			for key, value of object
				objects[ 0 ][key] = value
		return objects[ 0 ]

	constructor: ( @target )->
		try
			Object.defineProperty @, "testIE", get: ->false
		catch _e
			return new Error( "browser-outdated", "tcs-charts not availible on IE8 and lower." )
		return

if module?.exports?
	module.exports = _Base
else
	window.tcscharts or= {}
	window.tcscharts.Base = _Base