export interface IPatient {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: number;
  dateOfBirth: Date;
  gender: string;
  placeOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  voivodeship: string;
}

export class Patient implements IPatient {
  email: string;
  phoneNumer: string;
  firstName: string;
  lastName: string;
  personalIdentificationNumber: number;
  dateOfBirth: Date;
  gender: string;
  placeOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  voivodeship: string;

  constructor(
    email: string,
    phoneNumer: string,
    firstName: string,
    lastName: string,
    personalIdentificationNumber: number,
    dateOfBirth: Date,
    gender: string,
    placeOfBirth: string,
    address: string,
    city: string,
    zipCode: string,
    voivodeship: string,
  ) {
    this.email = email;
    this.phoneNumer = phoneNumer;
    this.firstName = firstName;
    this.lastName = lastName;
    this.personalIdentificationNumber = personalIdentificationNumber;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.placeOfBirth = placeOfBirth;
    this.address = address;
    this.city = city;
    this.zipCode = zipCode;
    this.voivodeship = voivodeship;
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
