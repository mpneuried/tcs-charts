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
		margin: 
			top: 20
			right: 20
			bottom: 10
			left: 40
		spacing: 3

		barsColor: null
		showCount: false
		countColorIn: "#fff"
		countColorOut: "#666"
		ticks: "minutes"
		timeFormat: null
		timeDomain: null

		smallBarWidth: 20
		animationDuration: 600

	constructor: ( @target, @data = [], options )->
		_ret = super( @target )

		@_initOptions( options, true )

		@_calcMetrics()

		@create()

		return _ret

	_calcMetrics: =>
		if @domainX?
			@_oldDomainX = @domainX

		if @opt.timeDomain?
			@domainX = @opt.timeDomain
			@data = for _dt in @data when _dt[ @opt.timeKey ] > @domainX[ 0 ] and _dt[ @opt.timeKey ] < @domainX[ 1 ]
				_dt
		else
			times = for _d in @data
				_d[ @opt.timeKey ]
			@domainX = [ d3.min(times), d3.max(times) ]
		@domainY = [ d3.max( @data, ( ( d )=>d[ @opt.countKey ] ) ), 0]
		
		@interpolateX = d3.time.scale()
			.domain( @domainX )
 
		@interpolateY = d3.scale.linear()
			.range([ 0, @opt.height - 25 ])
			.domain( @domainY )

		@_barWidth = @_calcBarWidth()
		
		@interpolateX
			.range([0, @opt.width - @_barWidth ])


		@xAxis = d3.svg.axis()
			.scale(@interpolateX)
			.orient("bottom")

		@yAxis = d3.svg.axis()
			.scale(@interpolateY)
			.tickSize(@opt.width)
			.orient("left")

		if @opt.tickCount?
			@xAxis.ticks( @opt.tickCount )

		if @opt.timeFormat?
			if typeof @opt.timeFormat is "function"
				@xAxis.tickFormat( @opt.timeFormat )
			else
				@xAxis.tickFormat ( date )=>
						d3.time.format( @opt.timeFormat )( date )
		return


	_initOptions: ( options, def = false )=>
		@_extend( @opt = {}, @defaults, options ) if def
		
		@opt._width = @opt.width + @opt.margin.left + @opt.margin.right
		@opt._height = @opt.height + @opt.margin.top + @opt.margin.bottom

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
			_el.attr "class", (d)=>
				_classes = [ "bar" ]
				if @_barWidth > @opt.smallBarWidth
					_classes.push "normal"
				else
					_classes.push "small"
				if d[ @opt.countKey ] < @domainY[0] * .2
					_classes.push "low"
				else
					_classes.push "high"
				return _classes.join( " " )

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
						_y = _h

						interX = d3.interpolate( d._x or parseFloat( _tx ), _x )
						interY = d3.interpolate( d._y or parseFloat( _ty ), _y )

						d._x = _x
						d._y = _y
						d._h = _h
						return ( _t )->"translate(#{ interX( _t ) },#{ interY( _t ) })"
			else
				_this = @
				_el.on "mouseenter", ( datum )-> _this._enterRect( @, datum )
				_el.on "mouseleave", ( datum )-> _this._leaveRect( @, datum )
				_el
					.datum ( d )=>
						_h = @interpolateY( d[ @opt.countKey ] )
						d._x = @interpolateX( new Date( d.ts ) )
						d._y = _h
						d._h = _h
						return d
					
					.attr "transform", (d, i)=>
						return "translate(#{ d._x },#{d._y})"
			if update
				_rect = _el.select( "rect" )
			else
				_rect = _el.append("rect")

			if @opt.barsColor?
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
							return @opt.height - 25 - @interpolateY( d[ @opt.countKey ] )
			else
				_rect
					.attr( "width", => @_barWidth )
					.attr "height", (d, i)=>
						if remove
							return 1e-6
						else
							return @opt.height - 25 - @interpolateY( d[ @opt.countKey ] )
			
			if @opt.showCount
				if update
					_el.select( ".count" )
						.attr "class", (d)=>
							_classes = [ "count" ]
							if @_barWidth > @opt.smallBarWidth
								_classes.push "normal"
							else
								_classes.push "small"
							if d[ @opt.countKey ] < @domainY[0] * .2
								_classes.push "low"
							else
								_classes.push "high"
							return _classes.join( " " )
					_txt =	_el.select( "text" )
				else
					_el
						.append( "rect" )
							.attr( "class", "count" )
							.attr( "height", 20 )
							.attr( "width", => @_barWidth - 8 )
					_txtg = _el
						.append( "g" )
						.attr "transform", =>return "translate(#{@_barWidth/2},19)"
							
					_txt = _txtg.append( "text" )
					
				

					

				_txt.text ( d )=>
						return d[ @opt.countKey ]
					#
					#.attr "fill", ( d )=>
					#	if d[ @opt.countKey ] < @domainY[0] * .2
					#		@opt.countColorOut
					#	else
					#		@opt.countColorIn
			return _el

	_enterRect: ( el, datum )=>
		return

	_leaveRect: ( el, datum )=>
		return

	create: =>
		_tgrt = d3.select(@target)
		_tgrt.select( "svg" ).remove()

		@svg = _tgrt.append("svg")
			.attr( "height", @opt._height )
			.attr( "width",  @opt._width )
			.append("g")
				.attr("transform", "translate(" + @opt.margin.left + "," + @opt.margin.top + ")")

		

		@gxAxis = @svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(#{ @_barWidth / 2 }," + ( @opt.height - 20 ) + ")")
			.call( @xAxis )

		@gyAxis = @svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + ( @opt.width - 12 ) + ", 0)")
			.call( @yAxis )

		
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

			@gyAxis
				.transition()
				.duration( @opt.animationDuration )
				#.attr("transform", "translate(#{ @_barWidth / 2 }," + ( @opt.height - 20 ) + ")")
				.call( @yAxis )


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