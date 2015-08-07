// DROP TARGET
// ===========
// Wrapper element providing a counterpart to DragTarget. Registers with the
// same namespace and verifies the event's receipt.

"use strict";

import React from "react";

import EventBus from "../../utility/EventBus";

const INITIAL_STATE =
  { droppable: false
  , disalowDrop: false
  , dragCallback: null
  , payload: null
  };

const DropTarget = React.createClass(
  { propTypes:
    { namespace: React.PropTypes.string.isRequired
    , callback: React.PropTypes.func
    , disabled: React.PropTypes.bool
    , activeDrop: React.PropTypes.oneOfType(
        [ React.PropTypes.string
        , React.PropTypes.bool
        ]
      )
    , preventDrop: React.PropTypes.func
    }

  , getDefaultProps () {
      return (
        { disabled: false
        , preventSameOrigin: true
        }
      );
    }

  , getInitialState () {
      return INITIAL_STATE;
    }

  , componentWillMount () {
      EventBus.on( "dragStart", this.handleDragStart );
      EventBus.on( "dragStop", this.handleDragStop );
    }

  , componentWillUnmount () {
      EventBus.removeListener( "dragStart", this.handleDragStart );
      EventBus.removeListener( "dragStop", this.handleDragStop );
    }

  , handleDragStart ( namespace, payload, callback ) {
      if ( this.props.namespace === namespace ) {
        let newState = {};

        if ( this.props.preventDrop ) {
          newState.disalowDrop = this.props.preventDrop( payload );
        }

        newState.droppable = true;
        newState.dragCallback = callback;
        newState.payload = payload;

        this.setState( newState );
      }
    }

  , handleDragStop () {
      this.setState( INITIAL_STATE );
    }

  , handleMouseUp ( event ) {
      if ( this.state.droppable && this.state.disalowDrop === false ) {
        EventBus.emit( "dropSuccess" );
        if ( this.state.dragCallback ) {
          this.state.dragCallback();
        }
        if ( this.props.callback ) {
          this.props.callback( this.state.payload );
        }
      }
      this.setState({ disalowDrop: INITIAL_STATE.disalowDrop });
    }

  , handleMouseDown ( event ) {
      // We use this handler to catch drag events that originated in this
      // container and prevent them. This avoids problems where state will
      // be recalculated based on the "removal" and "addition" of an item
      // to and from a collection it was already a member of.

      if ( this.props.preventSameOrigin ) {
        this.setState({ disalowDrop: true });
      }
    }

  , render () {
      let classes = [ "drop-target" ];
      let dropzone = null;
      let dropCatch = null;

      if ( this.state.droppable && this.state.disalowDrop === false ) {
        classes.push( "droppable" );

        if ( this.props.activeDrop ) {
          dropzone = (
            <span className="drop-zone">
              { typeof this.props.activeDrop === "string"
              ? this.props.activeDrop
              : ""
              }
            </span>
          );

          dropCatch = (
            <span className = "drop-catcher" />
          );
        }
      }

      return (
        <span
          onMouseUp = { this.handleMouseUp }
          onMouseDown = { this.handleMouseDown }
          className = { classes.join( " " ) }
        >
          { this.props.children }
          { dropzone }
          { dropCatch }
        </span>
      );
    }
  }
);

export default DropTarget;
