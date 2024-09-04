import { Project } from "~/types/project.type";
import { ListDataResponse } from "~/types/utils.type";
import http from "~/utils/http";

export const URL_PROJECTS = "projects";

const projectsApi = {
  getAllProjects(data?: { include?: string; limit?: number; page?: number }) {
    const params = data;
    return http.get<ListDataResponse<Project[], "projects">>(`${URL_PROJECTS}.json`, { params });
  },

  getProjectById(data: { id: number; include?: string }) {
    const params = data.include ? { include: data.include } : {};
    return http.get<{ project: Project }>(`${URL_PROJECTS}/${data.id}.json`, { params });
  },

  createProject(data: { project: Project }) {
    return http.post(`${URL_PROJECTS}.json`, { project: data.project });
  },

  updateProject(data: { id: number; project: Project }) {
    return http.put(`${URL_PROJECTS}/${data.id}.json`, { project: data.project });
  },

  archiveProject(data: { id: number }) {
    return http.put(`${URL_PROJECTS}/${data.id}/archive.json`);
  },

  unarchiveProject(data: { id: number }) {
    return http.put(`${URL_PROJECTS}/${data.id}/unarchive.json`);
  },

  deleteProject(data: { id: number }) {
    return http.delete(`${URL_PROJECTS}/${data.id}.json`);
  },

  getListWikiProject(data: { id: number }) {
    return http.delete(`${URL_PROJECTS}/${data.id}/wiki/index.json`);
  },

  getWikiProject(data: { id: number; name: string }) {
    return http.delete(`${URL_PROJECTS}/${data.id}/wiki/${name}.json`);
  },
};

export default projectsApi;
