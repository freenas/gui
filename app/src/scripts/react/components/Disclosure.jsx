// Disclosure Triangle
// ===================
// General purpose disclosure Triangles, they can be used to show/hide any
// data(paragraphs/lists/Twitter Bootstrap panels (TWBS.panel) ,etc)

"use strict";

import _ from "lodash";
import React from "react";

import Icon from "./Icon";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Disclosure.less" );

export default class Disclosure extends React.Component {

  constructor ( props ) {
    super( props );

    this.state =
      { expanded: this.props.defaultExpanded || this.props.expanded
      };
  }

  toggleExpanded () {
    this.setState({ expanded: !this.state.expanded });
  }

  render () {
    const { children, header, headerShow, headerHide, ...other } = this.props;
    let headerContent, iconGlyph, containerClass;

    if ( this.state.expanded ) {
      headerContent  = header || headerShow;
      iconGlyph      = "arrow-triangle-down";
      containerClass = "disc-show";
    } else {
      headerContent  = header || headerHide;
      iconGlyph      = "arrow-triangle-right";
      containerClass = "disc-hide";
    }

    return (
      <div
        { ...other }
        className = "disclosure-triangle"
      >
        <div
          className = "disc-title"
          onClick   = { this.toggleExpanded.bind( this ) }
        >
          <Icon glyph={ iconGlyph } />
          { headerContent }
        </div>

        <div className={ containerClass } >
          { children }
        </div>
      </div>
    );
  }

}

Disclosure.propTypes =
  { header          : React.PropTypes.node
  , headerShow      : React.PropTypes.node
  , headerHide      : React.PropTypes.node
  , defaultExpanded : React.PropTypes.bool
  };

Disclosure.defaultProps =
  { expanded        : false
  , defaultExpanded : false
  , header          : null
  , headerShow      : "Hide"
  , headerHide      : "Show"
  };
