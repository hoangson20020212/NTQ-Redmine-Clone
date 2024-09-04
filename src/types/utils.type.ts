// export interface SuccessResponse<Data> {
//   // message: string;
//   data: Data;
// }

export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export type ListDataResponse<T, K extends string> = {
  [key in K]: T;
} & {
  total_count?: number;
  limit?: number;
  offset?: number;
};

// cú pháp `-?` sẽ loại bỏ undefiend của key optional

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

export type Block = {
  id: string;
  title: string;
  component?: unknown;
};

export type BoardSections = {
  [key: string]: Block[];
};

export type CheckBoxRoadMap = {
  task: boolean;
  bug: boolean;
  showComplete: boolean;
};

export type UploadFile = {
  upload: {
    token: string;
  };
};
