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
  const id = props.api.id;

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
