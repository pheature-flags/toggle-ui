import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('toggle-add-strategy')
export class ToggleAddStrategy extends LitElement {
    static styles = css`
        mwc-textfield, mwc-select {
           min-width: 500px;
           margin-bottom: 32px;
        }
        mwc-dialog {
            text-align: left;
            --mdc-dialog-z-index: 1111;
        }
    `;

    @property({attribute: 'api-url'})
    apiUrl: string;
    @property({type: String})
    featureId: String
    @property({type: Array})
    segments: Array<any>

    @query('#add-strategy-dialog')
    dialog!: HTMLDialogElement
    @query('#strategy-id-text-field')
    strategyIdInput!: HTMLInputElement
    @query('#strategy-type-select-field')
    strategyTypeInput!: HTMLSelectElement
    @query('#segment-form-template')
    formTemplate!: HTMLDivElement
    @query('#segment-forms-wrapper')
    formsWrapper!: HTMLDivElement
    @query('.segment-form')
    forms!: HTMLDivElement

    constructor() {
        super();
        this.apiUrl = ''
        this.featureId = ''
        this.segments = []
    }

    private openAddStrategyForm() {
        this.dialog.open = true;
    }

    private showNewSegmentForm() {
        this.segments.push({
            id: '',
            type: '',
            index: this.segments.length + 1
        })
        this.requestUpdate()
    }

    private async addStrategy() {
        await this.save()
    }

    private save() {
        const segments = this.segments.map((segment) => {
            if (null === this.shadowRoot) {
                return
            }
            const segmentIdInput: HTMLInputElement = (this.shadowRoot.getElementById(
                'segment-id-text-field-' + segment.index
            ) as HTMLInputElement);
            const segmentTypeSelect: HTMLSelectElement = (this.shadowRoot.getElementById(
                'segment-type-select-field-' + segment.index
            ) as HTMLSelectElement);

            return {
                segment_id: segmentIdInput.value,
                segment_type: segmentTypeSelect.value,
                criteria: [],
            }
        });

        return fetch(this.apiUrl + '/features/' + this.featureId, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: 'set_strategy',
                value: {
                    strategy_id: this.strategyIdInput.value,
                    strategy_type: this.strategyTypeInput.value,
                    segments: segments
                }
            }),
        }).then(response => {
            if (202 === response.status) {
                this.strategyIdInput.value = ''
                this.strategyTypeInput.value = ''
                this.segments = []
                const event = new Event('state_changed')
                this.dispatchEvent(event)
                this.dialog.open = false;
            }
        })
    }

    renderSegmentForm() {
        if (0 < this.segments.length) {
            return this.segments.map((segment) => {
                return html`
                    <div class="segment-form">
                        <p>Segment ${segment.index}</p>
                        <mwc-textfield
                                id="segment-id-text-field-${segment.index}"
                                class="text-field"
                                minlength="3"
                                maxlength="64"
                                placeholder="Type the Segment Identifier"
                                required
                        ></mwc-textfield>
                        <br/>
                        <mwc-select label="Select the Segment Type" id="segment-type-select-field-${segment.index}">
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
                    </div>
                `
            })
        } else {
            return html``
        }
    }

    render() {
        return html`
            <mwc-button @click="${this.openAddStrategyForm}">Add Strategy</mwc-button>
            <mwc-dialog id="add-strategy-dialog" heading="Add Toggle Strategy" class="styled">
                <mwc-textfield
                        id="strategy-id-text-field"
                        class="text-field"
                        minlength="3"
                        maxlength="64"
                        placeholder="Strategy Id"
                        required
                ></mwc-textfield>
                <br/>
                <mwc-select label="Select the Strategy Type" id="strategy-type-select-field">
                    <mwc-list-item value="enable_by_matching_segment">
                        Enable Feature By Matching Segment
                    </mwc-list-item>
                    <mwc-list-item value="enable_by_matching_identity_id">
                        Enable Feature By Matching Identity
                    </mwc-list-item>
                </mwc-select>
                <br>
                ${this.renderSegmentForm()}
                <mwc-button raised icon="add" class="add-segment-button" @click="${this.showNewSegmentForm}">Add
                    Segment
                </mwc-button>
                <mwc-button slot="primaryAction" @click="${this.addStrategy}">Save Strategy</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="close">Cancel</mwc-button>
            </mwc-dialog>
        `
    }
}
