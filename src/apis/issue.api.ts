/* eslint-disable @typescript-eslint/no-explicit-any */
import { Issue, IssuesEditForm, IssueCreate } from "~/types/issue.type";
import { ListDataResponse } from "~/types/utils.type";
import http from "~/utils/http";

export const URL_ISSUES = "issues";

const issuesApi = {
  listIssues(data?: {
    offset?: number;
    limit?: number;
    sort?: string;
    include?: "attachments" | "relations" | "attachments,relations";
    issue_id?: string;
    project_id?: number;
    subproject_id?: number;
    fixed_version_id?: number | string;
    tracker_id?: number;
    status_id?: string;
    assigned_to_id?: string | number;
    author_id?: string | number;
    watcher_id?: string | number;
    parent_id?: number | string;
    cf_x?: string;
    created_on?: string;
    updated_on?: string;
  }) {
    const params = data;
    return http.get<ListDataResponse<Issue[], "issues">>(`${URL_ISSUES}.json`, { params });
  },

  getIssueById(data: {
    id: number;
    include?: Array<"attachments" | "relations" | "children" | "changesets" | "journals" | "watchers" | "allowed_statuses">;
  }) {
    const params = data.include && data.include.length > 0 ? { include: data.include.join(",") } : {};
    return http.get<{ issue: Issue }>(`${URL_ISSUES}/${data.id}.json`, { params });
  },

  createIssue(issue: Partial<IssueCreate>) {
    return http.post(`${URL_ISSUES}.json`, { issue }, { timeout: 10000 });
  },

  updateIssue(id: number, updates: IssuesEditForm) {
    return http.put(`${URL_ISSUES}/${id}.json`, { issue: updates });
  },

  deleteIssue(id: number) {
    return http.delete(`${URL_ISSUES}/${id}.json`);
  },
};

export default issuesApi;
