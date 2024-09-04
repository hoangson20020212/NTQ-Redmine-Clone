import { CustomFields } from "./project.type";

export interface MultipleWiki {
  title: string;
  version: number;
  value: string;
  created_on: string;
  updated_on: string;
}

export interface Wiki {
  title: string;
  text: string;
  version: number;
  author: CustomFields;
  comments: string;
  created_on: string;
  updated_on: string;
}
