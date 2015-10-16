// SID - SPINNER TYPE
// ================
// Show a spinner and a message when something is going on

"use strict";

import React from "react";
import { Motion, spring } from "react-motion";

import { ghost } from "../../../utility/motions";
import Throbber from "../../../components/Throbber";

const Spinner = ( props ) => (
  <Motion
    defaultStyle = { props.visible ? ghost.defaultIn : ghost.defaultOut }
    style = { props.visible ? ghost.in : ghost.out }
  >
    { ({ y, opacity }) =>
      <div
        style = {
          { transform: `translateY( ${ y }px )`
          , opacity
          , display: y === -100 ? "none" : ""
          }
        }
      >
        <Throbber size={ 60 } />
      </div>
    }
  </Motion>
);

Spinner.propTypes =
  { visible: React.PropTypes.bool.isRequired
  };

export default Spinner;
