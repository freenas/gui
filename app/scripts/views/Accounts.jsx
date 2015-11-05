// Users and Groups
// ================
// View showing all users and groups.

"use strict";

import React from "react";
import { History } from "react-router";

import SectionNav from "../components/SectionNav";

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
          <SectionNav
            bs-size = "md"
            views = { sections }
          />
        </div>
          { this.props.children }
        </main>
      );
    }
});

export default Accounts;
