// Security Settings
// =================
// FreeNAS system settings relating to security, including Certificates and
// Certificate Authorities.

"use strict";

import React from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap";

import * as sshActions from "../../actions/ssh";
import * as SUBSCRIPTIONS from "../../actions/subscriptions";

import SSH from "./Security/SSH";

class Security extends React.Component{
  constructor ( props ) {
    super( props );

    this.displayName = "Security Settings";
  }

  componentDidMount () {
    this.props.subscribe( this.displayName );
    this.props.requestSSHConfig();
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
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

const SUB_MASKS = [ "entity-subscriber.services.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // SSH FORM
    , updateSSHForm: ( field, value ) => dispatch( sshActions.updateSSHForm( field, value ) )
    , resetSSHForm: () => dispatch( sshActions.resetSSHForm() )

    // QUERIES
    , requestSSHConfig: () => dispatch( sshActions.requestSSHConfig() )

    // TASKS
    , configureSSHTaskRequest: () =>
        dispatch( sshActions.configureSSHTaskRequest() )
    , toggleSSHTaskRequest: () =>
        dispatch( sshActions.toggleSSHTaskRequest() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Security );
