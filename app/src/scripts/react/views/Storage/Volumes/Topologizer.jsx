// TOPOLOGIZER TOOL
// ================
// Reconfigures pool topology according to the position of controls, splitting
// between performance, data security, and capacity.

"use strict";

import _ from "lodash";
import React from "react";

import Coords from "../../../../utility/Coords";

const Topologizer = React.createClass(
  { propTypes:
      { handleTopoRequest: React.PropTypes.func.isRequired
      }

  , getInitialState () {
    return { topoPrefs: [ 0.33, 0.34, 0.33 ]
           , active: false
           , bounding: null
           , cursorPos: [ "50%", "60%" ]
           , trianglePoints: []
           };
  }

  , componentWillMount () {
      this.debouncedTopoChange = _.throttle( this.props.handleTopoRequest
                                           , 300
                                           );
    }

  , componentDidMount () {
      let rect = React.findDOMNode( this.refs.bounding )
                      .getBoundingClientRect();

      let A = [ 0, rect.height ];
      let B = [ rect.width / 2, 0 ];
      let C = [ rect.width, rect.height ];

      this.setState(
        { bounding: rect
        , trianglePoints: [ A, B, C ]
        }
      );
    }

  , calculatePreferences ( safety, speed, storage ) {
      //                    1         2/3        1/3         0
      //            Safety  |--raidz2--|--raidz1--|--Mirror--|
      //            Speed   |--Mirror--|--raidz1--|--raidz2--|
      //            Storage |--raidz1--|--raidz2--|--Mirror--|
      //
      // A visual representation of the mapping used to calculate topology
      // preferences. It is, essentially, a weighted voting system where a value
      // within the bounds of a given range will count as a vote for that layout
      // multiplied by the scalar. This gives an even distribution to the total
      // area of each topology in terms of area, but biases based on the
      // provided Barycentric Coordinates.

      const layouts = [ [ "raidz2", "raidz1", "mirror" ]
                      , [ "mirror", "raidz1", "raidz1" ]
                      , [ "raidz1", "raidz1", "raidz1" ]
                      ];

      let preferences = { highest: 0
                        , priority: null
                        , desired: null
                        };
      let votes = { mirror: 0
                  , raidz1: 0
                  , raidz2: 0
                  };

      function addVotes ( scalar, index ) {
        let victor;

        if ( scalar < 0.33 ) {
          victor = layouts[ index ][2];
        } else if ( scalar < 0.66 ) {
          victor = layouts[ index ][1];
        } else {
          victor = layouts[ index ][0];
        }

        if ( scalar > preferences.highest ) {
          preferences.highest = scalar;
          preferences.priority = [ "safety", "speed", "storage" ][ index ];
        }

        votes[ victor ] += scalar;
      }

      [ safety, speed, storage ].forEach( addVotes );

      preferences.desired = Object.keys( votes )
                                  .sort( ( a, b ) => votes[b] - votes[a] );

      return preferences;
    }

  , handleCursorActive ( event ) {
      this.setState(
        { active: true
        }
      );
    }

  , handleCursorMove ( event ) {
      if ( this.state.active ) {
        let cursorPos = [ event.clientX - this.state.bounding.left
                        , event.clientY - this.state.bounding.top
                        ];

        let [ A, B, C ] = this.state.trianglePoints;
        let coordinates = Coords.cartToBary( A, B, C, cursorPos );
        let preferences = this.calculatePreferences.apply( null, coordinates );

        this.debouncedTopoChange( preferences );

        this.setState(
          { cursorPos: cursorPos
          , preferences: preferences
          }
        );
      }

    }

  , handleEndActive ( event ) {
      this.setState(
        { active: false
        }
      );
    }

  , render () {
      return (
        <div
          className = "topologizer"
          onMouseUp = { this.handleEndActive }
        >
          <span className = "topologizer-label-health">
            {"Safety"}
          </span>
          <span className = "topologizer-label-speed">
            {"Speed"}
          </span>
          <span className = "topologizer-label-size">
            {"Storage"}
          </span>
          <div
            ref = "bounding"
            className = "topologizer-bounding"
            onMouseMove = { this.handleCursorMove }
          >
            <div
              className = "topologizer-handle"
              style = {{ top: this.state.cursorPos[1], left: this.state.cursorPos[0] }}
              onMouseDown = { this.handleCursorActive }
            />
          </div>
          <div className = "toppologizer-wrap">
            <span className = "toppologizer-triangle-wrap">
              <span className = "topologizer-triangle">
                <span className = "topologizer-health" />
                <span className = "topologizer-speed" />
                <span className = "topologizer-size" />
              </span>
            </span>
          </div>
        </div>
      );
    }

  }
);

export default Topologizer;
