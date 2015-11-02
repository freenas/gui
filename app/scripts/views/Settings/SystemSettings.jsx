// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap";

import * as systemActions from "../../actions/system";

/*
import IM from "../../flux/middleware/InterfacesMiddleware";
*/

import Console from "./SystemSettings/Console";
import LocalizationSettings from "./SystemSettings/LocalizationSettings";
import OSSettings from "./SystemSettings/OSSettings";
//import ConnectionSettings from "./SystemSettings/ConnectionSettings";

class SystemSettings extends React.Component {
  constructor( props ) {
    super( props )
  }

  componentDidMount () {
    // IM.requestInterfacesList();
    this.props.fetchData();
  }

  render () {
    return (
      <div className="view-content">
        <section>
        {/*  <Col xs = {4}>
            <ConnectionSettings {...this.props} />
          </Col>*/}
          <Col xs = {4}>
            <OSSettings {...this.props }/>
          </Col>
          <Col xs = {4}>
            <LocalizationSettings {...this.props } />
          </Col>
        </section>
        <section>
          <Col xs = {4}>
            <Console { ...this.props }/>
          </Col>
        </section>
      </div>
    );
  }
};

// REDUX
function mapStateToProps ( state ) {
  return ( { general: state.system.general
           , advanced: state.system.advanced
           , ui: state.system.ui
           , info: state.system.info
           // , connectionForm: state.system.connectionForm
           , osForm: state.system.osForm
           , localizationForm: state.system.localizationForm
           , consoleForm: state.system.consoleForm
           }
         );
};

function mapDispatchToProps ( dispatch ) {
  return (
    // OS FORM
    { updateOSForm: ( field, value ) => dispatch( systemActions.updateOSForm( field, value ) )
    , resetOSForm: () => dispatch( systemActions.resetOSForm() )
    // CONNECTION FORM
    // , updateConnectionForm: ( field, value ) => dispatch( systemActions.updateConnectionForm( field, value ) )
    // , resetConnectionForm: () => dispatch( systemActions.resetConnectionForm() )
    // LOCALIZATION FORM
    , updateLocalizationForm: ( field, value ) => dispatch( systemActions.updateLocalizationForm( field, value ) )
    , resetLocalizationForm: () => dispatch( systemActions.resetLocalizationForm() )
    // CONSOLE FORM
    , updateConsoleForm: ( field, value ) => dispatch( systemActions.updateConsoleForm( field, value ) )
    , resetConsoleForm: () => dispatch( systemActions.resetConsoleForm() )

    // QUERIES
    , fetchData: () => {
      dispatch( systemActions.requestGeneralConfig() );
      dispatch( systemActions.requestTimezones() );
      dispatch( systemActions.requestKeymaps() );
      dispatch( systemActions.requestAdvancedConfig() );
      dispatch( systemActions.requestSerialPorts() );
      dispatch( systemActions.requestHardware() );
      dispatch( systemActions.requestLoadAvg() );
      dispatch( systemActions.requestTime() );
      dispatch( systemActions.requestUnameFull() );
      dispatch( systemActions.requestVersion() );
    }

    // TASKS
    , submitOSTask: () => dispatch( systemActions.submitOSTask() )
    // , submitConnectionForm: () => dispatch( systemActions.submitConnectionForm() )
    , submitLocalizationTask: () => dispatch( systemActions.submitLocalizationTask() )
    , submitConsoleTask: () => dispatch( systemActions.submitConsoleTask() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( SystemSettings );
