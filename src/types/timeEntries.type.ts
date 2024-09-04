export interface TimeEntries {
  id: number;
  project: Project;
  issue: { id: number };
  user: User;
  activity: Activity;
  hours: number;
  comments?: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
  custom_fields?: CustomFields[];
}

interface CustomFields {
  id: number;
  name: string;
  value?: string;
}

interface Activity {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

export interface TimeEntriesTable {
  id: number;
  activity: string;
  comment: string | undefined;
  hours: number;
  project: string | undefined | JSX.Element;
  date: string;
}

export interface GroupedTimeEntries {
  date: string;
  entries: TimeEntriesTable[];
  totalHours: number;
}
