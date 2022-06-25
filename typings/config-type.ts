/* 全局配置 */
export interface GlobalConfig {
  url: string;
  username: string;
  password: string;
  projectList: string[];
  noticeHook: string;
  errorHook: string;
  refreshInterval: number;
}
