// FREENAS GUI ROUTES
// ==================

"use strict";

import React from "react";

// Routing
import { Router, IndexRoute, Route } from "react-router";

// STATIC ROUTES
import Root from "./react/webapp/FreeNASWebApp";

import Dashboard from "./react/views/Dashboard";

import Accounts from "./react/views/Accounts";
import Users from "./react/views/Accounts/Users";
import UserItem from "./react/views/Accounts/Users/UserItem";
import UserAdd from "./react/views/Accounts/Users/UserAdd";

import Groups from "./react/views/Accounts/Groups";
import GroupItem from "./react/views/Accounts/Groups/GroupItem";
import GroupAdd from "./react/views/Accounts/Groups/GroupAdd";

import Calendar from "./react/views/Calendar";

import Network from "./react/views/Network";

import Console from "./react/views/Console";

import Hardware from "./react/views/Hardware";

import Storage from "./react/views/Storage";

import Settings from "./react/views/Settings";
import System from "./react/views/Settings/System";
import Update from "./react/views/Settings/Update";
import Security from "./react/views/Settings/Security";
import Alerts from "./react/views/Settings/Alerts";
import Support from "./react/views/Settings/Support";

export default (
  <Route path="/" component={ Root } >

    {/* DASHBOARD */}
    <IndexRoute component={ Dashboard } />
    <Route path="dashboard" component={ Dashboard } />


    {/* ACCOUNTS */}
    <Route path="accounts" component={ Accounts } >
      <IndexRoute component={ Users } />


      {/* USERS */}
      <Route path="users" component={ Users } >
        <Route path="add-user" component={ UserAdd } />

        <Route
          name      = "users-editor"
          path      = ":userID"
          component = { UserItem }
        />
      </Route>


      {/* GROUPS */}
      <Route path="groups" component={ Groups } >

        <Route path="add-group" component={ GroupAdd } />

        <Route
          name      = "groups-editor"
          path      = ":groupID"
          component = { GroupItem }
        />
      </Route>
    </Route>


    {/* CALENDAR */}
    <Route path="calendar" component={ Calendar } />


    {/* NETWORK */}
    <Route path="network" component={ Network } />


    {/* CONSOLE */}
    <Route path="console" component={ Console } />


    {/* HARDWARE */}
    <Route path="hardware" component={ Hardware } />


    {/* STORAGE */}
    <Route path="storage" component={ Storage } />


    { /* Settings */ }
    <Route path="settings" component={ Settings } >
      <IndexRoute component={ System } />

      <Route path="system" component={ System } />
      <Route path="update" component={ Update } />
      <Route path="security" component={ Security } />
      <Route path="alerts" component={ Alerts } />
      <Route path="support" component={ Support } />
    </Route>

  </Route>
);
