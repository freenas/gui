// DRAG TARGET
// ===========
// Wrapper element providing a global event hook for dragging and dropping React
// components. This wrapper does not require components to have a parent-child
// relationship, and will require event handlers in the source and target to
// properly recognize the "movement".

"use strict";

import React from "react";

import EventBus from "../../utility/EventBus";

const DragTarget = React.createClass(
  { propTypes:
    { namespace: React.PropTypes.string.isRequired
    , payload: React.PropTypes.any.isRequired
    , callback: React.PropTypes.func
    }

  , getInitialState () {
      return { dragging: false };
    }

  , handleMouseDown ( event ) {
      EventBus.emit( "dragStart"
                   , this.props.namespace
                   , this.props.payload
                   , this.props.callback
                   );
      window.addEventListener( "mouseup", this.handleDragEnd );
    }

  , handleDragEnd () {
      window.removeEventListener( "mouseup", this.handleDragEnd );
      EventBus.emit( "dragStop" );
    }

  , render () {
      return (
        <span
          onMouseDown = { this.handleMouseDown }
          className = "draggable"
        >
          { this.props.children }
        </span>
      );
    }
  }
);

export default DragTarget;
