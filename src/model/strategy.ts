import { Segment } from './segment';

export class Strategy {
  id: String;

  type: String;

  segments: Array<Segment>;

  constructor(id: String, type: String, segments: Array<Segment>) {
    this.id = id;
    this.type = type;
    this.segments = segments;
  }
}
