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
import Root from "./react/webapp/FreeNASWebApp";

import Accounts from "./react/views/Accounts";
import Users from "./react/views/Accounts/Users";
import UserItem from "./react/views/Accounts/Users/UserItem";
import UserAdd from "./react/views/Accounts/Users/UserAdd";

import Groups from "./react/views/Accounts/Groups";
import GroupItem from "./react/views/Accounts/Groups/GroupItem";
import GroupAdd from "./react/views/Accounts/Groups/GroupAdd";

import Calendar from "./react/views/Calendar";

import Network from "./react/views/Network";

import Hardware from "./react/views/Hardware";

import Storage from "./react/views/Storage";

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
      handler = { Network }/>


    {/* HARDWARE */}
    <Route
      name    = "hardware"
      path    = "hardware"
      handler = { Hardware } />

    {/* STORAGE */}
    <Route
      name    = "storage"
      route   = "storage"
      handler = { Storage } />

    <NotFoundRoute handler={ Users } />

  </Route>
);
