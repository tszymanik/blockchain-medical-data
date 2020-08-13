export type Doctor = {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: string;
  dateOfBirth: string;
  gender: string;
  hospitalKey: string;
};

export type DoctorData = {
  Key: string;
  Record: Doctor;
};
