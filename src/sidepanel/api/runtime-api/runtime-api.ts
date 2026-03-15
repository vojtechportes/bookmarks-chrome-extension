import { isExtensionEnvironment } from '../../utils/is-extension-environment.util';
import { ChromeRuntimeApi } from './chrome-runtime-api';
import { BrowserRuntimeApi } from './browser-runtime-api';
import type { IRuntimeApi } from './types/runtime-api';

export const runtimeApi: IRuntimeApi = isExtensionEnvironment()
  ? new ChromeRuntimeApi()
  : new BrowserRuntimeApi();
