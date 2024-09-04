import { Block } from "~/types/utils.type";

export const optionBlockMyPage: Block[] = [
  {
    id: "1",
    title: "Issues assigned to me",
  },
  {
    id: "2",
    title: "Reported issues",
  },
  {
    id: "3",
    title: "Watched issues",
  },
  {
    id: "4",
    title: "Latest news",
  },
  {
    id: "5",
    title: "Calendar",
  },
  {
    id: "6",
    title: "Documents",
  },
  {
    id: "7",
    title: "Spent time",
  },
];

export const STATUS_TASK_OPTIONS = [
  { label: "New", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Pending", value: 7 },
  { label: "Feedback", value: 4 },
  { label: "Resolved", value: 3 },
  { label: "Build", value: 9 },
  { label: "Closed", value: 5 },
  { label: "Rejected", value: 6 },
  { label: "Release OK ", value: 9 },
  { label: "Done STG", value: 11 },
  { label: "Release Honban (Done Honban)", value: 12 },
];

export const STATUS_BUG_OPTIONS = [
  { label: "New", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Reviewing", value: 10 },
  { label: "Feedback", value: 4 },
  { label: "Resolved", value: 3 },
  { label: "Build", value: 9 },
  { label: "Closed", value: 5 },
  { label: "Can't fix", value: 17 },
  { label: "Next Release", value: 7 },
  { label: "Watching", value: 8 },
  { label: "Release OK ", value: 9 },
  { label: "Done STG", value: 11 },
  { label: "Release Honban (Done Honban)", value: 12 },
];

export const TRACKER_OPTIONS = [
  { label: "Bug", value: 1 },
  { label: "Task", value: 4 },
];

export const PERCENT_DONE_OPTIONS = [
  { label: "0%", value: 0 },
  { label: "10%", value: 10 },
  { label: "20%", value: 20 },
  { label: "30%", value: 30 },
  { label: "40%", value: 40 },
  { label: "50%", value: 50 },
  { label: "60%", value: 60 },
  { label: "70%", value: 70 },
  { label: "80%", value: 80 },
  { label: "90%", value: 90 },
  { label: "100%", value: 100 },
];

export const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Normal", value: 2 },
  { label: "High", value: 3 },
  { label: "Urgent", value: 4 },
  { label: "Immediate", value: 5 },
];

export const BUG_TYPE_OPTIONS = [
  { label: "GUI", value: "GUI" },
  { label: "Function", value: "Function" },
  { label: "Non-function", value: "Non-function" },
  { label: "Others", value: "Others" },
];

export const SEVERITY_OPTIONS = [
  { label: "Critical", value: "Critical" },
  { label: "Major", value: "Major" },
  { label: "Moderate", value: "Moderate" },
  { label: "Minor", value: "Minor" },
  { label: "Cosmetic", value: "Cosmetic" },
];

export const QC_ACTIVITY_OPTIONS = [
  { label: "Code Review", value: "Code Review" },
  { label: "Unit test", value: "Unit test" },
  { label: "Integration test", value: "Integration test" },
  { label: "System test", value: "System test" },
  { label: "Document Review", value: "Document Review" },
  { label: "Acceptance Review", value: "Acceptance Review" },
  { label: "Acceptance Test", value: "Acceptance Test" },
  { label: "Other Review", value: "Other Review" },
  { label: "Other Test", value: "Other Test" },
];

export const CAUSE_CATEGORY_OPTIONS = [
  { label: "1.1. REQ_Missing or incomplete", value: "1.1. REQ_Missing or incomplete" },
  { label: "2.1. DES_Missing or incomplete", value: "2.1. DES_Missing or incomplete" },
  { label: "3.1. PRO_Missing or Incomplete", value: "3.1. PRO_Missing or Incomplete" },
  { label: "4.1. IMP_Discipline/Process non-compliance", value: "4.1. IMP_Discipline/Process non-compliance" },
  { label: "4.2. IMP_Insuffcient analysis before implementation", value: "4.2. IMP_Insuffcient analysis before implementation" },
  { label: "4.3. IMP_Shortage of time", value: "4.3. IMP_Shortage of time" },
  { label: "4.5. IMP_Lack of testing", value: "4.5. IMP_Lack of testing" },
  { label: "5.1. COM_Missing communication", value: "5.1. COM_Missing communication" },
  { label: "5.2. COM_Missing confirmation", value: "5.2. COM_Missing confirmation" },
  { label: "6.1. SKI_Inadequate language proficiency", value: "6.1. SKI_Inadequate language proficiency" },
  { label: "6.2. SKI_Shortage of business domain expertise", value: "6.2. SKI_Shortage of business domain expertise" },
  { label: "8. Inconsistency in document or design", value: "8. Inconsistency in document or design" },
  { label: "9. Other", value: "9. Other" },
];

export const DEGRADE_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const OPTIONS_ACTIVITY = [
  { value: 8, label: "Create" },
  { value: 9, label: "Review" },
  { value: 16, label: "Correct" },
  { value: 15, label: "Study" },
  { value: 14, label: "Test" },
  { value: 17, label: "Translate" },
  { value: 26, label: "Verify" },
  { value: 27, label: "Re-test" },
  { value: 28, label: "Regression test" },
  { value: 29, label: "Meeting" },
  { value: 31, label: "Selftest" },
  { value: 32, label: "Report" },
];

export const OPTIONS_CATEGORY = [
  { value: "Requirement / SRS", label: "Requirement / SRS" },
  { value: "Estimation", label: "Estimation" },
  { value: "Plan / Schedule", label: "Plan / Schedule" },
  { value: "Report", label: "Report" },
  { value: "Basic Design", label: "Basic Design" },
  { value: "Detail Design", label: "Detail Design" },
  { value: "Code", label: "Code" },
  { value: "UT Case", label: "UT Case" },
  { value: "IT Viewpoint / Case", label: "IT Viewpoint / Case" },
  { value: "IT Report", label: "IT Report" },
  { value: "ST Viewpoint/Case", label: "ST Viewpoint/Case" },
  { value: "ST Report", label: "ST Report" },
  { value: "Test estimation", label: "Test estimation" },
  { value: "Test Plan/Schedule", label: "Test Plan/Schedule" },
  { value: "Bug list", label: "Bug list" },
  { value: "Other", label: "Other" },
];

export const statusOptionsNewIssue = [
  { label: "New", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Resolved", value: 3 },
  { label: "Feedback", value: 4 },
  { label: "Closed", value: 5 },
  { label: "Can't fix", value: 6 },
  { label: "Next Release", value: 7 },
  { label: "Watching", value: 8 },
  { label: "Release OK ", value: 9 },
  { label: "Task", value: 10 },
  { label: "Done STG", value: 11 },
  { label: "Release Honban (Done Honban)", value: 12 },
];
