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
        , selected: false
        , preventClickout: false
        , dragOffset: [ 0, 0 ]
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

  , componentDidUpdate ( prevProps, prevState ) {
      if ( prevState.selected !== this.state.selected ) {
        if ( this.state.selected ) {
        }
      }
    }

  , handleMouseDown ( event ) {
      let elementRect = event.target.getBoundingClientRect();

      document.body.classList.add( "no-select" );
      EventBus.emit( "dragStart"
                   , this.props.namespace
                   , this.props.payload
                   , this.props.callback
                   );
      window.addEventListener( "mouseup", this.handleDragEnd );
      window.addEventListener( "mousemove", this.handleDragMove );

      this.setState(
        { dragOffset: [ elementRect.left - event.clientX
                      , elementRect.top - event.clientY
                      ]
        }
      );
    }

  , handleDragMove ( event ) {
      let newState = {};

      if ( !this.state.dragging ) {
        newState.dragging = true;
      }

      newState.deltaPos = [ event.clientX, event.clientY ];

      this.setState( newState );
    }

  , handleDragEnd () {
      document.body.classList.remove( "no-select" );
      window.removeEventListener( "mouseup", this.handleDragEnd );
      window.removeEventListener( "mousemove", this.handleDragMove );
      EventBus.emit( "dragStop" );

      if ( this.isMounted() ) {
        // Certain async callbacks will cause the DragTarget to unmount, such as
        // a UX where it moves from one "bucket" to another. We use .isMounted()
        // to guard against trying to reset state on a now-unmounted component.
        this.setState(
          { dragOffset: [ 0, 0 ]
          , deltaPos: [ 0, 0 ]
          , dragging: false
          }
        );
      }
    }

  , handleClickout ( event ) {
    if ( this.state.preventClickout ) {
      // This check prevents the initial selection event from triggering the
      // clickout handler. Considered a workaround.
      this.setState(
        { preventClickout: false
        }
      );
    } else {
      window.removeEventListener( "click", this.handleClickout );
      this.setState(
        { selected: false
        }
      );
    }
  }

  , handleClick ( event ) {
      let newState = {};

      if ( event.shiftKey || event.metaKey || event.altKey || event.ctrlKey ) {
        // Allows the selection and de-selection of this target in conjuntion
        // with anything which may already be selected. We don't need to prevent
        // the clickout in this case because the event will not propagate.
        event.stopPropagation();
        newState.preventClickout = false;
      } else {
        newState.preventClickout = !this.state.selected;
      }

      if ( !this.state.selected ) {
        window.addEventListener( "click", this.handleClickout );
      }

      newState.selected = !this.state.selected;

      this.setState( newState );
    }

  , render () {
      let style = {};
      let placeholder = null;
      let contentClass = [ "drag-content" ];

      if ( this.state.dragging ) {
        style.position = "fixed";
        style.left = this.state.deltaPos[0] + this.state.dragOffset[0];
        style.top = this.state.deltaPos[1] + this.state.dragOffset[1];

        contentClass.push( "dragging" );

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
            // Render a low-opacity box where the content would have been. This
            // may be a good option when the content would be expensive to
            // render multiple times.
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
      } else if ( this.state.selected ) {
        contentClass.push( "selected" );
      }

      return (
        <span
          onMouseDown = { this.handleMouseDown }
          onClick = { this.handleClick }
          ref = "dragTarget"
          className = "drag-target"
        >
          <span
            className = { contentClass.join( " " ) }
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
