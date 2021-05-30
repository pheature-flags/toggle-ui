
export class Feature {
    id: String
    enabled: Boolean
    strategies: Array<Strategy>

    constructor(id: String, enabled: Boolean, segments: Array<Strategy>) {
        this.id = id;
        this.enabled = enabled;
        this.strategies = segments;
    }
}

export class Strategy {
    id: String
    type: String
    segments: Array<Segment>

    constructor(id: String, type: String, segments: Array<Segment>) {
        this.id = id;
        this.type = type;
        this.segments = segments;
    }
}

export class Segment {
    id: String
    type: String
    criteria: Array<object | string>

    constructor(id: String, type: String, criteria: Array<object | string>) {
        this.id = id;
        this.type = type;
        this.criteria = criteria;
    }
}
