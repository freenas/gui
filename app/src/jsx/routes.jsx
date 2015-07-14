// FREENAS GUI ROUTES
// ==================

"use strict";

import React from "react";

// Routing
import Router from "react-router";
const Route         = Router.Route;
const Redirect      = Router.Redirect;
const DefaultRoute  = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

// STATIC ROUTES
import Root from "./views/FreeNASWebApp";
import PageNotFound from "./views/PageNotFound";

import Accounts from "./views/Accounts";
import Users from "./views/Accounts/Users";
import UserItem from "./views/Accounts/Users/UserItem";
import UserAdd from "./views/Accounts/Users/UserAdd";

import Groups from "./views/Accounts/Groups";
import GroupItem from "./views/Accounts/Groups/GroupItem";
import GroupAdd from "./views/Accounts/Groups/GroupAdd";

import Calendar from "./views/Calendar";

import Network from "./views/Network";

import Hardware from "./views/Hardware";
import Update from "./views/Hardware/Update";
import Power from "./views/Hardware/Power";

module.exports = (
  <Route
    path    = "/"
    handler = { Root } >

    <DefaultRoute handler={ Users } />

    {/* ACCOUNTS */}
    <Route
      name    = "accounts"
      path    = "accounts"
      handler = { Accounts }>
      <DefaultRoute handler={ Users } />

      {/* USERS */}
      <Route
        name    = "users"
        path    = "users"
        handler = { Users } >
        <Route
          name    = "add-user"
          path    = "add-user"
          handler = { UserAdd } />
        <Route
          name    = "users-editor"
          path    = ":userID"
          handler = { UserItem } />
      </Route>

      {/* GROUPS */}
      <Route
        name    = "groups"
        path    = "groups"
        handler = { Groups } >
        <Route
          name    = "add-group"
          path    = "add-group"
          handler = { GroupAdd } />
        <Route
          name    = "groups-editor"
          path    = ":groupID"
          handler = { GroupItem } />
      </Route>
    </Route>

    {/* CALENDAR */}
    <Route
      name    = "calendar"
      route   = "calendar"
      handler = { Calendar } />


    {/* NETWORK */}
    <Route
      name    = "network"
      path    = "network"
      handler = { Network } />


    {/* SYSTEM */}
    <Route
      name    = "hardware"
      route   = "hardware"
      handler = { Hardware }>
      <DefaultRoute handler={ Update } />
      <Route
        name    = "update"
        path   = "update"
        handler = { Update } />
      <Route
        name    = "power"
        path   = "power"
        handler = { Power } />
    </Route>

    <NotFoundRoute handler={ Users } />

  </Route>
);
