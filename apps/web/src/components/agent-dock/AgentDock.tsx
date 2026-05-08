import "dockview-react/dist/styles/dockview.css";

import {
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import styles from "./AgentDock.module.css";

import { themeAbyssSpaced } from "dockview-react";
import { useAgentsDock } from "@/contexts/AgentsDockContext";
import AgentChat from "../agent-chat/AgentChat";

const myTheme = {
  ...themeAbyssSpaced,
  className: `${themeAbyssSpaced.className} ${styles["eu-dock-overrides"]}`,
};

const MyPanel = (props: IDockviewPanelProps) => {
  const { type } = props.api.getParameters();
  const id = props.api.id;
  console.log("type", type);
  console.log("id", id);
  console.log("id", props.api.isActive);

  return (
    <div className="size-full" style={{ padding: 16 }}>
      <AgentChat sessionId={id} />
    </div>
  );
};

const components = { default: MyPanel };

export default function App() {
  const { setDockApi } = useAgentsDock();
  const onReady = (event: DockviewReadyEvent) => {
    setDockApi(event.api);
    // event.api.addPanel({
    //   id: "panel_1",
    //   component: "default",
    //   title: "Panel 1",
    //   params: {
    //     type: "default",
    //   },
    // });
    // event.api.addPanel({
    //   id: "panel_2",
    //   component: "default",
    //   title: "Panel 2",
    //   position: { referencePanel: "panel_1", direction: "right" },
    // });
  };

  return (
    <div id="dock-root" className={`size-full`}>
      <DockviewReact
        className="size-full"
        onReady={onReady}
        components={components}
        theme={myTheme}
      />
    </div>
  );
}
