import { Strategy } from './strategy';

export class Feature {
  id: String;

  enabled: Boolean;

  strategies: Array<Strategy>;

  constructor(id: String, enabled: Boolean, segments: Array<Strategy>) {
    this.id = id;
    this.enabled = enabled;
    this.strategies = segments;
  }
}
