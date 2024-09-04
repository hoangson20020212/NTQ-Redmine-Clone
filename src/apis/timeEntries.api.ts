import { TimeEntries } from "~/types/timeEntries.type";
import { ListDataResponse } from "~/types/utils.type";
import http from "~/utils/http";

export const URL_TIME_ENTRIES = "time_entries";

const timeEntriesApi = {
  listTimeEntries(data?: {
    offset?: number;
    limit?: number;
    sort?: string;
    project_id?: number;
    user_id?: number | string;
    spent_on?: number;
    created_on?: string;
    updated_on?: string;
    from?: string;
    to?: string;
  }) {
    const params = data;
    return http.get<ListDataResponse<TimeEntries[], "time_entries">>(`${URL_TIME_ENTRIES}.json`, { params });
  },

  createTimeEntries(data: Partial<TimeEntries>) {
    return http.post(`${URL_TIME_ENTRIES}.json`, { time_entry: data });
  },

  updateIssue(id: number, updates: Partial<TimeEntries>) {
    return http.put(`${URL_TIME_ENTRIES}/${id}.json`, { issue: updates });
  },

  deleteIssue(id: number) {
    return http.delete(`${URL_TIME_ENTRIES}/${id}.json`);
  },
};

export default timeEntriesApi;
