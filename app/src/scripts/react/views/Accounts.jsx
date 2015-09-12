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
          <h1 className="section-heading heading-with-nav">
            <span className="text">Accounts</span>
            <SectionNav
              bs-size = "md"
              views = { sections }
            />
          </h1>
          <RouteHandler />
        </main>
      );
    }
});

export default Accounts;
