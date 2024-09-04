import axios, { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import ArrowLeftIcon from "~/assets/images/arrow_left.png";
import ArrowRightIcon from "~/assets/images/arrow_right.png";
import DiamondIcon from "~/assets/images/bullet_diamond.png";
import HttpStatusCode from "~/constants/httpStatusCode.enum";
import { GroupedIssueByDay, Issue } from "~/types/issue.type";
import { GroupedTimeEntries, TimeEntriesTable } from "~/types/timeEntries.type";
import { Block, BoardSections, BoardSections as BoardSectionsType, ErrorResponse } from "~/types/utils.type";

/**
 * Combines multiple class names into a single string.
 *
 * @param inputs - The class names to be combined.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the given error is an AxiosError.
 * @param error - The error to check.
 * @returns True if the error is an AxiosError, false otherwise.
 */
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

/**
 * Checks if the given error is an AxiosError with a response status of UnprocessableEntity.
 * @param error - The error to check.
 * @returns True if the error is an AxiosError with a response status of UnprocessableEntity, false otherwise.
 */
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

/**
 * Checks if the given error is an Axios unauthorized error.
 * @param error - The error to check.
 * @returns True if the error is an Axios unauthorized error, false otherwise.
 */
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

/**
 * Checks if the given error is an AxiosError with an expired token.
 * @param error - The error to check.
 * @returns True if the error is an AxiosError with an expired token, false otherwise.
 */
export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) && error.response?.data?.data?.name === "EXPIRED_TOKEN";
}

/**
 * Retrieves a task from an array of tasks based on its ID.
 * @param tasks - The array of tasks to search in.
 * @param id - The ID of the task to retrieve.
 * @returns The task object with the specified ID, or undefined if not found.
 */
export const getTaskById = (tasks: Block[], id: string): Block | undefined => {
  return tasks.find((task) => task.id === id);
};

/**
 * Calculates the week number of a given date.
 * @param d - The date for which to calculate the week number.
 * @returns An array containing the year and week number.
 */
export function getWeekNumber(d: Date): number[] {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / (60 * 60 * 24 * 1000) + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
}

export function getFullWeeksOfMonth(month: number, year: number = moment().year()): string[][] {
  const weeks: string[][] = [];
  const startOfMonth = moment({ year, month: month - 1, day: 1 });
  const endOfMonth = startOfMonth.clone().endOf("month");

  let currentWeek = startOfMonth.clone().startOf("week");

  while (currentWeek.isBefore(endOfMonth) || currentWeek.isSame(endOfMonth, "week")) {
    const week: string[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(currentWeek.clone().add(i, "day").format("YYYY-MM-DD"));
    }

    weeks.push(week);
    currentWeek.add(1, "week");
  }

  while (weeks.length < 5) {
    const lastWeek = weeks[weeks.length - 1];
    const nextWeek = lastWeek[lastWeek.length - 1];
    const nextWeekStart = moment(nextWeek).add(1, "day").startOf("week");
    const week: string[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(nextWeekStart.clone().add(i, "day").format("YYYY-MM-DD"));
    }

    weeks.push(week);
  }

  return weeks;
}

export function getDateMonth(monthNumber: number, year: number = new Date().getFullYear()): string[] {
  const dates: string[] = [];

  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Invalid month. Please enter a value from 1 to 12.");
  }

  const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
  const lastDayOfMonth = new Date(year, monthNumber, 0);

  for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
    const currentDate = new Date(year, monthNumber - 1, day);
    const currentYear = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayString = String(currentDate.getDate()).padStart(2, "0");
    dates.push(`${currentYear}-${month}-${dayString}`);
  }

  return dates;
}

/**
 * Checks the status of a date based on the given start date, due date, and day.
 * @param startDate - The start date (optional).
 * @param dueDate - The due date (optional).
 * @param day - The day to check.
 * @returns The status of the date as a string.
 */
export function checkDateStatus({ startDate, dueDate, day }: { startDate: string | undefined; dueDate: string | undefined; day: string }): string {
  if (!startDate && !dueDate) {
    return ArrowRightIcon;
  }

  if (!startDate && !!dueDate) {
    const date = new Date(dueDate).getDate();
    if (date === +day) {
      return ArrowLeftIcon;
    }
  }

  if (!!startDate && !dueDate) {
    const date = new Date(startDate).getDate();
    if (date === +day) {
      return ArrowRightIcon;
    }
  }

  if (!!startDate && !!dueDate) {
    const start = new Date(startDate).getDate();
    const due = new Date(dueDate).getDate();

    if (start !== due && start === +day) {
      return ArrowRightIcon;
    } else if (start !== due && due === +day) {
      return ArrowLeftIcon;
    } else if (start === due && due === +day) {
      return DiamondIcon;
    }
  }

  return ArrowRightIcon;
}

/**
 * Returns an array of dates representing the days of a given week number in the current year.
 * @param weekNumber - The week number.
 * @returns An array of strings representing the dates in the format "YYYY-MM-DD".
 */
export function getWeekDates(weekNumber: number, year: number = new Date().getFullYear()): string[] {
  const dates: string[] = [];

  // Determine the first day of the year and the first Monday of the year
  const firstDayOfYear = new Date(year, 0, 1);
  let firstMondayOfYear = new Date(firstDayOfYear);

  // Adjust to the first Monday of the year
  while (firstMondayOfYear.getDay() !== 1) {
    firstMondayOfYear.setDate(firstMondayOfYear.getDate() + 1);
  }

  // Calculate the start date of the week based on the week number
  const startOfWeek = new Date(firstMondayOfYear);
  startOfWeek.setDate(firstMondayOfYear.getDate() + (weekNumber - 1) * 7);

  // Ensure that the week number is not 0 and does not exceed the number of weeks in the year
  if (weekNumber <= 0) {
    return [];
  }

  // Generate an array of dates for the week
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

/**
 * Groups tasks by exact date.
 * @param tasks - The array of tasks to be grouped.
 * @param dates - The array of dates to group the tasks by.
 * @returns An array of objects representing the grouped tasks by day.
 */
export function groupTasksByExactDate(tasks: Issue[], dates: string[]): GroupedIssueByDay[] {
  const result = dates.map((date) => {
    const day = new Date(date).getDate();
    // console.log("day", day);
    const tasksForDate = tasks.filter((task) => {
      const startDate = task.start_date === date;
      const dueDate = task.due_date === date;
      return startDate || dueDate;
    });
    // console.log(day, tasksForDate);
    return {
      [day]: tasksForDate,
    };
  });
  // console.log(result);
  return result;
}

/**
 * Gets the current day as a string.
 * @returns The current day as a string.
 */
export function getDay(): string {
  const today = new Date();
  const day = String(today.getDate());
  return day;
}

/**
 * Converts a date string from the format "YYYY-MM-DD" to "MM/DD/YYYY".
 * @param dateString - The date string to be converted.
 * @returns The converted date string.
 */
export function convertDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split("-");

  // Validate input format
  if (!year || !month || !day || year.length !== 4 || month.length !== 2 || day.length !== 2) {
    return "Invalid Date";
  }

  return `${month}/${day}/${year}`;
}

/**
 * Calculates the time difference between the current date and the provided ISO date string.
 * @param isoDateString - The ISO date string to calculate the time difference from.
 * @returns A string representing the time difference in a human-readable format.
 */
export function getSecondsDifference(isoDateString: string | undefined): string {
  if (typeof isoDateString === "undefined") {
    return "";
  }

  const inputDate = new Date(isoDateString);

  // Check if the date is invalid
  if (isNaN(inputDate.getTime())) {
    return "Invalid date";
  }

  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  if (differenceInSeconds < 60) {
    return "less than a minute";
  } else if (differenceInSeconds < 3600) {
    return `${Math.round(differenceInSeconds / 60)} minute${Math.round(differenceInSeconds / 60) > 1 ? "s" : ""}`;
  } else if (differenceInSeconds < 86400) {
    return `${Math.round(differenceInSeconds / 3600)} hour${Math.round(differenceInSeconds / 3600) > 1 ? "s" : ""}`;
  } else if (differenceInSeconds < 2592000) {
    return `${Math.round(differenceInSeconds / 86400)} day${Math.round(differenceInSeconds / 86400) > 1 ? "s" : ""}`;
  } else if (differenceInSeconds < 31104000) {
    return `${Math.round(differenceInSeconds / 2592000)} month${Math.round(differenceInSeconds / 2592000) > 1 ? "s" : ""}`;
  } else {
    return `${Math.round(differenceInSeconds / 31104000)} year${Math.round(differenceInSeconds / 31104000) > 1 ? "s" : ""}`;
  }
}

/**
 * Retrieves data from the local storage and parses it as JSON.
 *
 * @param key The key of the data in local storage.
 * @returns The parsed data, or null if the data is invalid or not found.
 */
export const getDataFromLS = (key: string): any | null => {
  const data = localStorage.getItem(key);
  let parsedData: any | null = null;

  try {
    parsedData = JSON.parse(data || "{}");
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    return null;
  }

  return parsedData;
};

/**
 * Retrieves the board sections from the local storage.
 *
 * @returns A record containing the board sections, or null if the data is invalid or not found.
 */
export const getBoardSectionsFromLS = (): Record<string, Block[]> | null => {
  const boardSections = getDataFromLS("boardSections");

  const isValid = isValidBoardSections(boardSections);
  return isValid ? boardSections : null;
};

/**
 * Sets the board sections in the local storage.
 * @param boardSections - The board sections to be stored.
 */
export const setBoardSectionsFromLS = (boardSections: BoardSectionsType) => {
  localStorage.setItem("boardSections", JSON.stringify(boardSections));
};

/**
 * Adds a block to the board sections.
 * @param {Object} options - The options for adding the block.
 * @param {Block} options.block - The block to be added.
 * @param {string} options.boardId - The ID of the board.
 */
export const addBlockToBoardSections = ({ block, boardId }: { block: Block; boardId: string }) => {
  const boardSections = getDataFromLS("boardSections") || {};
  const newBoardSections = { ...boardSections };
  if (!newBoardSections[boardId]) {
    newBoardSections[boardId] = [block];
  } else {
    newBoardSections[boardId] = [block, ...newBoardSections[boardId]];
  }
  setBoardSectionsFromLS(newBoardSections);
};

/**
 * Removes a block from the board sections.
 * @param {Object} params - The parameters for removing the block.
 * @param {string} params.blockId - The ID of the block to be removed.
 */
export const removeBlockFromBoardSections = ({ blockId }: { blockId: string }) => {
  const boardSections = getDataFromLS("boardSections") || {};
  const newBoardSections = { ...boardSections };
  Object.keys(newBoardSections).forEach((boardId) => {
    newBoardSections[boardId] = newBoardSections[boardId].filter((block: Block) => block.id !== blockId);
  });
  setBoardSectionsFromLS(newBoardSections);
};

/**
 * Checks if the given object is a valid BoardSections object.
 * @param obj - The object to be checked.
 * @returns True if the object is a valid BoardSections object, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidBoardSections = (obj: any): obj is BoardSections => {
  const keys = ["Board-1", "Board-2", "Board-3"];

  // Check if the board sections object is an object and has exactly 3 keys
  if (typeof obj !== "object" || obj === null || Object.keys(obj).length !== 3) {
    return false;
  }

  // Check if the key exists in obj and is an array of Block objects
  return keys.every(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key) => key in obj && Array.isArray(obj[key]) && obj[key].every((item: any) => typeof item.id === "string" && typeof item.title === "string"),
  );
};

/**
 * Groups an array of time entries by date and calculates the total hours for each date.
 *
 * @param entries - An array of time entries.
 * @returns An array of grouped time entries, where each entry contains the date, an array of entries for that date, and the total hours for that date.
 */
export const groupTimeEntriesByDate = (entries: TimeEntriesTable[]): GroupedTimeEntries[] => {
  const groupedEntries: { [key: string]: GroupedTimeEntries } = {};

  entries.forEach((entry) => {
    const date = entry.date;
    if (!groupedEntries[date]) {
      groupedEntries[date] = { date, entries: [], totalHours: 0 };
    }
    groupedEntries[date].entries.push(entry);
    groupedEntries[date].totalHours += entry.hours;
  });

  return Object.values(groupedEntries);
};

export const handleFormatTime = (time: string): string => {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh",
  };
  const timeString = date.toLocaleString("en-US", options);
  return timeString;
};

export const handleFormatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  };
  return date.toLocaleDateString("en-US", options);
};

export const convertMDtoElement = (text: string): string => {
  const lines = text.split("\n");
  const array: string[] = [];
  lines.forEach((line) => {
    const newLine = handleConvert(line);
    array.push(newLine);
  });
  return array.join("\n");
};

export const handleConvert = (text: string): string => {
  if (text.startsWith("h3. ")) {
    return `<h3 class="text-[14px]">${text.replace("h3. ", "")}</h3>\n`;
  } else if (text.startsWith("h2. ")) {
    return `<h2 class="text-[16px]">${text.replace("h2. ", "")}</h2>\n`;
  } else if (text.startsWith("h1. ")) {
    return `<h1 class="text-[20px]">${text.replace("h1. ", "")}</h1>\n`;
  } else if (text.includes("!")) {
    return text.replace(/!(.*?)!/g, '<div><img src="$1"/></div>');
  } else if (text.includes("[[") && text.includes("]]")) {
    return `<div>${text.replace(/\[\[(.*?)\]\]/g, '<a href="/projects/fresher-_-reactjs-fresher/wiki/$1" class="link">$1</a>')}</div>`;
  } else if (text.includes("> ")) {
    return `<blockquote class="italic border-l-2 border-[#e0e0e0] ml-2 pl-1">${text.replace("> ", "")}</blockquote>\n`;
  } else if (text.includes("*")) {
    return `<div>${text.replace(/\*(.*?)\*/g, '<bold class="font-bold">$1</bold>\n')}</div>`;
  } else if (text.includes("_")) {
    return `<div>${text.replace(/\_(.*?)\_/g, '<span class="italic">$1</span>\n')}</div>`;
  } else if (text.includes("+")) {
    return `<div>${text.replace(/\+(.*?)\+/g, '<span class="underline">$1</span>\n')}</div>`;
  } else if (text.includes("<pre>") || text.includes("</pre>")) {
    return text;
  } else {
    return `<div>${text}</div>\n`;
  }
};
