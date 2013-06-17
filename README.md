tcs-charts
==========

D3 Charting helpers

## Speedo

#### Example

```
<html>
	<head>
		<script src="build.js"></script>
	</head>
	<body>
		<div id="example"></div>
	</body>
	<script>
		Speedo = require( "tcs-charts" ).Speedo;
		mySpeedo = new Speedo()
		setIntervall( function(){
			mySpeedo.value = Math.Math.random() * 100
		}, 1000 );		
	</script>
</html>
```

This will init the default speedo and set a random value between 0 - 100 every second.


#### init

```
Speedo = require( "tcs-charts" ).Speedo;

mySpeedo = new Speedo( "#example", 30, { width: 300 } );
```

First you have to require the "tcs-charts" and get the Speedo component.

**`new Speedo( targetSelector [, startValue ][, options ] )`**

#####Arguments

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

#####Getter/Setter

- **mySpeedo.value** : *( `Number` )*  
The new value of the speedo
- **mySpeedo.width** : *( `Number` )*  
The with of the speedo
- **mySpeedo.margin** : *( `Number` )*  
The margins arround the speedo.
- **ySpeedo.startAngle** : *( `Number` default = `-75` )*  
The left starting Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
- **ySpeedo.endAngle** : *( `Number` default = `75` )*  
The right end Angel. The north point is `0°` so it's usually a negative number. Possible are angles between `-90°` to `90°` 
- **ySpeedo.thicknessFactor** : *( `Float` default = `0.8` )*  
A factor to change the thickness of the angle display.
- **ySpeedo.needleLengthFactor** : *( `Float` default = `thicknessFactor` )*  
A factor to change the length of the needle. If set to `0` no neelde will be hidden. 
- **ySpeedo.bgColor** : *( `String` default = `#ddd` )*  
The color of the background.
- **ySpeedo.needleColor** : *( `String` default = `#333` )*  
The color of the needle. 
- **ySpeedo.startColor** : *( `String` default = `#B4EB57` )*  
The starting color witch references the value `0`
- **ySpeedo.endColor** : *( `String` default = `#D10000` )*  
The ending color witch references the value `100`
- **ySpeedo.fixedColor** : *( `String` default = `null` )*  
A fixed Color. This will overwrite the `startColor` and `endColor` and displays a solid color through the whole vaule range.
- **ySpeedo.animationDuration** : *( `Number` default = 500 )*  
The duration of the animation in `ms`

## IE Restrictions

D3 charts and some basic javascript will not work within IE 8 and lower.
So the constructor of every Staty module will return an Error object if a usage is not possible.

So for initialisation ou have to init like this:

```js
gauge = new Gauge( "#test", 50, { width: 750 } );
if( gauge instanceof Error ){
	// .. do something for IE8 and lower
}
```

## Changelogs

### 0.1.1

- added IE8 check and return an error if it's not possible to load a stats module

### 0.1.0

* Remamed Speedo to Gauge
* Added non require solution
* removed dependencie unserscore
* added concated and compressed result `tcscharts.js`

### Work in progress

`tcs-charts` is work in progress. Your ideas, suggestions etc. are very welcome.

## License 

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