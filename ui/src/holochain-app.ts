import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AdminWebsocket, AppAgentClient, AppAgentWebsocket, AppWebsocket, CapSecret, encodeHashToBase64 } from '@holochain/client';
import { provide } from '@lit-labs/context';
import '@material/mwc-circular-progress';
import { AppletInfo } from '@neighbourhoods/nh-launcher-applet';
import { SensemakerStore } from '@neighbourhoods/client';

import { clientContext } from './contexts';

import './forum/posts/all-posts';
import { AllPosts } from './forum/posts/all-posts';
import './forum/posts/create-post';
import { getCellId } from './utils';

export class HolochainApp extends LitElement {
  @property()
  appletAppInfo!: AppletInfo[];

  @property()
  appWebsocket!: AppWebsocket;

  @property()
  appAgentWebsocket!: AppAgentWebsocket;

  @property()
  adminWebsocket!: AdminWebsocket;

  @property()
  sensemakerStore!: SensemakerStore;

  @state() loading = true;

  @state() result: string | undefined;

  @provide({ context: clientContext })
  @property({ type: Object })
  client!: AppAgentClient;

  async firstUpdated() {
    const appletRoleName = "forum";
    const todoAppletInfo = this.appletAppInfo[0];
    const cellInfo = todoAppletInfo.appInfo.cell_info[appletRoleName][0]
    const cellId = getCellId(cellInfo);
    // encode cell id to string and console log it
    console.log("cell id", [encodeHashToBase64(cellId![0]), encodeHashToBase64(cellId![1])]);
    await this.adminWebsocket.authorizeSigningCredentials(cellId!);
    const installedCells = todoAppletInfo.appInfo.cell_info;
    await Promise.all(
      Object.keys(installedCells).map(roleName => {
        installedCells[roleName].map(cellInfo => {
          this.adminWebsocket.authorizeSigningCredentials(getCellId(cellInfo)!);
        })
      })
    );
    this.client = this.appAgentWebsocket;
    this.loading = false;
  }
  
  render() {
    if (this.loading)
      return html`
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      `;

    return html`
      <main>
        <h1>Forum</h1>

        <div id="content">
          <h2>All Posts</h2>
          <all-posts id="all-posts" style="margin-bottom: 16px"></all-posts>
          <create-post></create-post>
        </div>
      </main>
    `;
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--lit-element-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
}
