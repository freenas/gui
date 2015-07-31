// DROP TARGET
// ===========
// Wrapper element providing a counterpart to DragTarget. Registers with the
// same namespace and verifies the event's receipt.

"use strict";

import React from "react";

import EventBus from "../../utility/EventBus";

const INITIAL_STATE =
  { droppable: false
  , dragCallback: null
  , payload: null
  };

const DropTarget = React.createClass(
  { propTypes:
    { namespace: React.PropTypes.string.isRequired
    , callback: React.PropTypes.func
    , disabled: React.PropTypes.bool
    }

  , getDefaultProps () {
      return { disabled: false };
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
        this.setState(
          { droppable: true
          , dragCallback: callback
          , payload: payload
          }
        );
      }
    }

  , handleDragStop () {
      this.setState( INITIAL_STATE );
    }

  , handleMouseUp ( event ) {
      if ( this.state.droppable ) {
        EventBus.emit( "dropSuccess" );
        if ( this.state.dragCallback ) {
          this.state.dragCallback();
        }
        if ( this.props.callback ) {
          this.props.callback( this.state.payload );
        }
      }
    }

  , render () {
      return (
        <span
          onMouseUp = { this.handleMouseUp }
          className = "dropt-target"
        >
          { this.props.children }
        </span>
      );
    }
  }
);

export default DropTarget;
