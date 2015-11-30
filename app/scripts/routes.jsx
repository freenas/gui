// FREENAS GUI ROUTES
// ==================

"use strict";

import React from "react";

// Routing
import { Router, IndexRoute, IndexRedirect, Route } from "react-router";

// STATIC ROUTES
import Root from "./views/App";
import Dashboard from "./views/Dashboard";
import Storage from "./views/Storage";
import Network from "./views/Network";
import Accounts from "./views/Accounts";
  import Users from "./views/Accounts/Users";
    import UserItem from "./views/Accounts/Users/UserItem";
    import UserAdd from "./views/Accounts/Users/UserAdd";
  import Groups from "./views/Accounts/Groups";
    import GroupItem from "./views/Accounts/Groups/GroupItem";
    import GroupAdd from "./views/Accounts/Groups/GroupAdd";
import Calendar from "./views/Calendar";
import AppCafe from "./views/AppCafe";
import Console from "./views/Console";
import System from "./views/System";
import Settings from "./views/Settings";
  import SystemSettings from "./views/Settings/SystemSettings";
  import Sharing from "./views/Settings/Sharing";
  import Clustered from "./views/Settings/Clustered";
  import Update from "./views/Settings/Update";
  import Security from "./views/Settings/Security";

export default (
  <Route path="/" component={ Root } >

    {/* DASHBOARD */}
    <IndexRoute component={ Console } />
    <Route path="dashboard" component={ Dashboard } />


    {/* STORAGE */}
    <Route path="storage" component={ Storage } />


    {/* NETWORK */}
    <Route path="network" component={ Network } />


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


    {/* CONSOLE */}
    <Route path="console" component={ Console } />


    {/* AppCafe */}
    <Route path="appcafe" component={ AppCafe } />


    {/* System */}
    <Route path="system" component={ System } />


    { /* Settings */ }
    <Route path="settings" component={ Settings } >
      <IndexRoute component={ SystemSettings } />


      <Route path="system" component={ SystemSettings } />
      <Route path="sharing" component={ Sharing } />
      <Route path="clustered" component={ Clustered } />
      <Route path="update" component={ Update } />
      <Route path="security" component={ Security } />
    </Route>

    <Route path="*" component={ Console } />

  </Route>
);
