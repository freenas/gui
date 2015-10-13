// TOPOLOGIZER TOOL
// ================
// Reconfigures pool topology according to the position of controls, splitting
// between performance, data security, and capacity.

"use strict";

import _ from "lodash";
import React from "react";

import ZfsUtil from "../utility/ZfsUtil";
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
      let rect = this.refs.bounding.getBoundingClientRect();

      let A = [ 0, rect.height ];
      let B = [ rect.width / 2, 0 ];
      let C = [ rect.width, rect.height ];

      this.setState(
        { bounding: rect
        , trianglePoints: [ A, B, C ]
        }
      );
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
        let preferences = ZfsUtil.calculatePreferences
                                 .apply( null, coordinates );

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
