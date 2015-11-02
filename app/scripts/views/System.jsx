 // System Information
// ====================
// Displays information about system hardware

"use strict";

import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Panel, Well, ListGroup, ListGroupItem } from "react-bootstrap";

import * as DISKS from "../actions/disks";
import * as SYSTEM from "../actions/system";
import * as SUBSCRIPTIONS from "../actions/subscriptions";

import ByteCalc from "../utility/ByteCalc";
import DiskUtilities from "../utility/DiskUtilities";

import DiskSection from "./System/DiskSection";

// STYLESHEET
if ( process.env.BROWSER ) require( "./System.less" );


// REACT
class System extends React.Component {

  constructor ( props ) {
    super( props );

    this.displayName = "System"
  }

  componentDidMount () {
    this.props.fetchDisks();
    this.props.requestHardware();
    this.props.subscribe( this.displayName );
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  render () {
    return (
      <main className = { "system-wrapper" }>
        <div className ={ "statics" }>
          <Panel header = "System Information" /*TODO: split panel out into its own component when appropriate*/ >
            <ListGroup fill>
              <ListGroupItem>
                { "CPU: " + this.props.hardware.cpu_model }
              </ListGroupItem>
              <ListGroupItem>
                { "CPU Cores: " + this.props.hardware.cpu_cores }
              </ListGroupItem>
              <ListGroupItem>
                { "Memory: " + ByteCalc.humanize( this.props.hardware.memory_size ) }
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </div>
        <div className = { "disclosures" } >
          <DiskSection
            disks={ this.props.disks }
            diskGroups={ this.props.diskGroups }
          />
        </div>
      </main>
    );
  }

}


// REDUX
function mapStateToProps ( state ) {
  const { disks } = state;

  return (
    { disks: disks.disks
    , diskGroups: DiskUtilities.similarDisks( disks.disks )
    , hardware: state.system.info.hardware
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( [ "entity-subscriber.disks.changed" ], id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( [ "entity-subscriber.disks.changed" ], id ) )
    , fetchDisks: () =>
      dispatch( DISKS.requestDiskOverview() )
    , requestHardware: () =>
      dispatch( SYSTEM.requestHardware() )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( System );
