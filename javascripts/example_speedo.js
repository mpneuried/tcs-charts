Gauge = require( "tcs-charts" ).Gauge;
gauge = new Gauge( "#gauge-example", 30, { width: 300, margin: 20 } );


gui = new dat.GUI({ autoPlace: false });
$( "#gauge-example" ).append( gui.domElement );
//gui.closed = true





var intervall = new ( function(){
  var running = false;
  var timeout = null;

  var fnIntervall = function(){
    if( running ){
      gauge._set(  Math.random() )
      timeout = setTimeout( fnIntervall, 1500 );
      return
    }
  }

  this[ 'toggle_intervall' ] = function(){
    clearTimeout( timeout )
    if( running && timeout != undefined ){
      running = false;
    }else{
      running = true;
      fnIntervall();
    }
  }
});

gui.add( intervall, 'toggle_intervall' ); 

gui.add( gauge, 'value', 0, 100).listen(); 

gui.add( gauge, 'animationDuration', 100, 1000);

f2 = gui.addFolder('Metrics') 
f2.add( gauge, 'width', 30, 590); 
f2.add( gauge, 'margin', 0, 50); 
f2.add( gauge, 'thicknessFactor', .35, 2);
f2.add( gauge, 'needleLengthFactor', .35, 2); 
f2.add( gauge, 'startAngle', -90, 90);
f2.add( gauge, 'endAngle', -90, 90); 

f3 = gui.addFolder('Colors') 
f3.addColor( gauge, 'bgColor');
f3.addColor( gauge, 'startColor');
f3.addColor( gauge, 'endColor'); 
f3.addColor( gauge, 'needleColor'); 

intervall.toggle_intervall()