// Users and Groups
// ================
// View showing all users and groups.

"use strict";

import React from "react";
import { History } from "react-router";
import { connect }  from "react-redux";

// ACTIONS
import * as CONTEXTUAL from "../actions/contextual";
import * as ELEMENTS from "../constants/ContextualElements";

import SectionNav from "../components/SectionNav";
import HelpButton from "../components/HelpButton";

var sections = [ { route : "/accounts/users"
                 , display : "Users"
                 }
               , { route : "/accounts/groups"
                 , display : "Groups"
                 }
               ];

const Accounts = React.createClass(
  { displayName: "Accounts"

  , mixins: [ History ]

  , componentDidMount () {
      this.redirectToUsers();
    }

  , componentWillUnmount () {
      this.props.cleanup();
    }

    // I don't remember why we're doing this here, too, but I'm scared not to.
  , componentWillUpdate ( prevProps, prevState ) {
      this.redirectToUsers();
    }

    // This is dumb. Stupid "temporary" (hah) hack because we updated
    // react-router too soon. And yet still better than the old thing.
  , redirectToUsers () {
    if ( this.props.location.pathname.endsWith( "accounts" )
      || this.props.location.pathname.endsWith( "accounts/" )
       ) {
      this.history.pushState( null, "/accounts/users" );
    }
  }

  , render () {
      return (
        <main>
        <div className="view-header heading-with-nav">
          <h1 className="section-heading">
            <span className="text">Accounts</span>
          </h1>
          <HelpButton
            className = "pull-right"
            docs = "ACCOUNTS_GENERAL"
            activeDocs = { this.props.contextual.activeDocs }
            requestDocs = { this.props.requestDocs }
            releaseDocs = { this.props.releaseDocs }
          />
          <SectionNav
            bs-size = "md"
            views = { sections }
          />
        </div>
          { this.props.children }
        </main>
      );
    }
  }
);


// REDUX
function mapStateToProps ( state ) {
  return { contextual: state.contextual }
}

function mapDispatchToProps ( dispatch ) {
  return (
    // DOCS
    { requestDocs: ( section ) => {
        dispatch( CONTEXTUAL.setDocsSection( section ) );
        dispatch( CONTEXTUAL.requestContext( ELEMENTS.CONTEXTUAL_DOCUMENTATION ) );
      }
    , releaseDocs: ( section ) => {
        dispatch( CONTEXTUAL.unsetDocsSection( section ) );
        dispatch( CONTEXTUAL.releaseContext( ELEMENTS.CONTEXTUAL_DOCUMENTATION ) );
      }

    , cleanup: () => {
        dispatch( CONTEXTUAL.releaseContext( ELEMENTS.CONTEXTUAL_DOCUMENTATION ) );
      }
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Accounts );