import {
  AdminWebsocket,
  AppAgentWebsocket,
  AppWebsocket,
  CellType,
  ProvisionedCell,
} from "@holochain/client";
import {
  NhLauncherApplet,
  AppletRenderers,
  WeServices,
  AppletInfo,
} from "@neighbourhoods/nh-launcher-applet";
import { HolochainApp } from "./holochain-app";

const todoApplet: NhLauncherApplet = {
  //@ts-ignore
  async appletRenderers(
    appWebsocket: AppWebsocket,
    appAgentWebsocket: AppAgentWebsocket,
    adminWebsocket: AdminWebsocket,
    weStore: WeServices,
    appletAppInfo: AppletInfo[]
  ): Promise<AppletRenderers> {
    return {
      full(element: HTMLElement, registry: CustomElementRegistry) {
        registry.define("holochain-app", HolochainApp);
        element.innerHTML = `<holochain-app></holochain-app>`;
        const appletElement = element.querySelector("holochain-app") as any;
        appletElement.appWebsocket = appWebsocket;
        appletElement.appAgentWebsocket = appAgentWebsocket;
        appletElement.adminWebsocket = adminWebsocket;
        appletElement.appletAppInfo = appletAppInfo;
        appletElement.sensemakerStore = weStore.sensemakerStore;
      },
      blocks: [],
    };
  },
};

export default todoApplet;
