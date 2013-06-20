dataA = [
  { "ts": 1371114780000, "count": 10 },
  { "ts": 1371114720000, "count": 20 },
  { "ts": 1371114660000, "count": 30 },
  { "ts": 1371114540000, "count": 35 },
  { "ts": 1371114480000, "count": 38 },
  { "ts": 1371114420000, "count": 32 },
  { "ts": 1371114360000, "count": 25 },
  { "ts": 1371114300000, "count": 12 }
];
    
dataB = [
  { "ts": 1371114780000, "count": 150 },
  { "ts": 1371114720000, "count": 120 },
  { "ts": 1371114660000, "count": 80 },
  { "ts": 1371114600000, "count": 30 },
  { "ts": 1371114480000, "count": 20 },
  { "ts": 1371114420000, "count": 40 }
];
    
    // Initialize with data set A
TimeBars = require( "tcs-charts" ).TimeBars;
myTimeBar = new TimeBars( "#timebars-example", JSON.parse( JSON.stringify( dataA ) ), { width: 508, height: 200 } ) 

var intervall = function(){

  // Change data to set B
  myTimeBar.reset( JSON.parse( JSON.stringify( dataB ) ) )

  // add a single bar
  setTimeout( function(){ myTimeBar.add( { "ts": 1371114360000, "count": 60 } ) }, 3000 )

  // remove a single bar
  setTimeout( function(){ myTimeBar.rem( 1371114780000 ) }, 4000 )

  setTimeout( function(){ myTimeBar.reset( JSON.parse( JSON.stringify( dataA ) ) ) }, 6000 )

  setTimeout( intervall, 8000 );
}
setTimeout( intervall, 2000 );