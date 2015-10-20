// VIEWER MODAL MIXIN
// ==================
// Mixin for displaying the modal overlay in certain Viewer modes

"use strict";

const ViewerModal =
  { componentDidMount: function () {
      window.addEventListener( "keyup", this.handleEscClose );
    }

  , componentWillUnmount: function () {
      window.removeEventListener( "keyup", this.handleEscClose );
    }

  , handleEscClose: function ( event ) {
      if ( event.which === 27 && this.dynamicPathIsActive() ) {
        event.preventDefault();
        event.stopPropagation();
        let newPath =
          this.context.location.pathname.replace( "/" + this.props.params[ this.props.routeParam ], "" );
        this.history.pushState( null, newPath );
      }
    }

  , handleClickOut: function ( event, componentID ) {
      if ( event.dispatchMarker === componentID ) {
        let newPath =
          this.context.location.pathname.replace( "/" + this.props.params[ this.props.routeParam ], "" );
        this.history.pushState( null, newPath );
      }
    }
  };

export default ViewerModal;
