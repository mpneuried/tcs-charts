tcs-charts
==========

D3 Charting helpers

# Gauge

## Example

```
<html>
	<head>
		<script src="build.js"></script>
	</head>
	<body>
		<div id="example"></div>
	</body>
	<script>
		Gauge = require( "tcs-charts" ).Gauge;
		myGauge = new Gauge()
		setIntervall( function(){
			myGauge.value = Math.Math.random() * 100
		}, 1000 );		
	</script>
</html>
```

This will init the default speedo and set a random value between 0 - 100 every second.


## init

```
Gauge = require( "tcs-charts" ).Gauge;

myGauge = new Gauge( "#example", 30, { width: 300 } );
```

First you have to require the "tcs-charts" and get the Gauge component.

**`new Gauge( targetSelector [, startValue ][, options ] )`**

###Arguments

- **targetSelector** : *( `String` required )*  
A simple CSS selector where the speedo should be placed
- **startValue** : *( `Number` optional: default = `0` )*  
A value between `0` and `100` to define the start value
- **options** : *( `Object` optional )*  
Configuration object
  - **width** : *( `Number` default = `500` )*  
The with of the speedo
  - **margin** : *( `Number` default = `0` )*  
The margins arround the speedo. Needed for a -90° -> 90° to not cut off the half of the needle at the edges.
  - **startAngle** : *( `Number` default = `-75` )*  
The left starting Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
  - **endAngle** : *( `Number` default = `75` )*  
The right end Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
  - **thicknessFactor** : *( `Float` default = `0.8` )*  
A factor to change the thickness of the angle display.
  - **needleLengthFactor** : *( `Float` default = `thicknessFactor` )*  
A factor to change the length of the needle. If set to `0` no neelde will be hidden. 
  - **bgColor** : *( `String` default = `#ddd` )*  
The color of the background.
  - **needleColor** : *( `String` default = `#333` )*  
The color of the needle. 
  - **startColor** : *( `String` default = `#B4EB57` )*  
The starting color witch references the value `0`
  - **endColor** : *( `String` default = `#D10000` )*  
The ending color witch references the value `100`
  - **fixedColor** : *( `String` default = `null` )*  
A fixed Color. This will overwrite the `startColor` and `endColor` and displays a solid color through the whole vaule range.
  - **animationDuration** : *( `Number` default = 500 )*  
The duration of the animation in `ms`

###Getter/Setter

- **myGauge.value** : *( `Number` )*  
The new value of the speedo
- **myGauge.width** : *( `Number` )*  
The with of the speedo
- **myGauge.margin** : *( `Number` )*  
The margins arround the speedo.
- **yGauge.startAngle** : *( `Number` default = `-75` )*  
The left starting Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
- **yGauge.endAngle** : *( `Number` default = `75` )*  
The right end Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
- **yGauge.thicknessFactor** : *( `Float` default = `0.8` )*  
A factor to change the thickness of the angle display.
- **yGauge.needleLengthFactor** : *( `Float` default = `thicknessFactor` )*  
A factor to change the length of the needle. If set to `0` no neelde will be hidden. 
- **yGauge.bgColor** : *( `String` default = `#ddd` )*  
The color of the background.
- **yGauge.needleColor** : *( `String` default = `#333` )*  
The color of the needle. 
- **yGauge.startColor** : *( `String` default = `#B4EB57` )*  
The starting color witch references the value `0`
- **yGauge.endColor** : *( `String` default = `#D10000` )*  
The ending color witch references the value `100`
- **yGauge.fixedColor** : *( `String` default = `null` )*  
A fixed Color. This will overwrite the `startColor` and `endColor` and displays a solid color through the whole vaule range.
- **yGauge.animationDuration** : *( `Number` default = 500 )*  
The duration of the animation in `ms`

# Timebars

## Example

```
<html>
	<head>
		<script src="build.js"></script>
	</head>
	<body>
		<div id="example"></div>
	</body>
	<script>
		data = [
			{ "ts": 1371114780000, "count": 55 },
			{ "ts": 1371114720000, "count": 54 },
			{ "ts": 1371114660000, "count": 53 },
			{ "ts": 1371114540000, "count": 58 },
			{ "ts": 1371114480000, "count": 10 },
			{ "ts": 1371114420000, "count": 50 }
		]

		TimeBars = require( "tcs-charts" ).TimeBars;
		myTimeBar = new TimeBars( "#{example}", data )
	</script>
</html>
```

This will display 6 bars.

[A functional an more extended example](http://jsbin.com/ixulus/2/embed?live)

## init

```
data = [ { "ts": 1371114780000, "count": 55 }, { "ts": 1371114720000, "count": 54 } ]

Timebars = require( "tcs-charts" ).Timebars;
myTimebar = new Timebars( "#example", data, { width: 300 } );
```

First you have to require the "tcs-charts" and get the TimeBars component.

**`new Timebars( targetSelector , data [, options ] )`**

##Arguments

- **targetSelector** : *( `String` required )*  
A simple CSS selector where the speedo should be placed
- **data** : *( `Object[]` required )*  
An Array of objects with the data. There has to be at least 2 keys per object. Default is `{ "ts": 1371114420000, "count": 50 }` width `ts` as timestamp and `count` as value to display
- **options** : *( `Object` optional )*  
Configuration object
  - **timeKey** : *( `String` default = `ts` )*  
The key within your objects containing the timestamp
  - **countKey** : *( `String` default = `count` )*  
The key within your objects containing the count
  - **width** : *( `Number` default = `700` )*  
The with of the chart
  - **height** : *( `Number` default = `300` )*  
The height of the chart
  - **margin** : *( `Object` )*  
The margin object following the [margin convention](http://bl.ocks.org/mbostock/3019563) of Mike Bostock.
	  - **margin.top** : *( `Number` default = `20` )*  
	Top margin.
	  - **margin.bottom** : *( `Number` default = `10` )*  
	Bottom margin.
	  - **margin.left** : *( `Number` default = `40` )*  
	Left margin.
	  - **margin.right** : *( `Number` default = `20` )*  
	Right margin.
  - **spacing** : *( `Number` default = `3` )*  
The spacing between each bar
  - **barsColor** : *( `String` default = null )*  
The color of the bar. If set to `null` you can also use the selector `.bar` to fill the bars via CSS.
  - **ticks** : *( `String` default = `minutes` )*  
The timeing ticks to interpolate the x-axis
  - **timeFormat** : *( `String|Function` )*  
A timeformat based on the [D3 time format](https://github.com/mbostock/d3/wiki/Time-Formatting#wiki-format) or a function returning the format by using the `date` form the argument
  - **timeDomain** : *( `Array` )*  
An array of size `2` describing the start and end timespan. Values outsite the definition will not be displayed. If not defined the module is using maximum and minimum time of all availible data.

##Methods

### `.getData()`

Get's all calculated data within the chart

**Return**

*( Array )*: An array of all data elements

### `.add( element )`

add a bar to the chart
 
**Arguments**

* `element` *( Object )*: A new data object to add to the chart. 

### `.rem( ts )`

remove a single bar by it's timestamp
 
**Arguments**

* `ts` *( Number )*: Timestamp to remove. 

### `.reset( data )`

reset the whole data of the chart.
 
**Arguments**

* `data` : *( `Object[]` required )*: An Array of objects with the data. There has to be at least 2 keys per object. Default is `{ "ts": 1371114420000, "count": 50 }` width `ts` as timestamp and `count` as value to display

# IE Restrictions

D3 charts and some basic javascript will not work within IE 8 and lower.
So the constructor of every Staty module will return an Error object if a usage is not possible.

So for initialisation ou have to init like this:

```js
gauge = new Gauge( "#test", 50, { width: 750 } );
if( gauge instanceof Error ){
	// .. do something for IE8 and lower
}
```

# Changelogs

## 0.2.0

* added Timebars chart module

## 0.1.1

* added IE8 check and return an error if it's not possible to load a stats module

## 0.1.0

* Remamed Speedo to Gauge
* Added non require solution
* removed dependencie unserscore
* added concated and compressed result `tcscharts.js`

## Work in progress

`tcs-charts` is work in progress. Your ideas, suggestions etc. are very welcome.

# License 

(The MIT License)

Copyright (c) 2010 TCS &lt;dev (at) tcs.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.