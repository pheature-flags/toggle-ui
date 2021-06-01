import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MDCChipSet } from '@material/chips/chip-set';

@customElement('toggle-segment')
export class ToggleSegment extends LitElement {
  @property({ attribute: 'segment-id' })
  segmentId: String;

  chip?: MDCChipSet;

  @query('.mdc-chip')
  chipset!: HTMLDivElement;

  constructor() {
    super();
    this.segmentId = '';
    this.addEventListener('load', () => {
      this.chip = new MDCChipSet(this.chipset);
    });
  }

  render() {
    return html`
            <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
                  rel="stylesheet">
            <div class="mdc-chip" role="row">
              <div class="mdc-chip__ripple"></div>
              <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__primary-action">
                  <span class="mdc-chip__text">${this.segmentId}</span>
                </span>
              </span>
              <span role="gridcell">
                <mwc-icon class="mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button">cancel</mwc-icon>
              </span>
            </div>
        `;
  }
}
