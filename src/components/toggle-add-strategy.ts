import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

interface Segment {
  segment_id: string;
  segment_type: string;
  criteria: object;
}

@customElement('toggle-add-strategy')
export class ToggleAddStrategy extends LitElement {
  static styles = css`
        mwc-textfield, mwc-select, mwc-textarea {
           min-width: 500px;
           margin-bottom: 32px;
        }
        mwc-dialog {
            text-align: left;
            --mdc-dialog-z-index: 1111;
        }
        mwc-icon-button {
            float: right;
            display: inline-block;
        }
        .column {
            float: left;
            width: 50%;
        }
        .row:after {
            content: "";
            display: table;
            clear: both;
        }
        .color {
            color: tomato;
        }
    `;

  @property({ attribute: 'api-url' })
  apiUrl: string;

  @property({ attribute: 'feature-id', type: String })
  featureId: String;

  @property({ attribute: 'strategy-id', type: String })
  strategyId?: String;

  @property({ attribute: 'strategy-type', type: String })
  strategyType?: String;

  @property({ type: Array })
  segments: Array<number>;

  @query('#add-strategy-dialog')
  dialog!: HTMLDialogElement;

  @query('#strategy-id-text-field')
  strategyIdInput!: HTMLInputElement;

  @query('#strategy-type-select-field')
  strategyTypeInput!: HTMLSelectElement;

  constructor() {
    super();
    this.apiUrl = '';
    this.featureId = '';
    this.segments = [];
  }

  private openAddStrategyForm() {
    this.dialog.open = true;
  }

  private showNewSegmentForm(): void {
    this.segments.push(this.segments.length + 1);
    this.requestUpdate();
  }

  private async addStrategy() {
    await this.save();
  }

  private save() {
    const segments = this.segments.map((segment): Segment => {
      if (this.shadowRoot === null) {
        throw new Error('ShadowRoot not loaded.');
      }
      const segmentIdInput: HTMLInputElement = (this.shadowRoot.getElementById(
        `segment-id-text-field-${segment}`,
      ) as HTMLInputElement);
      const segmentTypeSelect: HTMLSelectElement = (this.shadowRoot.getElementById(
        `segment-type-select-field-${segment}`,
      ) as HTMLSelectElement);
      const criteriaInput: HTMLTextAreaElement = (this.shadowRoot.getElementById(
        `segment-criteria-text-field-${segment}`,
      ) as HTMLTextAreaElement);

      return {
        segment_id: segmentIdInput.value,
        segment_type: segmentTypeSelect.value,
        criteria: JSON.parse(criteriaInput.value),
      };
    });

    return fetch(`${this.apiUrl}/features/${this.featureId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        action: 'set_strategy',
        value: {
          strategy_id: this.strategyIdInput.value,
          strategy_type: this.strategyTypeInput.value,
          segments,
        },
      }),
    }).then((response) => {
      if (response.status === 202) {
        this.strategyIdInput.value = '';
        this.strategyTypeInput.value = '';
        this.segments = [];
        const event = new Event('state_changed');
        this.dispatchEvent(event);
        this.dialog.open = false;
      }
    });
  }

  private static renderJsonExample(): String {
    return String`
      {
        "foo": "baz"
      }
    `;
  }

  private async removeSegmentForm(event: MouseEvent) {
    const index: Number = ((event.target as HTMLInputElement).getAttribute('data-index') as unknown as Number);
    if (this.shadowRoot) {
      const form: HTMLDivElement = (this.shadowRoot.getElementById(`segment-form-${index}`)) as HTMLDivElement;
      form.remove();
    }
  }

  private renderSegmentForm() {
    if (this.segments.length > 0) {
      return this.segments.map((segment) => html`
                <div id="segment-form-${segment}">
                    <div class="row">
                      <div class="column"><p>Add Segment</p></div>
                      <div class="column">
                          <mwc-icon-button 
                                  data-index="${segment}"
                                  class="color" 
                                  icon="delete"
                                  @click="${this.removeSegmentForm}"
                          ></mwc-icon-button>
                      </div>
                    </div>
                    <mwc-textfield
                            id="segment-id-text-field-${segment}"
                            class="text-field"
                            minlength="3"
                            maxlength="64"
                            placeholder="Type the Segment Identifier"
                            required
                    ></mwc-textfield>
                    <br/>
                    <mwc-select label="Select the Segment Type" id="segment-type-select-field-${segment}">
                        <mwc-list-item value="identity_segment">
                            Identity matching
                        </mwc-list-item>
                        <mwc-list-item value="strict_matching_segment">
                            Strict matching
                        </mwc-list-item>
                        <mwc-list-item value="in_collection_matching_segment">
                            Partial matching
                        </mwc-list-item>
                    </mwc-select>
                    <br/>
                    <mwc-textarea
                            id="segment-criteria-text-field-${segment}"
                            fullwidth
                            rows="5"
                            placeholder="${ToggleAddStrategy.renderJsonExample()}"
                            label="JSON Criteria"
                            helper="The criteria value should be the value against we'll try to match a segment"
                            helperPersistent
                    ></mwc-textarea>
                </div>
            `);
    }
    return html``;
  }

  renderAddSegmentButton() {
    if (this.strategyId) {
      return html``;
    }

    return html`
            ${this.renderSegmentForm()}
            <br/>
            <mwc-button raised icon="add" class="add-segment-button" @click="${this.showNewSegmentForm}">Add
                Segment
            </mwc-button>
        `;
  }

  render() {
    return html`
            <mwc-button @click="${this.openAddStrategyForm}">
                ${this.strategyId
    ? html`Manage`
    : html`Add Strategy`}
            </mwc-button>
            <mwc-dialog
                    id="add-strategy-dialog"
                    heading="${this.strategyId
    ? `Manage ${this.strategyId} strategy`
    : 'Add Toggle Strategy'}"
                    class="styled">
                <mwc-textfield
                        id="strategy-id-text-field"
                        class="text-field"
                        minlength="3"
                        maxlength="64"
                        placeholder="Strategy Id"
                        value="${this.strategyId}"
                        required
                ></mwc-textfield>
                <br/>
                <mwc-select label="Select the Strategy Type" id="strategy-type-select-field"
                            value="${this.strategyType}">
                    <mwc-list-item value="enable_by_matching_segment">
                        Enable Feature By Matching Segment
                    </mwc-list-item>
                    <mwc-list-item value="enable_by_matching_identity_id">
                        Enable Feature By Matching Identity
                    </mwc-list-item>
                </mwc-select>
                <br>
                ${this.renderAddSegmentButton()}
                <mwc-button slot="primaryAction" @click="${this.addStrategy}">Save Strategy</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="close">Cancel</mwc-button>
            </mwc-dialog>
        `;
  }
}
