export interface IDoctor {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: string;
  dateOfBirth: Date;
  gender: string;
  hospitalKey: string;
}

export class Doctor implements IDoctor {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: string;
  dateOfBirth: Date;
  gender: string;
  hospitalKey: string;

  constructor(
    email: string,
    phoneNumer: string,
    firstName: string,
    lastName: string,
    personalIdentificationNumber: string,
    dateOfBirth: Date,
    gender: string,
    hospitalKey: string,
  ) {
    this.email = email;
    this.phoneNumer = phoneNumer;
    this.firstName = firstName;
    this.lastName = lastName;
    this.personalIdentificationNumber = personalIdentificationNumber;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.hospitalKey = hospitalKey;
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
