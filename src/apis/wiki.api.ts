import { MultipleWiki, Wiki } from "~/types/wiki.type";
import http from "~/utils/http";

export const URL_PROJECTS = "projects";

const wikisApi = {
  getAllWikiProject(data: { project_id: number }) {
    return http.get<{ wiki_pages: MultipleWiki[] }>(`${URL_PROJECTS}/${data.project_id}/wiki/index.json`);
  },

  getWikiProject(data: { project_id: number; name: string }) {
    return http.get<{ wiki_page: Wiki }>(`${URL_PROJECTS}/${data.project_id}/wiki/${data.name}.json`);
  },
};

export default wikisApi;
