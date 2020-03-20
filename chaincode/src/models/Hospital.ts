export interface IHospital {
  name: string;
  city: string;
}

export class Hospital implements IHospital {
  name: string;
  city: string;

  constructor(name: string, city: string) {
    this.name = name;
    this.city = city;
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
