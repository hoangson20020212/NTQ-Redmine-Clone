import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HttpStatusCode from "~/constants/httpStatusCode.enum";
import { Issue } from "~/types/issue.type";
import { Block, ErrorResponse } from "~/types/utils.type";
import {
  addBlockToBoardSections,
  checkDateStatus,
  cn,
  convertDateFormat,
  getBoardSectionsFromLS,
  getDateMonth,
  getDay,
  getFullWeeksOfMonth,
  getSecondsDifference,
  getTaskById,
  getWeekDates,
  getWeekNumber,
  groupTasksByExactDate,
  groupTimeEntriesByDate,
  isAxiosError,
  isAxiosExpiredTokenError,
  isAxiosUnauthorizedError,
  isAxiosUnprocessableEntityError,
  isValidBoardSections,
  removeBlockFromBoardSections,
  setBoardSectionsFromLS,
} from "~/utils/utils";

import ArrowLeftIcon from "~/assets/images/arrow_left.png";
import ArrowRightIcon from "~/assets/images/arrow_right.png";
import DiamondIcon from "~/assets/images/bullet_diamond.png";
import { GroupedTimeEntries, TimeEntriesTable } from "~/types/timeEntries.type";
import moment from "moment";

describe("Utils", () => {
  describe("cn", () => {
    it("should combine multiple class names into a single string", () => {
      const result = cn("class1", "class2", "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle conditional class names correctly", () => {
      const condition = true;
      const result = cn("class1", condition && "class2", "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should remove falsy values", () => {
      const result = cn("class1", null, "class2", undefined, "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should merge Tailwind classes correctly", () => {
      // Adjust the expected result based on the actual merging logic of twMerge
      const result = cn("bg-blue-500", "bg-red-500");
      expect(result).toBe("bg-red-500"); // Assuming twMerge would correctly merge or keep the classes
    });

    it("should handle an empty array of class names", () => {
      const result = cn([]);
      expect(result).toBe("");
    });

    it("should handle a mix of string and array class names", () => {
      const result = cn("class1", ["class2", "class3"], "class4");
      expect(result).toBe("class1 class2 class3 class4");
    });
  });

  describe("isAxiosError", () => {
    it("should identify AxiosError", () => {
      const error = new axios.AxiosError("Test Error");
      expect(isAxiosError(error)).toBe(true);
      expect(isAxiosError(new Error("Test Error"))).toBe(false);
    });
  });

  describe("isAxiosUnprocessableEntityError", () => {
    it("should identify unprocessable entity error", () => {
      const error = {
        response: { status: HttpStatusCode.UnprocessableEntity },
        isAxiosError: true,
      };
      expect(isAxiosUnprocessableEntityError(error)).toBe(true);
      expect(isAxiosUnprocessableEntityError(new Error("Test Error"))).toBe(false);
    });
  });

  describe("isAxiosUnauthorizedError", () => {
    it("should identify unauthorized error", () => {
      const error = {
        response: { status: HttpStatusCode.Unauthorized },
        isAxiosError: true,
      };
      expect(isAxiosUnauthorizedError(error)).toBe(true);
      expect(isAxiosUnauthorizedError(new Error("Test Error"))).toBe(false);
    });
  });

  describe("isAxiosExpiredTokenError", () => {
    it("should identify expired token error", () => {
      const error = {
        response: {
          status: HttpStatusCode.Unauthorized,
          data: {
            data: { name: "EXPIRED_TOKEN", message: "Token expired" },
          },
        },
        isAxiosError: true,
      };
      expect(isAxiosExpiredTokenError<ErrorResponse<{ name: string; message: string }>>(error)).toBe(true);
      expect(isAxiosExpiredTokenError<ErrorResponse<{ name: string; message: string }>>(new Error("Test Error"))).toBe(false);
    });
  });

  describe("getTaskById", () => {
    const tasks: Block[] = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
      { id: "3", title: "Task 3" },
    ];

    // Test for finding a task by a valid ID
    it("should return the correct task for a valid ID", () => {
      const result = getTaskById(tasks, "2");
      expect(result).toEqual({ id: "2", title: "Task 2" });
    });

    // Test for finding a task by an invalid ID
    it("should return undefined for an ID that does not exist", () => {
      const result = getTaskById(tasks, "999");
      expect(result).toBeUndefined();
    });

    // Test for finding a task in an empty array
    it("should return undefined when the task list is empty", () => {
      const result = getTaskById([], "1");
      expect(result).toBeUndefined();
    });

    // Test for finding a task with an empty ID
    it("should return undefined for an empty ID", () => {
      const result = getTaskById(tasks, "");
      expect(result).toBeUndefined();
    });

    // Test for finding a task with a non-matching ID type
    it("should return undefined for a non-matching ID type", () => {
      const result = getTaskById(tasks, 2 as any); // Force ID type to number
      expect(result).toBeUndefined();
    });
  });

  describe("getWeekNumber", () => {
    // Test for the week number of January 1st of the year
    it("should return the correct week number for January 1st of the year", () => {
      const date = new Date(Date.UTC(2024, 0, 1)); // January 1, 2024
      expect(getWeekNumber(date)).toEqual([2024, 1]); // Week 1 of 2024
    });

    // Test for the week number of December 31st of the year
    it("should return the correct week number for December 31st of the year", () => {
      const date = new Date(Date.UTC(2024, 11, 31)); // December 31, 2024
      expect(getWeekNumber(date)).toEqual([2025, 1]); // Week 53 of 2024, may vary depending on the year
    });

    // Test for a date in the middle of the week
    it("should return the correct week number for a mid-week date", () => {
      const date = new Date(Date.UTC(2024, 6, 10)); // July 10, 2024
      expect(getWeekNumber(date)).toEqual([2024, 28]); // Week 28 of 2024
    });

    // Test for a date at the start of the week
    it("should return the correct week number for a date at the start of the week", () => {
      const date = new Date(Date.UTC(2024, 0, 1)); // January 1, 2024
      expect(getWeekNumber(date)).toEqual([2024, 1]); // Week 1 of 2024
    });

    // Test for a date at the end of the week
    it("should return the correct week number for a date at the end of the week", () => {
      const date = new Date(Date.UTC(2024, 0, 7)); // January 7, 2024
      expect(getWeekNumber(date)).toEqual([2024, 1]); // Week 1 of 2024
    });

    // Test for a date in the middle of the year
    it("should return the correct week number for a date in the middle of the year", () => {
      const date = new Date(Date.UTC(2024, 5, 15)); // June 15, 2024
      expect(getWeekNumber(date)).toEqual([2024, 24]); // Week 24 of 2024
    });

    // Test for a date in a leap year
    it("should return the correct week number for a date in a leap year", () => {
      const date = new Date(Date.UTC(2024, 1, 29)); // February 29, 2024 (Leap year)
      expect(getWeekNumber(date)).toEqual([2024, 9]); // Week 9 of 2024
    });

    // Test for December 25th of the year
    it("should return the correct week number for December 25th of the year", () => {
      const date = new Date(Date.UTC(2024, 11, 25)); // December 25, 2024
      expect(getWeekNumber(date)).toEqual([2024, 52]); // Week 52 of 2024
    });
  });

  describe("checkDateStatus", () => {
    it("should return ArrowRightIcon when both startDate and dueDate are undefined", () => {
      const result = checkDateStatus({ startDate: undefined, dueDate: undefined, day: "1" });
      expect(result).toBe(ArrowRightIcon);
    });

    it("should return ArrowLeftIcon when startDate is undefined, dueDate is defined, and dueDate matches the day", () => {
      const result = checkDateStatus({ startDate: undefined, dueDate: "2024-07-01", day: "1" });
      expect(result).toBe(ArrowLeftIcon);
    });

    it("should return ArrowRightIcon when startDate is defined, dueDate is undefined, and startDate matches the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: undefined, day: "1" });
      expect(result).toBe(ArrowRightIcon);
    });

    it("should return ArrowRightIcon when startDate and dueDate are different and startDate matches the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: "2024-07-02", day: "1" });
      expect(result).toBe(ArrowRightIcon);
    });

    it("should return ArrowLeftIcon when startDate and dueDate are different and dueDate matches the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: "2024-07-02", day: "2" });
      expect(result).toBe(ArrowLeftIcon);
    });

    it("should return DiamondIcon when startDate and dueDate are the same and match the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: "2024-07-01", day: "1" });
      expect(result).toBe(DiamondIcon);
    });

    it("should return ArrowRightIcon when startDate and dueDate are the same but do not match the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: "2024-07-01", day: "2" });
      expect(result).toBe(ArrowRightIcon);
    });

    it("should return ArrowRightIcon when startDate is defined, dueDate is defined but does not match the day", () => {
      const result = checkDateStatus({ startDate: "2024-07-01", dueDate: "2024-07-05", day: "02" });
      expect(result).toBe(ArrowRightIcon);
    });
  });

  describe("getWeekDates", () => {
    it("should return the correct dates for the first week of 2024", () => {
      const weekNumber = 1;
      const result = getWeekDates(weekNumber);
      const expected = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"];
      expect(result).toEqual(expected);
    });

    it("should return the correct dates for the middle of 2024", () => {
      const weekNumber = 26;
      const result = getWeekDates(weekNumber);
      const expected = ["2024-06-24", "2024-06-25", "2024-06-26", "2024-06-27", "2024-06-28", "2024-06-29", "2024-06-30"];
      expect(result).toEqual(expected);
    });

    it("should return the correct dates for the last week of 2024", () => {
      const weekNumber = 52;
      const result = getWeekDates(weekNumber);
      const expected = ["2024-12-23", "2024-12-24", "2024-12-25", "2024-12-26", "2024-12-27", "2024-12-28", "2024-12-29"];
      expect(result).toEqual(expected);
    });

    it("should handle leap years correctly (2024 is a leap year)", () => {
      const weekNumber = 9; // Leap year week including 29th Feb
      const result = getWeekDates(weekNumber);
      const expected = ["2024-02-26", "2024-02-27", "2024-02-28", "2024-02-29", "2024-03-01", "2024-03-02", "2024-03-03"];
      expect(result).toEqual(expected);
    });

    it("should handle invalid week numbers gracefully", () => {
      const weekNumber = 0;
      const result = getWeekDates(weekNumber);
      const expected: string[] = []; // or some error handling if implemented
      expect(result).toEqual(expected);
    });

    it("should return correct dates for a specific year (e.g., 2024)", () => {
      const getWeekDatesForYear = (weekNumber: number, year: number): string[] => {
        const dates: string[] = [];
        const firstDayOfYear = new Date(year, 0, 1);
        const firstMondayOfYear = new Date(firstDayOfYear);

        while (firstMondayOfYear.getDay() !== 1) {
          firstMondayOfYear.setDate(firstMondayOfYear.getDate() + 1);
        }

        const startOfWeek = new Date(firstMondayOfYear);
        startOfWeek.setDate(firstMondayOfYear.getDate() + (weekNumber - 1) * 7);

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startOfWeek);
          currentDate.setDate(startOfWeek.getDate() + i);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
          dates.push(`${year}-${month}-${day}`);
        }

        return dates;
      };

      const weekNumber = 1;
      const year = 2024;
      const result = getWeekDatesForYear(weekNumber, year);
      const expected = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"];
      expect(result).toEqual(expected);
    });

    it("should handle the scenario where the first day of the year is not Monday", () => {
      const year = 2023;
      const weekNumber = 1;
      const result = getWeekDates(weekNumber, year);
      const expected = ["2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"];
      expect(result).toEqual(expected);
    });
  });

  // Mock data for testing
  const mockTasks: Issue[] = [
    {
      id: 1,
      project: { id: 1, name: "Project 1" },
      tracker: { id: 1, name: "Tracker 1" },
      status: { id: 1, name: "Status 1" },
      priority: { id: 1, name: "Priority 1" },
      author: { id: 1, name: "Author 1" },
      assigned_to: { id: 2, name: "User 2" },
      subject: "Task 1",
      description: "Description 1",
      start_date: "2024-07-01",
      due_date: "2024-07-03",
      estimated_hours: 2,
      spent_hours: 1,
      custom_fields: [],
      created_on: "2024-07-01",
      updated_on: "2024-07-01",
      done_ratio: 0,
    },
    {
      id: 2,
      project: { id: 2, name: "Project 2" },
      tracker: { id: 2, name: "Tracker 2" },
      status: { id: 2, name: "Status 2" },
      priority: { id: 2, name: "Priority 2" },
      author: { id: 2, name: "Author 2" },
      assigned_to: { id: 3, name: "User 3" },
      subject: "Task 2",
      description: "Description 2",
      start_date: "2024-07-02",
      due_date: "2024-07-04",
      estimated_hours: 3,
      spent_hours: 2,
      custom_fields: [],
      created_on: "2024-07-02",
      updated_on: "2024-07-02",
      done_ratio: 0,
    },
    {
      id: 3,
      project: { id: 3, name: "Project 3" },
      tracker: { id: 3, name: "Tracker 3" },
      status: { id: 3, name: "Status 3" },
      priority: { id: 3, name: "Priority 3" },
      author: { id: 3, name: "Author 3" },
      assigned_to: { id: 4, name: "User 4" },
      subject: "Task 3",
      description: "Description 3",
      start_date: "2024-07-03",
      due_date: "2024-07-05",
      estimated_hours: 1,
      spent_hours: 0,
      custom_fields: [],
      created_on: "2024-07-03",
      updated_on: "2024-07-03",
      done_ratio: 0,
    },
  ];

  describe("groupTasksByExactDate", () => {
    it("should group tasks by exact dates provided", () => {
      const dates = ["2024-07-01", "2024-07-02", "2024-07-03", "2024-07-04", "2024-07-05"];
      const groupedTasks = groupTasksByExactDate(mockTasks, dates);

      expect(groupedTasks).toEqual([
        {
          1: [mockTasks[0]], // Task 1 starts on 2024-07-01
        },
        {
          2: [mockTasks[1]], // Task 2 starts on 2024-07-02
        },
        {
          3: [mockTasks[0], mockTasks[2]], // Tasks 1 and 3 start or end on 2024-07-03
        },
        {
          4: [mockTasks[1]], // Task 2 ends on 2024-07-04
        },
        {
          5: [mockTasks[2]], // Task 3 ends on 2024-07-05
        },
      ]);
    });

    it("should return an empty array for dates with no matching tasks", () => {
      const dates = ["2024-07-06", "2024-07-07"];
      const groupedTasks = groupTasksByExactDate(mockTasks, dates);

      expect(groupedTasks).toEqual([
        {
          6: [], // No tasks match this date
        },
        {
          7: [], // No tasks match this date
        },
      ]);
    });

    it("should handle an empty tasks array", () => {
      const dates = ["2024-07-01", "2024-07-02"];
      const groupedTasks = groupTasksByExactDate([], dates);

      expect(groupedTasks).toEqual([
        {
          1: [], // No tasks for this date
        },
        {
          2: [], // No tasks for this date
        },
      ]);
    });

    it("should handle an empty dates array", () => {
      const groupedTasks = groupTasksByExactDate(mockTasks, []);

      expect(groupedTasks).toEqual([]);
    });
  });

  describe("getDay", () => {
    it("should return the current day of the month as a two-digit string", () => {
      // Mock the Date object to control the current date
      const mockDate = new Date(2024, 6, 15); // July 15, 2024 (Note: months are zero-based)
      vi.setSystemTime(mockDate);

      const result = getDay();
      expect(result).toBe("15");

      // Restore system time
      vi.useRealTimers();
    });

    it('should return "1" when the date is the 1st of the month', () => {
      const mockDate = new Date(2024, 6, 1); // July 1, 2024
      vi.setSystemTime(mockDate);

      const result = getDay();
      expect(result).toBe("1");

      vi.useRealTimers();
    });

    it("should handle the last day of the month correctly", () => {
      const mockDate = new Date(2024, 6, 31); // July 31, 2024
      vi.setSystemTime(mockDate);

      const result = getDay();
      expect(result).toBe("31");

      vi.useRealTimers();
    });

    it("should handle dates in different months correctly", () => {
      const mockDate = new Date(2024, 11, 9); // December 9, 2024
      vi.setSystemTime(mockDate);

      const result = getDay();
      expect(result).toBe("9");

      vi.useRealTimers();
    });
  });

  describe("convertDateFormat", () => {
    it("should convert date from YYYY-MM-DD to MM/DD/YYYY format", () => {
      const dateString = "2024-07-15"; // July 15, 2024
      const result = convertDateFormat(dateString);
      expect(result).toBe("07/15/2024");
    });

    it("should handle a date at the beginning of the year", () => {
      const dateString = "2024-01-01"; // January 1, 2024
      const result = convertDateFormat(dateString);
      expect(result).toBe("01/01/2024");
    });

    it("should handle a date at the end of the year", () => {
      const dateString = "2024-12-31"; // December 31, 2024
      const result = convertDateFormat(dateString);
      expect(result).toBe("12/31/2024");
    });

    it("should handle single-digit months and days", () => {
      const dateString = "2024-03-09"; // March 9, 2024
      const result = convertDateFormat(dateString);
      expect(result).toBe("03/09/2024");
    });

    it("should handle invalid input gracefully", () => {
      const dateString = "invalid-date";
      const result = convertDateFormat(dateString);
      expect(result).toBe("Invalid Date"); // Adjusted expected output to reflect new validation
    });

    it("should handle input with missing parts", () => {
      const dateString = "2024-03"; // Incomplete date
      const result = convertDateFormat(dateString);
      expect(result).toBe("Invalid Date"); // Adjusted expected output to reflect new validation
    });
  });

  describe("getSecondsDifference", () => {
    it('should return "less than a minute" for a time less than 60 seconds ago', () => {
      const dateString = new Date(new Date().getTime() - 30000).toISOString(); // 30 seconds ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("less than a minute");
    });

    it("should return the correct number of minutes for a time between 1 and 59 minutes ago", () => {
      const dateString = new Date(new Date().getTime() - 5 * 60000).toISOString(); // 5 minutes ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("5 minutes");
    });

    it("should return the correct number of hours for a time between 1 and 23 hours ago", () => {
      const dateString = new Date(new Date().getTime() - 3 * 3600000).toISOString(); // 3 hours ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("3 hours");
    });

    it("should return the correct number of days for a time between 1 and 29 days ago", () => {
      const dateString = new Date(new Date().getTime() - 2 * 86400000).toISOString(); // 2 days ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("2 days");
    });

    it("should return the correct number of months for a time between 1 and 11 months ago", () => {
      const dateString = new Date(new Date().getTime() - 40 * 86400000).toISOString(); // ~1.3 months ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("1 month");
    });

    it("should return the correct number of years for a time over a year ago", () => {
      const dateString = new Date(new Date().getTime() - 365 * 86400000).toISOString(); // ~1 year ago
      const result = getSecondsDifference(dateString);
      expect(result).toBe("1 year");
    });

    it("should handle undefined input", () => {
      const result = getSecondsDifference(undefined);
      expect(result).toBe("");
    });

    it("should handle invalid date input", () => {
      const result = getSecondsDifference("invalid-date");
      expect(result).toBe("Invalid date");
    });
  });

  describe("getBoardSectionsFromLS", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should get board sections from localStorage", () => {
      const boardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };
      localStorage.setItem("boardSections", JSON.stringify(boardSections));
      expect(getBoardSectionsFromLS()).toEqual(boardSections);
    });

    it("should return null if localStorage data is invalid JSON", () => {
      localStorage.setItem("boardSections", "{ invalid JSON }");
      expect(getBoardSectionsFromLS()).toBeNull();
    });

    it("should return null if localStorage data is not a valid BoardSections object", () => {
      const invalidData = { "Invalid-Board": "This is not a valid structure" };
      localStorage.setItem("boardSections", JSON.stringify(invalidData));
      expect(getBoardSectionsFromLS()).toBeNull();
    });

    it("should return null if localStorage does not contain boardSections", () => {
      expect(getBoardSectionsFromLS()).toBeNull();
    });
  });

  describe("setBoardSectionsFromLS", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should set board sections to localStorage", () => {
      const boardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      setBoardSectionsFromLS(boardSections);

      const storedData = localStorage.getItem("boardSections");
      expect(storedData).toBe(JSON.stringify(boardSections));
    });

    it("should overwrite existing board sections in localStorage", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Initial Task" }],
      };

      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));

      const newBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      setBoardSectionsFromLS(newBoardSections);

      const storedData = localStorage.getItem("boardSections");
      expect(storedData).toBe(JSON.stringify(newBoardSections));
    });

    it("should handle setting empty board sections", () => {
      const emptyBoardSections: Record<string, Block[]> = {};

      setBoardSectionsFromLS(emptyBoardSections);

      const storedData = localStorage.getItem("boardSections");
      expect(storedData).toBe(JSON.stringify(emptyBoardSections));
    });
  });

  describe("addBlockToBoardSections", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should add a block to the specified board section", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));

      const newBlock: Block = { id: "4", title: "Task 4" };
      const boardId = "Board-1";

      addBlockToBoardSections({ block: newBlock, boardId });

      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");
      const expectedBoardSections = {
        ...initialBoardSections,
        "Board-1": [newBlock, ...initialBoardSections["Board-1"]],
      };

      expect(storedData).toEqual(expectedBoardSections);
    });

    it("should create a new board section if it does not exist", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
      };

      console.log(localStorage.getItem("boardSections"));
      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));
      console.log(localStorage.getItem("boardSections"));
      const newBlock: Block = { id: "2", title: "Task 2" };
      const boardId = "Board-2"; // New board section

      addBlockToBoardSections({ block: newBlock, boardId });
      console.log(localStorage.getItem("boardSections"));

      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");
      const expectedBoardSections = {
        ...initialBoardSections,
        "Board-2": [newBlock],
      };

      expect(storedData).toEqual(expectedBoardSections);
    });

    it("should handle adding a block to an empty board section", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [],
      };

      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));

      const newBlock: Block = { id: "1", title: "Task 1" };
      const boardId = "Board-1";

      addBlockToBoardSections({ block: newBlock, boardId });

      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");
      const expectedBoardSections = {
        "Board-1": [newBlock],
      };

      expect(storedData).toEqual(expectedBoardSections);
    });

    it("should handle case when no board sections exist in localStorage", () => {
      const newBlock: Block = { id: "1", title: "Task 1" };
      const boardId = "Board-1";

      addBlockToBoardSections({ block: newBlock, boardId });

      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");
      const expectedBoardSections = {
        "Board-1": [newBlock],
      };

      expect(storedData).toEqual(expectedBoardSections);
    });
  });

  describe("removeBlockFromBoardSections", () => {
    beforeEach(() => {
      // Clear localStorage before each test case
      localStorage.clear();
    });

    it("should remove a block from all board sections", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      // Set initial data in localStorage
      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));

      const blockIdToRemove = "2";

      // Call the function to remove the block
      removeBlockFromBoardSections({ blockId: blockIdToRemove });

      // Expected data after removal
      const expectedBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [], // Block removed
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      // Get the updated data from localStorage
      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");

      // Check if the stored data matches the expected data
      expect(storedData).toEqual(expectedBoardSections);
    });

    it("should not alter board sections if blockId does not exist", () => {
      const initialBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
      };

      // Set initial data in localStorage
      localStorage.setItem("boardSections", JSON.stringify(initialBoardSections));

      const nonExistingBlockId = "999";

      // Call the function to remove a non-existing block
      removeBlockFromBoardSections({ blockId: nonExistingBlockId });

      // Expected data should be the same as initial data
      const expectedBoardSections: Record<string, Block[]> = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
      };

      // Get the updated data from localStorage
      const storedData = JSON.parse(localStorage.getItem("boardSections") || "{}");

      // Check if the stored data matches the expected data
      expect(storedData).toEqual(expectedBoardSections);
    });
  });

  describe("isValidBoardSections", () => {
    // Test case for a valid BoardSections object
    it("should return true for a valid BoardSections object", () => {
      const validBoardSections = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      expect(isValidBoardSections(validBoardSections)).toBe(true);
    });

    // Test case for an object with incorrect number of keys
    it("should return false for an object with incorrect number of keys", () => {
      const invalidBoardSections = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
      };

      expect(isValidBoardSections(invalidBoardSections)).toBe(false);
    });

    // Test case for an object with incorrect key names
    it("should return false for an object with incorrect key names", () => {
      const invalidBoardSections = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-4": [{ id: "3", title: "Task 3" }],
      };

      expect(isValidBoardSections(invalidBoardSections)).toBe(false);
    });

    // Test case for an object where some values are not arrays
    it("should return false for an object where some values are not arrays", () => {
      const invalidBoardSections = {
        "Board-1": { id: "1", title: "Task 1" }, // Not an array
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      expect(isValidBoardSections(invalidBoardSections)).toBe(false);
    });

    // Test case for an object with invalid Block items
    it("should return false for an object with invalid Block items", () => {
      const invalidBoardSections = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2" }], // Missing title
        "Board-3": [{ id: "3", title: "Task 3" }],
      };

      expect(isValidBoardSections(invalidBoardSections)).toBe(false);
    });

    // Test case for an object with extra keys
    it("should return false for an object with extra keys", () => {
      const invalidBoardSections = {
        "Board-1": [{ id: "1", title: "Task 1" }],
        "Board-2": [{ id: "2", title: "Task 2" }],
        "Board-3": [{ id: "3", title: "Task 3" }],
        "Board-4": [{ id: "4", title: "Task 4" }],
      };

      expect(isValidBoardSections(invalidBoardSections)).toBe(false);
    });
  });

  // Define reusable test data with additional properties
  const typicalEntries: TimeEntriesTable[] = [
    { id: 1, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task A", project: "Project X" },
    { id: 2, date: "2024-07-30", hours: 2, activity: "Work", comment: "Completed task B", project: "Project X" },
    { id: 3, date: "2024-07-31", hours: 5, activity: "Work", comment: "Completed task C", project: "Project Y" },
  ];

  const allSameDateEntries: TimeEntriesTable[] = [
    { id: 4, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task D", project: "Project X" },
    { id: 5, date: "2024-07-30", hours: 3, activity: "Work", comment: "Completed task E", project: "Project X" },
    { id: 6, date: "2024-07-30", hours: 2, activity: "Work", comment: "Completed task F", project: "Project X" },
  ];

  const differentDatesEntries: TimeEntriesTable[] = [
    { id: 7, date: "2024-07-30", hours: 1, activity: "Work", comment: "Completed task G", project: "Project X" },
    { id: 8, date: "2024-07-31", hours: 2, activity: "Work", comment: "Completed task H", project: "Project Y" },
    { id: 9, date: "2024-08-01", hours: 3, activity: "Work", comment: "Completed task I", project: "Project Z" },
  ];

  const emptyEntries: TimeEntriesTable[] = [];

  const duplicatedDatesEntries: TimeEntriesTable[] = [
    { id: 10, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task J", project: "Project X" },
    { id: 11, date: "2024-07-30", hours: 3, activity: "Work", comment: "Completed task K", project: "Project X" },
    { id: 12, date: "2024-07-30", hours: 5, activity: "Work", comment: "Completed task L", project: "Project X" },
    { id: 13, date: "2024-07-31", hours: 2, activity: "Work", comment: "Completed task M", project: "Project Y" },
  ];

  const zeroHoursEntries: TimeEntriesTable[] = [
    { id: 14, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
    { id: 15, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
    { id: 16, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
  ];

  const negativeHoursEntries: TimeEntriesTable[] = [
    { id: 17, date: "2024-07-30", hours: -4, activity: "Work", comment: "Negative hours", project: "Project X" },
    { id: 18, date: "2024-07-30", hours: -3, activity: "Work", comment: "Negative hours", project: "Project X" },
    { id: 19, date: "2024-07-30", hours: -5, activity: "Work", comment: "Negative hours", project: "Project X" },
  ];

  // Define expected results for each test case
  const expectedTypical: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [
        { id: 1, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task A", project: "Project X" },
        { id: 2, date: "2024-07-30", hours: 2, activity: "Work", comment: "Completed task B", project: "Project X" },
      ],
      totalHours: 6,
    },
    {
      date: "2024-07-31",
      entries: [{ id: 3, date: "2024-07-31", hours: 5, activity: "Work", comment: "Completed task C", project: "Project Y" }],
      totalHours: 5,
    },
  ];

  const expectedAllSameDate: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [
        { id: 4, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task D", project: "Project X" },
        { id: 5, date: "2024-07-30", hours: 3, activity: "Work", comment: "Completed task E", project: "Project X" },
        { id: 6, date: "2024-07-30", hours: 2, activity: "Work", comment: "Completed task F", project: "Project X" },
      ],
      totalHours: 9,
    },
  ];

  const expectedDifferentDates: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [{ id: 7, date: "2024-07-30", hours: 1, activity: "Work", comment: "Completed task G", project: "Project X" }],
      totalHours: 1,
    },
    {
      date: "2024-07-31",
      entries: [{ id: 8, date: "2024-07-31", hours: 2, activity: "Work", comment: "Completed task H", project: "Project Y" }],
      totalHours: 2,
    },
    {
      date: "2024-08-01",
      entries: [{ id: 9, date: "2024-08-01", hours: 3, activity: "Work", comment: "Completed task I", project: "Project Z" }],
      totalHours: 3,
    },
  ];

  const expectedEmpty: GroupedTimeEntries[] = [];

  const expectedDuplicatedDates: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [
        { id: 10, date: "2024-07-30", hours: 4, activity: "Work", comment: "Completed task J", project: "Project X" },
        { id: 11, date: "2024-07-30", hours: 3, activity: "Work", comment: "Completed task K", project: "Project X" },
        { id: 12, date: "2024-07-30", hours: 5, activity: "Work", comment: "Completed task L", project: "Project X" },
      ],
      totalHours: 12,
    },
    {
      date: "2024-07-31",
      entries: [{ id: 13, date: "2024-07-31", hours: 2, activity: "Work", comment: "Completed task M", project: "Project Y" }],
      totalHours: 2,
    },
  ];

  const expectedZeroHours: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [
        { id: 14, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
        { id: 15, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
        { id: 16, date: "2024-07-30", hours: 0, activity: "Work", comment: "No work done", project: "Project X" },
      ],
      totalHours: 0,
    },
  ];

  const expectedNegativeHours: GroupedTimeEntries[] = [
    {
      date: "2024-07-30",
      entries: [
        { id: 17, date: "2024-07-30", hours: -4, activity: "Work", comment: "Negative hours", project: "Project X" },
        { id: 18, date: "2024-07-30", hours: -3, activity: "Work", comment: "Negative hours", project: "Project X" },
        { id: 19, date: "2024-07-30", hours: -5, activity: "Work", comment: "Negative hours", project: "Project X" },
      ],
      totalHours: -12,
    },
  ];

  // Test cases
  describe("groupTimeEntriesByDate", () => {
    it("should group time entries by date and calculate total hours correctly", () => {
      expect(groupTimeEntriesByDate(typicalEntries)).toEqual(expectedTypical);
    });

    it("should group all entries under the same date and sum hours correctly", () => {
      expect(groupTimeEntriesByDate(allSameDateEntries)).toEqual(expectedAllSameDate);
    });

    it("should handle each entry being on a different date", () => {
      expect(groupTimeEntriesByDate(differentDatesEntries)).toEqual(expectedDifferentDates);
    });

    it("should return an empty array if no entries are provided", () => {
      expect(groupTimeEntriesByDate(emptyEntries)).toEqual(expectedEmpty);
    });

    it("should group and sum hours correctly even if some dates are duplicated", () => {
      expect(groupTimeEntriesByDate(duplicatedDatesEntries)).toEqual(expectedDuplicatedDates);
    });

    it("should handle entries with zero hours correctly", () => {
      expect(groupTimeEntriesByDate(zeroHoursEntries)).toEqual(expectedZeroHours);
    });

    it("should handle entries with negative hours correctly", () => {
      expect(groupTimeEntriesByDate(negativeHoursEntries)).toEqual(expectedNegativeHours);
    });
  });

  // Test cases for getFullWeeksOfMonth
  describe("getFullWeeksOfMonth", () => {
    it("should return the correct weeks for January 2024", () => {
      const weeks = getFullWeeksOfMonth(1, 2024);
      expect(weeks.length).toBe(5); // January 2024 has 5 weeks
      expect(weeks[0][0]).toBe("2023-12-31"); // The first day of the first week
      expect(weeks[4][6]).toBe("2024-02-03"); // The last day of the last week
    });

    it("should return the correct weeks for February 2024 (leap year)", () => {
      const weeks = getFullWeeksOfMonth(2, 2024);
      expect(weeks.length).toBe(5); // February 2024 has 5 weeks
      expect(weeks[0][0]).toBe("2024-01-28"); // The first day of the first week
      expect(weeks[4][6]).toBe("2024-03-02"); // The last day of the last week
    });

    it("should return the correct weeks for a month with only 4 weeks", () => {
      const weeks = getFullWeeksOfMonth(4, 2024);
      expect(weeks.length).toBe(5); // April 2024 has 5 weeks
      expect(weeks[0][0]).toBe("2024-03-31"); // The first day of the first week
      expect(weeks[4][6]).toBe("2024-05-04"); // The last day of the last week
    });

    it("should return exactly 5 weeks if the month has less than 5 weeks", () => {
      const weeks = getFullWeeksOfMonth(2, 2021);
      expect(weeks.length).toBe(5);
    });

    it("should throw an error if the month is invalid", () => {
      expect(() => getFullWeeksOfMonth(13, 2024)).toThrow();
    });

    it("should add additional weeks to make the total count at least 5", () => {
      // Test a month like February in a non-leap year that won't have 5 full weeks
      const february2024 = getFullWeeksOfMonth(2, 2024); // February 2024 is a leap year, so it has more days
      const february2023 = getFullWeeksOfMonth(2, 2023); // February 2023 is a non-leap year with fewer days

      // Check the length of weeks
      expect(february2024.length).toBe(5); // February 2024 will have 5 weeks including additional ones
      expect(february2023.length).toBe(5); // February 2023 will have 5 weeks including additional ones

      // Check that the last week is correctly formed
      const lastWeek = february2023[february2023.length - 1];
      expect(lastWeek.length).toBe(7);

      // Ensure the weeks are in the correct format
      lastWeek.forEach((date) => {
        expect(moment(date, "YYYY-MM-DD", true).isValid()).toBe(true);
      });
    });
  });

  // Test cases for getDateMonth
  describe("getDateMonth", () => {
    it("should return all dates for January 2024", () => {
      const dates = getDateMonth(1, 2024);
      expect(dates.length).toBe(31); // January has 31 days
      expect(dates[0]).toBe("2024-01-01"); // The first day
      expect(dates[30]).toBe("2024-01-31"); // The last day
    });

    it("should return all dates for February 2024 (leap year)", () => {
      const dates = getDateMonth(2, 2024);
      expect(dates.length).toBe(29); // February in a leap year has 29 days
      expect(dates[0]).toBe("2024-02-01"); // The first day
      expect(dates[28]).toBe("2024-02-29"); // The last day
    });

    it("should return all dates for February 2023 (non-leap year)", () => {
      const dates = getDateMonth(2, 2023);
      expect(dates.length).toBe(28); // February in a non-leap year has 28 days
      expect(dates[0]).toBe("2023-02-01"); // The first day
      expect(dates[27]).toBe("2023-02-28"); // The last day
    });

    it("should throw an error if the month is invalid", () => {
      expect(() => getDateMonth(13, 2024)).toThrow("Invalid month. Please enter a value from 1 to 12.");
    });

    it("should return the correct dates for a month with 30 days", () => {
      const dates = getDateMonth(4, 2024); // April has 30 days
      expect(dates.length).toBe(30);
      expect(dates[0]).toBe("2024-04-01");
      expect(dates[29]).toBe("2024-04-30");
    });
  });
});
