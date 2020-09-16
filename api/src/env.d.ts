declare namespace NodeJS {
  export interface ProcessEnv {
    API_PORT: string;
    INSURER: string;
    UNIVERSITY: string;
    NETWORK_NAME: string;
    CHAINCODE_ID: string;
    PATIENT_CONTRACT_NAME: string;
    HOSPITAL_CONTRACT_NAME: string;
    DOCTOR_CONTRACT_NAME: string;
    REPORT_CONTRACT_NAME: string;
  }
}
