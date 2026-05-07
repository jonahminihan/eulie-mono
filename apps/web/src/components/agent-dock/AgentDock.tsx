// import DockLayout, {
//   type DockMode,
//   type DropDirection,
//   type LayoutBase,
//   type TabBase,
//   type TabData,
// } from "rc-dock";
// import "rc-dock/dist/rc-dock-dark.css";

// let tab0 = {
//   title: "Controlled Layout",
//   content: (
//     <div>
//       <p>
//         When you use <b>layout</b> instead of <b>defaultLayout</b> on
//         &lt;DockLayout&gt;
//       </p>
//       <p>DockLayout will work as a controlled component</p>
//     </div>
//   ),
// };

// // let box = {
// //   dockbox: {
// //     mode: "horizontal",
// //     children: [
// //       {
// //         mode: "vertical",
// //         children: [
// //           {
// //             tabs: [{ id: "t0" }, htmlTab, tsxTab],
// //           },
// //           {
// //             tabs: [
// //               { id: "protect1" },
// //               { id: "t4" },
// //               { id: "t5" },
// //               { id: "t6" },
// //             ],
// //           },
// //         ],
// //       },
// //       {
// //         tabs: [{ id: "t7" }, { id: "t8" }, { id: "t9" }],
// //       },
// //     ],
// //   },
// // };

// const AgentDock = () => {
//   const defaultLayout = {
//     dockbox: {
//       mode: "horizontal" as DockMode,
//       children: [
//         {
//           tabs: [
//             { id: "tab1", title: "tab1", content: <div>Hello World</div> },
//           ],
//         },
//       ],
//     },
//   };

//   const loadTab = (data: TabBase): TabData => {
//     let { id } = data;
//     switch (id) {
//       case "t0":
//         return { ...tab0, id };
//       case "protect1":
//         return {
//           id,
//           title: "Protect",
//           closable: true,
//           content: (
//             <div>
//               <p>Removal of this tab will be rejected</p>
//               This is done in the onLayoutChange callback
//             </div>
//           ),
//         };
//     }

//     return {
//       id,
//       title: id,
//       content: <div>Tab Content</div>,
//     };
//   };

//   const onLayoutChange = (
//     newLayout: LayoutBase,
//     currentTabId?: string,
//     direction?: DropDirection,
//   ) => {
//     // control DockLayout from state
//     console.log(currentTabId, newLayout, direction);
//     if (currentTabId === "protect1" && direction === "remove") {
//       alert("removal of this tab is rejected");
//     } else {
//       //   this.setState({ layout: newLayout });
//     }
//   };

//   return (
//     <div className="relative size-full">
//       <DockLayout
//         layout={defaultLayout}
//         loadTab={loadTab}
//         onLayoutChange={onLayoutChange}
//         //   defaultLayout={defaultLayout}
//         style={{
//           position: "absolute",
//           left: 10,
//           top: 10,
//           right: 10,
//           bottom: 10,
//         }}
//       />
//     </div>
//   );
// };

// export default AgentDock;

////////////////////////////////////////////////////////////
// second try

import "dockview-react/dist/styles/dockview.css";

import {
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import styles from "./AgentDock.module.css";

import { themeAbyssSpaced } from "dockview-react";

const myTheme = {
  ...themeAbyssSpaced,
  className: `${themeAbyssSpaced.className} ${styles["eu-dock-overrides"]}`,
};

const MyPanel = (props: IDockviewPanelProps) => {
  return <div style={{ padding: 16 }}>{props.api.title}</div>;
};

const components = { default: MyPanel };

export default function App() {
  console.log("styles", styles);
  const onReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: "panel_1",
      component: "default",
      title: "Panel 1",
    });
    event.api.addPanel({
      id: "panel_2",
      component: "default",
      title: "Panel 2",
      position: { referencePanel: "panel_1", direction: "right" },
    });
  };

  return (
    <div id="dock-root" className={`size-full`}>
      <DockviewReact
        // className={styles["eu-dock-overrides"]}
        // style={{ width: "100%", height: "100%" }}
        onReady={onReady}
        components={components}
        theme={myTheme}
      />
    </div>
  );
}
