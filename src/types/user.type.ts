export interface User {
  id: number;
  name: string;
  // TODO: Define User
}

export interface UserLoginInput {
  email: string;
  password: string;
  isStayLogin: boolean;
}

export interface UserAccount {
  id: number;
  login: string;
  admin: boolean;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on: string;
  api_key: string;
  custom_fields: {
    id: number;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
  }[];
}
