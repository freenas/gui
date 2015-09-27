// PRETTY PRINT HELPERS
// ====================

"use strict";

var chalk = require( "chalk" );
var gutil = require( "gulp-util" );

function textColor ( bgColor ) {
  switch ( bgColor ) {
    case "bgRed":
    case "bgCyan":
    case "bgWhite":
    case "bgGreen":
    case "bgYellow":
      return "black";

    default:
      return "white";
  }
}

module.exports =
  { hostname: function ( hostname, status ) {
      var whitespace = "  ";
      var yAxis = "//";
      var xAxis;

      var hostAddress = whitespace + hostname + whitespace;
      var failMessage = whitespace + "Server did not start!" + whitespace;


      function repChar ( character, times ) {
        return new Array( times + 1 ).join( character );
      }

      if ( status === "up" ) {
        xAxis = repChar( "/", hostAddress.length + ( yAxis.length * 2 ) );

        gutil.log( chalk.bgGreen( xAxis ) );
        gutil.log( chalk.bgGreen( yAxis )
                 + hostAddress
                 + chalk.bgGreen( yAxis )
                 );
        gutil.log( chalk.bgGreen( xAxis ) );
      } else {
        xAxis = repChar( "/", failMessage.length + ( yAxis.length * 2 ) );

        gutil.log( chalk.bgRed( xAxis ) );
        gutil.log( chalk.bgRed( yAxis ) + failMessage +
                           chalk.bgRed( yAxis ) );
        gutil.log( chalk.bgRed( xAxis ) );
      }
    }
  , tag: function ( bgColor, tag, message ) {
      gutil.log( chalk[ bgColor ][ textColor( bgColor ) ]( "  " + tag + "  " )
              + " "
               + message
               );
    }
  };
