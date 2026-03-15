import { isExtensionEnvironment } from "../../utils/is-extension-environment.util";
import { BrowserStorageApi } from "./browser-storage-api";
import { ChromeStorageApi } from "./chrome-storage-api";
import type { IStorageApi } from "./types/storage-api";

export const storageApi: IStorageApi = isExtensionEnvironment()
  ? new ChromeStorageApi()
  : new BrowserStorageApi();
