// INVERTED LINE CHART
// ===================
// NEEDS A LOT OF WORK

"use strict";

var Chart;
var loaded;

if ( typeof window !== "undefined" ) {
  Chart = require( "chart.js" );
  loaded = true;
} else {
  Chart = function () {
    return Promise().resolve( true );
  };
}


if ( loaded ) {
  Chart.types.Line.extend(
    { name: "LineInverted"
    , draw ( ease ) {
        Chart.types.Line.prototype.draw.apply( this, arguments );
        if ( this.scale.yLabels && this.scale.yLabels.length ) {
          for ( var i = 0; i < this.scale.yLabels.length; i++ ) {
            if ( this.scale.yLabels[i] < 0 ) {
              this.scale.yLabels[i] = parseInt( this.scale.yLabels[i] ) * -1;
            }
          }
        }
      }
    }
  );
}
