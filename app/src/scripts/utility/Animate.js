// ANIMATION
// =========
// Simple wrapper for Velocity.js (which doesn't love being run in isomorphic
// mode). Provides reusable and tweakable animation presets to simplify UI
// appearance and behavior.

"use strict";

const DEFAULT_OPTS =
  { easing   : "quadOut"
  , duration : 300
  , delay    : 0
  };

const VERTICAL_VALUES =
  { height: ""
  , marginTop: ""
  , marginBottom: ""
  , paddingTop: ""
  , paddingBottom: ""
  };

var Velocity;

if ( process.env.BROWSER ) {
  Velocity = require( "velocity-animate" );
} else {
  // Mock Velocity references on the server
  Velocity = () => {
    return Promise().resolve( true );
  };
}

export class Animate {

  // IN : Element fades out completely while moving slightly up from its origin
  // OUT: Element fades in while sliding up from below its origin
  static ghostVertical ( element, direction, options ) {
    // Conditions for early return so that we can use this lazily in React
    if ( direction === "in" && element.style.display !== "none" ) {
      return;
    } else if ( direction === "out" && element.style.display === "none" ) {
      return;
    }

    let opts = Object.assign( {}, DEFAULT_OPTS, options );
    let cachedStyles = {};
    let computedValues = {};

    // Compare direction to expected outcome display for early return. Yes, it's
    // a DOM check, but it saves us from doing all of the other assignment and
    // the eventual Velocity call.
    if ( direction === "in" ) {
      opts.display = Velocity.CSS.Values.getDisplayType( element ) === "inline"
                   ? "inline-block"
                   : "block";
      computedValues.opacity = [1,0]
      computedValues.translateY = [0, 40];
      afterStyles.display = "";
    } else {
      opts.display = "none";
      computedValues.opacity = 0
      computedValues.translateY = -40;
    }

    opts.begin = () => {
      // Cache the initial values of any property which can contribute to the
      // vertical space occupied by an element
      for ( let property in VERTICAL_VALUES ) {
        // Use Velocity's "forcefeeding" to animate all vertical properties
        // according to their calculated values. Animating in will cause values
        // to rise from 0 to their computed stop; opposite for animating out.
        let propertyValue = Velocity.CSS.getPropertyValue( element, property );

        cachedStyles[ property ] = element.style[ property ];
        computedValues[ property ] = direction === "in"
                                   ? [ propertyValue, 0 ]
                                   : [ 0, propertyValue ];
      }

      // To achieve the ghost effect, we need the element's overflow to be
      // visible, so it doesn't just look like a normal slide effect
      cachedStyles.overflow = element.style.overflow;
      element.style.overflow = "visible";
    }

    opts.complete = () => {
      // Restore all inline styles to their prior (cached) values
      for ( let property in cachedStyles ) {
        element.style[ property ] = cachedStyles[ property ];
      }
    }

    Velocity( element, computedValues, opts );
  }
}

export { Velocity };
