// AFP Share Settings
// ==================

"use strict";

import React from "react";
import { Input } from "react-bootstrap";

export default class AFPShareSettings extends React.Component {

  constructor ( props ) {
    super( props );
    this.displayName = "AFP Share Settings";
  }

  assignValues () {
    const { updateDataset, activeShare } = this.props;
    let datasetParams = {};
    let shareParams = {};

    if ( updateDataset && updateDataset.params ) {
      datasetParams.name = updateDataset.params.name;
    }

    if ( activeShare ) {
      shareParams.exportName = activeShare.id;
    }

    return Object.assign(
      { name       : this.props.name
      , exportName : ""
      }
      , datasetParams
      , shareParams
    );
  }

  render () {
    const VALUES = this.assignValues();

    // Find a way to move this back to ShareSettings that doesn't make
    // the styles sad =<
    var nameField = null;
    if ( !this.props.newShare ) {
      nameField = (
        <Input
          type = "text"
          label = "Name"
          value = { VALUES.name.split( "/" ).pop() }
          onChange = { this.props.onDatasetNameChange }
          labelClassName = "col-xs-2"
          wrapperClassName = "col-xs-10"
        />
      );
    }

    return (
      <section className="form-section">
        <form className="form-horizontal">
          { nameField }
          {/*
          <Input
            disabled = { !activeShare }
            type = "text"
            label = "Export As"
            value = { VALUES.exportName }
            labelClassName = "col-xs-2"
            wrapperClassName = "col-xs-10"
          />
          */}
          <Input
            type = "checkbox"
            label = "Enable Share"
            checked = { this.props.enabled }
            wrapperClassName = "col-xs-offset-2 col-xs-10"
            onChange = { ( e ) =>
                         this.props.onUpdateShare( this.props.id
                                                 , { enabled: e.target.checked }
                                                 )
                       }
          />
          <Input
            type = "checkbox"
            label = "Time Machine"
            wrapperClassName = "col-xs-offset-2 col-xs-10"
            checked = { this.props.properties.time_machine }
            onChange = { ( e ) =>
              this.props.onUpdateShare( this.props.id
                                      , { properties:
                                          Object.assign ( this.props.properties
                                                        , { time_machine: e.target.checked }
                                                        )
                                        }
                                      ) }
          />
        </form>
      </section>
    );
  }
};

AFPShareSettings.propTypes =
  { properties: React.PropTypes.shape(
    { time_machine: React.PropTypes.bool }
  ).isRequired
  , name            : React.PropTypes.string.isRequired
  // , target          : React.PropTypes.string.isRequired
  // , filesystem_path : React.PropTypes.string
  , enabled         : React.PropTypes.bool
  , id              : React.PropTypes.string.isRequired
  // , dataset_path    : React.PropTypes.string

  , newShare      : React.PropTypes.bool
  , updateDataset : React.PropTypes.object

  // HANDLERS
  , onUpdateShare: React.PropTypes.func.isRequired
  , onRevertShare: React.PropTypes.func.isRequired
  , onSubmitShare: React.PropTypes.func.isRequired
  , onDatasetNameChange: React.PropTypes.func.isRequired
  };
