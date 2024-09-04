import DefaultLayout from "~/layouts/DefaultLayout";
import LoginPage from "~/pages/Login/LoginPage";
import LostPasswordPage from "~/pages/LostPassword/LostPasswordPage";
import HomePage from "~/pages/Home/HomePage";
import ProjectsPage from "~/pages/Projects/ProjectsPage";
import MyPage from "~/pages/MyPage/MyPage";
import TimeEntryCreate from "~/pages/TimeEntryCreate";
import NotFound from "~/pages/NotFound";
import TimeEntry from "~/pages/TimeEntry";
import OverView from "~/pages/OverView";
import Activity from "~/pages/Activity";
import Roadmap from "~/pages/Roadmap";
import Gantt from "~/pages/Gantt";
import IssuesCreate from "~/pages/IssuesCreate";
import CalendarDetail from "~/pages/CalendarDetail";
import DocumentsPage from "~/pages/Documents";
import Wiki from "~/pages/Wiki";
import FilesPage from "~/pages/Files";
import Settings from "~/pages/Settings";
import NewVersion from "~/pages/Roadmap/_components/NewVersion";
import Issues from "~/pages/Issues";
import DetailIssue from "~/pages/Issues/_components/DetailIssue/DetailIssue";

import MyAccount from "~/pages/MyAccount";
import EditSpentTime from "~/pages/Issues/_components/EditSpentTime";
import MemberProject from "~/pages/MemberProject";
import EditPage from "~/pages/Issues/_components/EditPage";

const publicRoutes = [
  { path: "/login", component: LoginPage, layout: DefaultLayout },
  { path: "/lost-password", component: LostPasswordPage, layout: DefaultLayout },
];
const privateRoutes = [
  { path: "/my-page", component: MyPage, layout: DefaultLayout },
  { path: "/time_entries/new", component: TimeEntryCreate, layout: DefaultLayout },
  { path: "/time_entries", component: TimeEntry, layout: DefaultLayout },
  { path: "/", component: HomePage, layout: DefaultLayout },
  { path: "/projects", component: ProjectsPage, layout: DefaultLayout },
  { path: "/issues", component: Issues, layout: DefaultLayout },
  { path: "/user/:userId", component: OverView, layout: DefaultLayout },

  { path: "/my/account", component: MyAccount, layout: DefaultLayout },

  { path: "/projects/:id/:name/overview", component: OverView, layout: DefaultLayout },
  { path: "/projects/:id/:name/users/:userId", component: MemberProject, layout: DefaultLayout },
  { path: "/projects/:id/:name/activity", component: Activity, layout: DefaultLayout },
  { path: "/projects/:id/:name/roadmap", component: Roadmap, layout: DefaultLayout },
  { path: "/projects/:id/:name/roadmap/newVersion", component: NewVersion, layout: DefaultLayout },
  { path: "/projects/:id/:name/:versionId/edit", component: NewVersion, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues", component: Issues, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/:issueId", component: DetailIssue, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/:issueId/edit", component: EditPage, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/new", component: IssuesCreate, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/:issueId/time_entries/new", component: EditSpentTime, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/gantt", component: Gantt, layout: DefaultLayout },
  { path: "/projects/:id/:name/issues/calendar", component: CalendarDetail, layout: DefaultLayout },
  { path: "/projects/:id/:name/documents", component: DocumentsPage, layout: DefaultLayout },
  { path: "/projects/:id/:name/wiki", component: Wiki, layout: DefaultLayout },
  { path: "/projects/:id/:name/files", component: FilesPage, layout: DefaultLayout },
  { path: "/projects/:id/:name/settings", component: Settings, layout: DefaultLayout },
  { path: "*", component: NotFound },
];
export { privateRoutes, publicRoutes };
