export type Patient = {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: string;
  dateOfBirth: string;
  gender: string;
  placeOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  voivodeship: string;
};

export type PatientData = {
  Key: string;
  Record: Patient;
};
