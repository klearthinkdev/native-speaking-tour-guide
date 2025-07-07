export enum WSProxy {
  /**
   * 單語翻譯 - 預設
   */
  DEFAULT = '',
  /**
   * 單語翻譯 - 使用 GT，無備援
   */
  API = 'api',
  /**
   * 單語翻譯 - 使用 LLM，無備援
   */
  LLM = 'llm',
  /**
   * 單語翻譯 - 使用 IP 抓 Proxy，無備援
   */
  PROXY = 'proxy',
  /**
   * 多語翻譯 - 預設
   */
  MULTI_DEFAULT = 'full',
  /**
   * 多語翻譯 - 使用 GT，無備援
   */
  MULTI_API = 'fullapi',
  /**
   * 多語翻譯 - 使用 LLM，無備援
   */
  MULTI_LLM = 'fullllm',
  /**
   * 多語翻譯 - 使用 IP 抓 Proxy，無備援
   */
  MULTI_PROXY = 'fullproxy',
}
