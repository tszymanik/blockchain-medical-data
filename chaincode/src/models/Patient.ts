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

  getData() {
    return JSON.stringify({
      email: this.email,
      phoneNumer: this.phoneNumer,
      firstName: this.firstName,
      lastName: this.lastName,
      personalIdentificationNumber: this.personalIdentificationNumber,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      placeOfBirth: this.placeOfBirth,
      address: this.address,
      city: this.city,
      zipCode: this.zipCode,
      voivodeship: this.voivodeship,
    });
  }

  getAnonymizedData() {
    return JSON.stringify({
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
    });
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer(data: any) {
    return Buffer.from(data);
  }
}
