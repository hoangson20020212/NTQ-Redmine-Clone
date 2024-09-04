import { ListDataResponse } from "~/types/utils.type";
import http from "~/utils/http";

export interface SearchResult {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  datetime: string;
}

interface SearchOptions {
  offset?: number;
  limit?: number;
  scope?: "all" | "my_project" | "subprojects";
  all_words?: boolean;
  titles_only?: boolean;
  issues?: boolean;
  news?: boolean;
  documents?: boolean;
  changesets?: boolean;
  wiki_pages?: boolean;
  messages?: boolean;
  projects?: boolean;
  open_issues?: boolean;
  attachments?: "0" | "1" | "only";
}

const searchApi = {
  search(query: string, options?: SearchOptions) {
    let params = `q=${encodeURIComponent(query)}`;

    if (options) {
      const {
        offset,
        limit,
        scope,
        all_words,
        titles_only,
        issues,
        news,
        documents,
        changesets,
        wiki_pages,
        messages,
        projects,
        open_issues,
        attachments,
      } = options;

      if (offset !== undefined) params += `&offset=${offset}`;
      if (limit !== undefined) params += `&limit=${limit}`;
      if (scope) params += `&scope=${scope}`;
      if (all_words !== undefined) params += `&all_words=${all_words}`;
      if (titles_only !== undefined) params += `&titles_only=${titles_only}`;
      if (issues !== undefined) params += `&issues=${issues ? 1 : 0}`;
      if (news !== undefined) params += `&news=${news ? 1 : 0}`;
      if (documents !== undefined) params += `&documents=${documents ? 1 : 0}`;
      if (changesets !== undefined) params += `&changesets=${changesets ? 1 : 0}`;
      if (wiki_pages !== undefined) params += `&wiki_pages=${wiki_pages ? 1 : 0}`;
      if (messages !== undefined) params += `&messages=${messages ? 1 : 0}`;
      if (projects !== undefined) params += `&projects=${projects ? 1 : 0}`;
      if (open_issues !== undefined) params += `&open_issues=${open_issues ? 1 : 0}`;
      if (attachments) params += `&attachments=${attachments}`;
    }

    return http.get<ListDataResponse<SearchResult[], "">>(`/search.json?${params}`);
  },
};

export default searchApi;
