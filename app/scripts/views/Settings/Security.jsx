// Security Settings
// =================
// FreeNAS system settings relating to security, including Certificates and
// Certificate Authorities.

"use strict";

import React from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap";

import * as sshActions from "../../actions/ssh";

import SSH from "./Security/SSH";

class Security extends React.Component{
  constructor ( props ) {
    super( props );
  }

  componentDidMount () {
    this.props.requestSSHConfig();
  }

  render () {
    return (
      <div className="view-content">
        <section>
          <Col xs = {4}>
            <SSH { ...this.props }/>
          </Col>
        </section>
      </div>
    );
  }
};

// REDUX
function mapStateToProps ( state ) {
  return ( { sshServerState: state.ssh.sshServerState
           , sshForm: state.ssh.sshForm
           , sshConfigRequests: state.ssh.sshConfigRequests
           }
         );
};

function mapDispatchToProps ( dispatch ) {
  return (
    // SSH FORM
    { updateSSHForm: ( field, value ) => dispatch( sshActions.updateSSHForm( field, value ) )
    , resetSSHForm: () => dispatch( sshActions.resetSSHForm() )

    // QUERIES
    , requestSSHConfig: () => dispatch( sshActions.requestSSHConfig() )

    // TASKS
    // , submitSSHForm: () => dispatch( sshActions.submitSSHForm() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Security );
