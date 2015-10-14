// ITEM ICON
// =========
// Displays an icon based on a provided image, or falls back to a color and
// initials based on an input string.

"use strict";

import React from "react";

import Icon from "../Icon";
import viewerUtil from "../Viewer/viewerUtil";

const ItemIcon = React.createClass(
  { propTypes:
      { image: React.PropTypes.string
      , icon: React.PropTypes.string
      , size: React.PropTypes.number
      , fontSize: React.PropTypes.number
      , primaryString: React.PropTypes.any
      , fallbackString: React.PropTypes.any.isRequired
      , seedNumber: React.PropTypes.oneOfType(
        [ React.PropTypes.number
        , React.PropTypes.string
        ]
      )
    }

  , getInitials () {
      let initials = "";

      if ( this.props.primaryString ) {
        initials = this.props.primaryString.toString()
                     .trim()
                     .split( " " )
                     .map( function ( word ) { return word[0]; } );
      } else {
        initials = this.props.fallbackString;
      }

      return ( initials[0]
             + ( initials.length > 1
               ? initials[ initials.length - 1 ]
               : ""
               )
             ).toUpperCase();
    }

  , getIconColor () {
      let rgbColor;

      if ( typeof this.props.seedNumber === "number" ) {
        rgbColor = viewerUtil.getPastelColor( this.props.seedNumber );
      } else {
        let seed = ( this.props.primaryString
                   || this.props.fallbackString
                   ).length;

        rgbColor = viewerUtil.getPastelColor( seed * 100 * Math.E );
      }

      return "rgb(" + rgbColor.join( "," ) + ")";
    }

  , render () {
      let styleProps = null;
      let iconContent = null;

      if ( this.props.image ) {
        iconContent = (
          <img
            className = "image-icon"
            src = { "data:image/jpg;base64," + this.props.image }
          />
        );
      } else if ( this.props.icon ) {
        // Use a Font Icon, but only if there isn't a specific image specified.
        styleProps = { background: this.getIconColor() };
        iconContent = (
          <span className = "font-icon">
            <Icon glyph = { this.props.icon } />
          </span>
        );
      } else {
        styleProps = { background: this.getIconColor() };
        iconContent = (
          <span className = "initials-icon">
            { this.getInitials() }
          </span>
        );
      }

      return (
        <div
          className = "item-graphic"
          style = { styleProps }
        >
          { iconContent }
        </div>
      );
    }
  }
);

export default ItemIcon;
