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
    , placeholder: React.PropTypes.oneOf( [ "ghost", "block" ] )
    }

  , getInitialState () {
      return (
        { dragging: false
        , initPos: [ 0, 0 ]
        , deltaPos: [ 0, 0 ]
        }
      );
    }

  , getDefaultProps () {
      return (
        { placeholder: "ghost"
        }
      );
    }

  , handleMouseDown ( event ) {
      EventBus.emit( "dragStart"
                   , this.props.namespace
                   , this.props.payload
                   , this.props.callback
                   );
      window.addEventListener( "mouseup", this.handleDragEnd );
      window.addEventListener( "mousemove", this.handleDragMove );
    }

  , handleDragMove ( event ) {
      let newState = {};

      if ( !this.state.dragging ) {
        newState.initPos = [ event.clientX, event.clientY ];
        newState.dragging = true;
      }

      newState.deltaPos = [ event.clientX, event.clientY ];

      this.setState( newState );
    }

  , handleDragEnd () {
      window.removeEventListener( "mouseup", this.handleDragEnd );
      window.removeEventListener( "mousemove", this.handleDragMove );
      EventBus.emit( "dragStop" );

      if ( this.isMounted() ) {
        // Certain async callbacks will cause the DragTarget to unmount, such as
        // a UX where it moves from one "bucket" to another. We use .isMounted()
        // to guard against trying to reset state on a now-unmounted component.
        this.setState(
          { initPos: [ 0, 0 ]
          , deltaPos: [ 0, 0 ]
          , dragging: false
          }
        );
      }
    }

  , render () {
      let style = {};
      let placeholder = null;

      if ( this.state.dragging ) {
        style.position = "absolute";
        style.left = this.state.deltaPos[0] - this.state.initPos[0];
        style.top = this.state.deltaPos[1] - this.state.initPos[1];

        switch ( this.props.placeholder ) {
          case "ghost":
            // Render the DragTarget's children again, in the original position,
            // with a lower opacity.
            placeholder = (
              <span className="drag-placeholder drag-ghost">
                { this.props.children }
              </span>
            );
            break;

          case "block":
            let content = this.refs.dragTarget.getDOMNode();

            placeholder = (
              <span
                className="drag-placeholder drag-block"
                style = {
                  { height: content.offsetHeight
                  , width: content.offsetWidth
                  }
                }
              />
            );
            break;
        }
      }

      return (
        <span
          onMouseDown = { this.handleMouseDown }
          ref = "dragTarget"
          className = "drag-target"
        >
          <span
            className = "drag-content"
            style = { style }
          >
            { this.props.children }
          </span>
          { placeholder }
        </span>
      );
    }
  }
);

export default DragTarget;
