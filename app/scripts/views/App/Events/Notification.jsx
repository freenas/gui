// NOTIFICATION
// ============

import moment from "moment";
import React from "react";

import Icon from "../../../components/Icon";

const BASIS =
  { height   : 50
  , marginY  : 10
  };

const Notification = ( props ) => {
  const { height, opacity, translate } = props.style;
  let icon = null;

  if ( props.icon ) {
    icon =
      <Icon
        glyph = { props.icon }
        className = { "text-" + ( props.bsStyle || "primary" ) }
      />;
  }

  return (
    <div
      className = "notification-container"
      style = {
        { height       : `${ BASIS.height * height }px`
        , marginTop    : `${ BASIS.marginY * height }px`
        , marginBottom : `${ BASIS.marginY * height }px`
        }
      }
    >
      <div
        className = "notification-content"
        style = {
          { transform: `translateY( ${ translate * 100 }% )`
          , opacity
          }
        }
      >
        { icon }
        <span className="text">{ props.text }</span>
        <span className="timestamp">{ props.clientTimestamp.fromNow() }</span>
      </div>
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
