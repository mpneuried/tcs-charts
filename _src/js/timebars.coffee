if module?.exports?
	_Base = require( "./base.js" )
	@d3 = require( "d3" )
else
	_Base = window.tcscharts.Base


_TimeBars = class TimeBars extends _Base
	defaults: 
		timeKey: "ts"
		countKey: "count"

		width: 700
		height: 300
		margin: 20
		spacing: 3

		barsColor: "#718EE3"
		showCount: true
		countColorIn: "#fff"
		countColorOut: "#666"
		ticks: "minutes"
		tickFormat: "%I:%M"

		smallBarWidth: 20
		animationDuration: 600

	constructor: ( @target, @data = [], options )->
		_ret = super( @target )

		@_initOptions( options, true )

		@_calcMetrics()

		@create()

		@customTimeFormat = @timeFormat [
			[d3.time.format("%Y"), ()->return true ]
			[d3.time.format("%B"), (d)->return d.getMonth() ]
			[d3.time.format("%b %d"), (d)->return d.getDate() != 1 ]
			[d3.time.format("%a %d"), (d)->return d.getDay() && d.getDate() != 1 ]
			[d3.time.format("%I %p"), (d)->return d.getHours() ]
			[d3.time.format("%I:%M"), (d)->return d.getMinutes() ]
			[d3.time.format(":%S"), (d)->return d.getSeconds() ]
			[d3.time.format(".%L"), (d)->return d.getMilliseconds() ]
		]
		return _ret


	timeFormat: (formats)=>
		return ( date )->
			i = formats.length - 1
			f = formats[i]
			while ( not f[ 1 ](date) )
				f = formats[--i]
			return f[0](date)

	_calcMetrics: =>

		if @domainX?
			@_oldDomainX = @domainX

		times = for _d in @data
			_d[ @opt.timeKey ]

		@domainX = [ d3.min( times ), d3.max( times )]
		@domainY = [ 0, d3.max( @data, ( ( d )=>d[ @opt.countKey ] ) )]

		@interpolateX = d3.time.scale()
			.domain( @domainX )
			
			
 
		@interpolateY = d3.scale.linear()
			.range([ 0, @opt.height - 25 ])
			.domain( @domainY )

		@_barWidth = @_calcBarWidth()
		
		@interpolateX
			.range([0, @opt.width - @_barWidth])
			.tickFormat( @customTimeFormat )


		@xAxis = d3.svg.axis()
			.scale(@interpolateX)
			.orient("bottom")

		return


	_initOptions: ( options, def = false )=>
		@_extend( @opt = {}, @defaults, options ) if def
		
		if def
			for _k of @opt 
				@_initOption( _k )
		
		return

	_initOption: ( key )=>
		odef =
			get: =>
				return @opt[ key ]
			set: ( _v )=>
				@opt[ key ] = _v
				switch key
					when "width", "height"
						@create()
					else
						@create()
				return
		@define( key, odef, @ )


	fnRect: ( update = false, remove = false )=>
		return ( _el )=>
			_el.attr( "class", "bar" )
			if update
				_el
					.transition()
					.duration( @opt.animationDuration )
					.attrTween "transform", ( d, i, current )=>
						[ _tx, _ty ] = current[10..-2].split(",")
						if remove
							_h = 0
						else
							_h = @interpolateY( d[ @opt.countKey ] )
						
						_x = @interpolateX( new Date( d.ts ) )
						_y = @opt.height - _h - 25

						interX = d3.interpolate( d._x or parseFloat( _tx ), _x )
						interY = d3.interpolate( d._y or parseFloat( _ty ), _y )

						d._x = _x
						d._y = _y
						d._h = _h
						return ( _t )->"translate(#{ interX( _t ) },#{ interY( _t ) })"
			else
				_el
					.datum ( d )=>
						_h = @interpolateY( d[ @opt.countKey ] )
						d._x = @interpolateX( new Date( d.ts ) )
						d._y = @opt.height - _h - 25
						d._h = _h
						return d
					.attr "transform", (d, i)=>
						return "translate(#{ d._x },#{d._y})"
			if update
				_rect = _el.select( "rect" )
			else
				_rect = _el.append("rect")

			_rect
				.attr( "fill", @opt.barsColor )

			if update
				_rect
					.transition()
					.duration( @opt.animationDuration )
					.attr( "width", => @_barWidth )
					.attr "height", (d, i)=>
						if remove
							return 1e-6
						else
							return @interpolateY( d[ @opt.countKey ] )
			else
				_rect
					.attr( "width", => @_barWidth )
					.attr "height", (d, i)=>
						if remove
							return 1e-6
						else
							return @interpolateY( d[ @opt.countKey ] )
			
			if @opt.showCount
				if update
					_txt =	_el.select( "text" )
				else
					_txt = _el.append( "text" )

				_txt
					.attr "class", =>
						 if @_barWidth > @opt.smallBarWidth
						 	return "normal"
						 else
						 	return "small"
					.attr "transform", ( d )=>
						if d[ @opt.countKey ] < @domainY[1] * .1
							"translate(#{@_barWidth/2},-5)"
						else
							"translate(#{@_barWidth/2},15)"
					.attr "fill", ( d )=>
						if d[ @opt.countKey ] < @domainY[1] * .1
							@opt.countColorOut
						else
							 @opt.countColorIn
					.text ( d )=>
						return d[ @opt.countKey ]
			return _el

	create: =>
		_tgrt = d3.select(@target)
		_tgrt.select( "svg" ).remove()

		@svg = _tgrt.append("svg")
			.attr( "height", @opt.height + @opt.margin*2 )
			.attr( "width", @opt.width + @opt.margin*2 )
			.append("g")
				.attr("transform", "translate(" + @opt.margin + "," + @opt.margin + ")")

		

		@gxAxis = @svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(#{ @_barWidth / 2 }," + ( @opt.height - 20 ) + ")")
			.call( @xAxis )

		
		@_update()
		return

	_calcBarWidth: =>
		_l = @interpolateX.ticks( d3.time[ @opt.ticks ] ).length
		( @opt.width - ( _l * @opt.spacing ) ) / _l

	getData: =>
		@data

	add: ( _data )=>

		@data.push( _data )

		@_calcMetrics()

		@_update( true )

		return
	
	rem: ( id )=>
		_removed = false
		for _data, idx in @data when _data[ @opt.timeKey ] is id
			@data.splice( idx, 1 )
			_removed = true
			break

		if _removed
			@_calcMetrics()

			@_update( true )

		return

	reset: ( @data )=>

		@_calcMetrics()

		@_update( true )

		return

	_update: ( update = false )=>
		@bars = @svg.selectAll(".bar")
			.data @data, ( _d )=>
				return _d[ @opt.timeKey ] 
	
		if update
			@gxAxis
				.transition()
				.duration( @opt.animationDuration )
				.attr("transform", "translate(#{ @_barWidth / 2 }," + ( @opt.height - 20 ) + ")")
				.call( @xAxis )


			@bars
				.transition()
				.duration( @opt.animationDuration )

		@bars
			.enter()
			.append("g")
			.call( @fnRect( false ) )

		@bars
			.call( @fnRect( true ) )


		_rems = @bars
			.exit()
			.call( @fnRect( true, true ) )
			.remove()
		return



if module?.exports?
	module.exports = _TimeBars
else
	window.tcscharts or= {}
	window.tcscharts.TimeBars = _TimeBars