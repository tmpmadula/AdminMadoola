import * as React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";

import EditProfile from "../../containers/Profile/EditProfile";
export default function TabBar() {
  return (
    <StatefulTabs initialState={{ activeKey: "0" }} renderAll>
      <Tab title="Settings">
        <EditProfile />
      </Tab>
    </StatefulTabs>
  );
}
