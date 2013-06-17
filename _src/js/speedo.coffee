_ = require( "underscore" )
d3 = require( "d3" )

module.exports = class Speedo
  
  defaults: 
    width: 500
    margin: 0
    startAngle: -75
    endAngle: 75
    thicknessFactor: .8
    needleLengthFactor: null
    
    bgColor: "#ddd"
    needleColor: "#333"
    
    fixedColor: null
    startColor: "#B4EB57"
    endColor: "#D10000"
    
    animationDuration: 500
  
  _rad: 2*Math.PI/360
  
  getter: ( prop, fnGet, obj = @ )=>
    Object.defineProperty obj, prop, get: fnGet
    return

  setter: ( prop, fnGet, obj = @ )=>
    Object.defineProperty obj, prop, set: fnGet
    return
  
  define: ( prop, oDef, obj )=>
    Object.defineProperty obj, prop, oDef
    return
  
  constructor: ( @target, startValue = 0, options )->
    @_initOptions( options, true )
    #@_value = startValue
    
    oDef = 
      get: =>
        return @_value * 100
      set: ( _v )=>
        if _v > 1
          _v = _v / 100
        @_set( _v ) 
        return
    @define( "value", oDef, @ )
  	
    @value = startValue

    @create()    
    return
  
  _initOptions: ( options, def = false )=>
    @opt = _.extend( {}, @defaults, options ) if def
    
    @opt.height = @opt.width / 2
    
    if def
      for _k of @opt 
        @_initOption( _k )
    
    return
  
  _initOption: ( key )=>
    odef =
      get: =>
        if key is "needleLengthFactor" and not @opt[ key ]?
          return @opt[ "thicknessFactor" ]
        else
          return @opt[ key ]
      set: ( _v )=>
        @opt[ key ] = _v
        switch key
          when "width", "needleLengthFactor", "thicknessFactor"
            @_initOptions( null )
            @create()
          when "animationDuration", "startColor", "endColor"
          else
            @create()
        return
    @define( key, odef, @ )
  
  _angleToRad: ( angl )=>
    @_rad * angl
   
  _radToAngle: ( rad )=>
    rad / @_rad
  
  _arc: ( end )=>

    arc = d3.svg.arc()
      .outerRadius( @opt.width/2.05 )
      .innerRadius( @opt.width/6/@opt.thicknessFactor  )
      .startAngle( @_angleToRad( @opt.startAngle ) )

    if end?
      arc.endAngle( @_angleToRad( end ) )
    return arc
 
  create: =>
    _tgrt = d3.select(@target)
    _tgrt.select( "svg" ).remove()
    
    @svg = _tgrt.append("svg")
      .attr( "height", @opt.height + @opt.margin*2 )
      .attr( "width", @opt.width + @opt.margin*2 )
      .style( "fill", "#666" )
      .append("g").attr("transform", "translate(" + @opt.margin + "," + @opt.margin + ")");
    
    @bg = @svg.append("path")
      .style( "fill", @opt.bgColor )
      .attr( "class", "bg" )
      .attr("transform", "translate(#{ @opt.height },#{ @opt.height })")
      .attr( "d", @_arc( @opt.endAngle ) )
    
    @color = @svg.append("path")
      .attr( "class", "color" )
      .attr("transform", "translate(#{ @opt.height },#{ @opt.height })")
      .datum({endAngle: @_angleToRad( @_getAngleByFactor( @_value ) ), fill: @_getColorByFactor( @_value ) })
      .attr( "d", ( @arc = @_arc() ) )
    
    if @opt.fixedColor?
        @color.attr( "fill", @opt.fixedColor )
        
    if not @opt.neelde
      @needle = @svg.append("path")
        .style( "fill", @opt.needleColor)
        .attr( "class", "needle" )
        .datum({angle: @_getAngleByFactor( @_value ) })
        .attr( "d", @_calcNeedle() )
        .attr( "transform", "rotate(#{ @_getAngleByFactor( 0 ) } #{ @opt.height } #{ @opt.height })" )
    
    @_set( @_value )
    return
  
  _calcNeedle: =>
    _w = @opt.width
    _h = @opt.height
    "M#{ _w*0.495 } 0 L#{ _w*0.505 } 0 L#{ _w*0.52 } #{ _h*.73 * @needleLengthFactor } L#{ _w*0.48 } #{ _h*.73 * @needleLengthFactor } Z"
  
  _getAngleByFactor: ( factor )=>
     d3.interpolate(@opt.startAngle , @opt.endAngle)( factor )
   
  _getColorByFactor: ( factor )=>
     d3.interpolateRgb(@opt.startColor , @opt.endColor)( factor )
  
  _set: ( @_value, duration = @opt.animationDuration )=>
    if @color?
      @color.transition()
        .duration(duration)
        .call( @tween, @_value )
        
    if not @opt.neelde and @needle?
      @needle.transition()
        .duration(duration)
        .call( @tweenNeedle, @_value )
    return
  
  tween: ( transition, factor )=>
    _angle = @_getAngleByFactor( factor )
    transition.attrTween "d", ( d )=>
      interpolate = d3.interpolate(@color.datum().endAngle, @_angleToRad(_angle ))
     
      return ( t )=>
        d.endAngle = interpolate(t)
        return @arc(d)
    
    if @opt.fixedColor?
      return
    
    _color = @_getColorByFactor( factor )
    transition.attrTween "fill", ( d )=>
       interpolate = d3.interpolate(@color.datum().fill, _color )
       return ( t )=>
         _color = interpolate(t)
         @color.datum().fill = _color
         return _color
    return
   
  tweenNeedle: ( transition, factor )=>
    newAngle = @_getAngleByFactor( factor )
    transition.attrTween "transform", ( rotate )=>
      interpolate = d3.interpolate(@needle.datum().angle, newAngle)
      return ( t )=>
        _newAngle = interpolate(t)
        @needle.datum().angle = _newAngle
        return "rotate(#{ _newAngle } #{ @opt.height } #{ @opt.height })"
    return