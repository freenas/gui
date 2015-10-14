// DATASET PROPERTY
// ==================
// Display properties of the dataset in a similar format

"use strict";

import React from "react";

export default class DatasetProperty extends React.Component {
  render () {
    const { legend, children, className, ...other } = this.props;

    return (
      <div className={ "dataset-property " + className }>
        <span className="property-legend">{ this.props.legend }</span>
        <span className="property-content">{ this.props.children }</span>
      </div>
    );
  }
}

DatasetProperty.propTypes =
  { legend  : React.PropTypes.string
  };

DatasetProperty.defaultProps =
  { legend    : ""
  , className : ""
  };