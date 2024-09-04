import { Project } from "~/types/project.type";
import { ListDataResponse } from "~/types/utils.type";
import { NewVersion, Version } from "~/types/version.type";
import http from "~/utils/http";

export const URL_PROJECTS = "projects";
export const URL_VERSIONS = "versions";

const versionsApi = {
  getAllVersionOfProject(data: { include?: string; idProject: number }) {
    const params = data;
    return http.get<ListDataResponse<Version[], "versions">>(`${URL_PROJECTS}/${data.idProject}/${URL_VERSIONS}.json`, { params });
  },

  getProjectById(data: { id: number; include?: string }) {
    const params = data.include ? { include: data.include } : {};
    return http.get<{ project: Project }>(`${URL_PROJECTS}/${data.id}.json`, { params });
  },

  postNewVersions(id: number, data: NewVersion) {
    return http.post(`/projects/${id}/${URL_VERSIONS}.json`, { version: data });
  },

  updateVersions(id: number, data: NewVersion) {
    return http.put(`/${URL_VERSIONS}/${id}.json`, { version: data });
  },

  deleteVersions(id: number) {
    return http.delete(`/${URL_VERSIONS}/${id}.json`);
  },
};

export default versionsApi;
