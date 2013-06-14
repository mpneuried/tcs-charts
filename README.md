tcs-charts
==========

D3 Charting helpers

## Speedo

#### init

```js
Speedo = require( "tcs-charts" ).Speedo;

mySpeedo = new Speedo( "#example", 30, { width: 300 } );
```

First you have to require the "tcs-charts" and get the Speedo component.

**`new Speedo( targetSelector [, startValue ][, options ] )`**

**Arguments**

- **targetSelector** : *( `String` required )*  
A simple CSS selector where the speedo should be placed
- **startValue** : *( `Number` optional: default = `0` )*  
A value between `0` - `100` to define the start value
- **options** : *( `Object` optional )*  
Configuration object
  - **width** : *( `Number` default = `500` )*  
The with of the speedo
  - **margin** : *( `Number` default = `0` )*  
The margins arround the speedo. Needed for a -90° -> 90° to not cut off the half of the needle at the edges.

**Getter/Setter**

- **mySpeedo.value** : *( `Number` )*  
The new value of the speedo
- **mySpeedo.width** : *( `Number` )*  
The with of the speedo
- **mySpeedo.margin** : *( `Number` )*  
The margins arround the speedo.