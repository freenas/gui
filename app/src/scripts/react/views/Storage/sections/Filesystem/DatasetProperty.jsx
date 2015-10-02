// DATASET PROPERTY
// ==================
// Display properties of the dataset in a similar format

"use strict";

import React from "react";

export default class DatasetProperty extends React.Component {
  render () {
    return (
      <div className="dataset-property">
        <span className="property-legend">{ this.props.legend }</span>
        <span className="property-content">{ this.props.children }</span>
      </div>
    );
  }
}

DatasetProperty.propTypes =
  { legend  : React.PropTypes.string.isRequired
  };
