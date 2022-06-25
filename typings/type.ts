/* 一次提交的内容 */
export interface Commit {
  index: number;
  subject: string;
  owner: string;
  project: string;
  branch: string;
}
