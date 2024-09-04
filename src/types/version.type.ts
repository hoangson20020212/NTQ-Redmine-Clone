import { Issue } from "./issue.type";

interface Project {
  id: number;
  name: string;
}

export interface Version {
  id: number;
  project: Project;
  name: string;
  description: string;
  status: string;
  due_date: string;
  sharing: string;
  created_on: string;
  updated_on: string;
  daysLate?: number;
  issues?: Issue[];
}

export interface NewVersion {
  name: string;
  description?: string;
  status: string;
  wiki_page_title: string;
  due_date: string;
  sharing: string;
}
