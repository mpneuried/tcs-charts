Speedo = require( "tcs-charts" ).Speedo;
speedo = new Speedo( "#speedo-example", 30, { width: 300, margin: 20 } );


gui = new dat.GUI({ autoPlace: false });
$( "#speedo-example" ).append( gui.domElement );
//gui.closed = true





var intervall = new ( function(){
  var running = false;
  var timeout = null;

  var fnIntervall = function(){
    if( running ){
      speedo._set(  Math.random() )
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

gui.add( speedo, 'value', 0, 100).listen(); 

gui.add( speedo, 'animationDuration', 100, 1000);

f2 = gui.addFolder('Metrics') 
f2.add( speedo, 'width', 30, 590); 
f2.add( speedo, 'margin', 0, 50); 
f2.add( speedo, 'thicknessFactor', .35, 2);
f2.add( speedo, 'needleLengthFactor', .35, 2); 
f2.add( speedo, 'startAngle', -90, 90);
f2.add( speedo, 'endAngle', -90, 90); 

f3 = gui.addFolder('Colors') 
f3.addColor( speedo, 'bgColor');
f3.addColor( speedo, 'startColor');
f3.addColor( speedo, 'endColor'); 
f3.addColor( speedo, 'needleColor'); 

intervall.toggle_intervall()