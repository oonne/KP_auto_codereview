/* 全局配置 */
export interface MentionedUser {
  username: string;
  mobile: string;
}
export interface GlobalConfig {
  url: string;
  username: string;
  password: string;
  projectList: string[];
  noticeHook: string;
  errorHook: string;
  refreshInterval: number;
  userList: MentionedUser[];
}
