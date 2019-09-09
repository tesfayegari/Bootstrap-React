import { SPHttpClient } from "@microsoft/sp-http";

export interface IListViewProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  listName: string;
}
