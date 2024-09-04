interface Project {
  id: number;
  name: string;
}

interface Tracker {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface CustomField {
  id: number;
  name: string;
  value?: string | string[] | number;
  multiple?: boolean;
}

export interface Issue {
  id: number;
  project: Project;
  tracker: Tracker;
  status: Status;
  priority: Priority;
  author: User;
  assigned_to?: User;
  parent?: {
    id: number;
  };
  subject?: string;
  description: string;
  start_date?: string;
  done_ratio: number;
  due_date?: string;
  estimated_hours: number;
  spent_hours?: number;
  custom_fields?: CustomField[];
  created_on: string;
  updated_on?: string;
  fixed_version?: FixVersion;
  BugType?: string;
  Severity?: string;
  QCActivity?: string;
  CauseCategory?: [string];
  "IsDegrade?"?: string;
  Reopencounter?: number;
  watchers?: User[];
}

export interface IssueEdit {
  id?: number;
  assigned_to_id?: number;
  parent_issue_id?: number;
  project_id?: number;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  subject?: string;
  category_id?: number;
  description?: string;
  start_date?: string;
  done_ratio?: number;
  due_date?: string;
  estimated_hours?: number;
  spent_hours?: number;
  fixed_version_id?: number;
  severity?: string;
  bugType?: string;
  qcActivity?: string;
  causeCategory?: string;
  isDegrade?: string;
  reopenCounter?: number;
  comment?: string;
  hours?: number;
  activity_id?: number;
  productCategory?: string;
}

export interface dataEditForm {
  project_id: number;
  issueEdit: IssuesEditForm;
  spent_time: SpentTime;
}

export interface IssuesEditForm {
  subject?: String | undefined;
  tracker_id?: number | undefined;
  priority_id?: number | undefined;
  assigned_to_id?: number | undefined;
  due_date?: string | undefined;
  start_date?: String | undefined;
  status_id?: number;
  estimated_hours?: number | undefined;
  fixed_version_id?: number | undefined;
  done_ratio?: number | undefined;
  description?: String | undefined;
  parent_issue_id?: number | undefined;
  custom_fields?: CustomField[];
}

interface SpentTime {
  issue_id: number;
  comment: String;
  hours: number;
  spent_on: String;
  activity_id: number;
  custom_fields: CustomField[];
}

interface FixVersion {
  id: number;
  name: string;
}

export interface IssueCreate {
  project_id: number;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  subject?: string;
  description?: string;
  done_ratio?: number;
  fixed_version_id?: number;
  assigned_to_id?: number;
  parent_issue_id?: number;
  estimated_hours?: number;
  custom_fields?: { value: string | string[]; id: number }[];
  start_date?: string;
  due_date?: string;
  watcher_user_ids?: number[];
  uploads?: { token: string; filename: string; content_type: string }[];
}

interface FixVersion {
  id: number;
  name: string;
}

export interface IssueStatus {
  id: number;
  name: string;
  is_closed: boolean;
}

export interface CustomFields {
  [key: string]: string | Array<string> | number;
}

export interface GroupedIssueByDay {
  [key: string]: Issue[];
}

export type IssueTable = {
  "#": number;
  project: string | undefined;
  tracker: string | undefined;
  subject: string | undefined;
  [key: string]: string | number | JSX.Element | undefined;
};
