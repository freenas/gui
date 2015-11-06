// NOTIFICATION
// ============

import moment from "moment";
import React from "react";

const Notification = ( props ) => {
  console.log( props );
  return (
    <div className="notification">
      <span className="text">{ props.text }</span>
      <span className="timestamp">{ props.clientTimestamp.fromNow() }</span>
    </div>
  );
}

Notification.propTypes =
  { text: React.PropTypes.string
  , clientTimestamp: ( props, propName, componentName ) => {
      if ( !moment.isMoment( props[ propName ] ) ) {
        return new Error( `Expected "clientTimestamp" to be an instance of moment` )
      }
    }
  };

export default Notification;
