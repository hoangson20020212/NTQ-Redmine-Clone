import { IssueStatus } from "~/types/issue.type";
import { ListDataResponse } from "~/types/utils.type";
import http from "~/utils/http";

const issueStatusesApi = {
  // Get all issue statuses
  getIssueStatuses() {
    return http.get<ListDataResponse<IssueStatus[], "issues">>("/issue_statuses.json");
  },
};

export default issueStatusesApi;
