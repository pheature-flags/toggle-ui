export class Segment {
  id: String;

  type: String;

  criteria: Array<object | string>;

  constructor(id: String, type: String, criteria: Array<object | string>) {
    this.id = id;
    this.type = type;
    this.criteria = criteria;
  }
}
