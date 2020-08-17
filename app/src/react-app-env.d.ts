/// <reference types="react-scripts" />

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_INSURER_ORG: string;
    REACT_APP_UNIVERSITY_ORG: string;
  }
}
