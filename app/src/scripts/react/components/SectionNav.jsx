// SECTION NAV
// ================
// Component for managing multiple views side by side

"use strict";

import React from "react";
import { Grid, Row, ButtonGroup } from "react-bootstrap";

import { Link } from "react-router";

const SectionNav = React.createClass(

  { propTypes:
    { views: React.PropTypes.array
    , disabled: React.PropTypes.bool
    , bsSize: React.PropTypes.oneOf(
        [ "xsmall", "small", "medium", "large", "xs", "sm", "md", "lg" ]
      )
    , bsStyle: React.PropTypes.oneOf(
        [ "primary", "info", "danger", "warning", "success" ]
      )
    }

  , getDefaultProps: function() {
      return (
        { bsSize: "large"
        , bsStyle: "primary"
        }
      );
    }

  , createNavItems ( item, index ) {
      let navItem;

      if ( item.disabled || !item.route ) {
        navItem =
          <a
            key = { index }
            className = "btn btn-default disabled"
            role = "button"
            href = "#">
            { item.display }
          </a>;
      } else {
        navItem =
          <Link
            to = { item.route }
            key = { index }
            className = "btn btn-default"
            activeClassName = "active btn-info"
            role = "button"
            type = "button">
            { item.display }
          </Link>;
      }

      return navItem;
    }

  , render () {
      const viewNum = this.props.views.length;
      let btnGroupClasses = [ "btn-group-radio"
                            , "btn-group-radio-" + this.props.bsStyle
                            ];

      if ( viewNum > 1 ) {
        return (
          <div className="section-nav">
            <ButtonGroup
              bsSize = { this.props.bsSize }
              className = { btnGroupClasses.join( " " ) }
            >
              { this.props.views.map( this.createNavItems ) }
            </ButtonGroup>
          </div>
        );
      } else {
        console.warn( "A SectionNav is being called with "
                    + ( viewNum === 1
                      ? "only one view"
                      : "no views"
                      )
        );
        return null;
      }
    }
  }

);

export default SectionNav;
