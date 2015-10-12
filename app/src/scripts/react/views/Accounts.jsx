// Users and Groups
// ================
// View showing all users and groups.

"use strict";

import React from "react";

import { RouteHandler } from "react-router";

import routerShim from "../mixins/routerShim";

import SectionNav from "../components/SectionNav";

var sections = [ { route : "users"
                 , display : "Users"
                 }
               , { route : "groups"
                 , display : "Groups"
                 } ];

const Accounts = React.createClass({

  displayName: "Accounts"

  ,  mixins: [ routerShim ]

  , componentDidMount () {
      this.calculateDefaultRoute( "accounts", "users", "endsWith" );
    }

  , componentWillUpdate ( prevProps, prevState ) {
      this.calculateDefaultRoute( "accounts", "users", "endsWith" );
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
