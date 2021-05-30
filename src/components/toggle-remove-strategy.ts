import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('toggle-remove-strategy')
export class ToggleRemoveStrategy extends LitElement {
    static styles = css`
        mwc-button {
           --mdc-theme-primary: red;
        }
        mwc-dialog {
            text-align: left;
            --mdc-dialog-z-index: 1111;
        }
        p {
           min-width: 500px;
           margin-bottom: 32px;
        }
    `;
    @property({attribute: 'feature-id'})
    featureId: string
    @property({attribute: 'strategy-id'})
    strategyId: string
    @property({ attribute: 'api-url' })
    apiUrl: string;
    @query('#remove-toggle-dialog')
    dialog!: HTMLDialogElement

    constructor() {
        super();
        this.featureId = ''
        this.strategyId = ''
        this.apiUrl = ''
    }

    private showRemoveModal() {
        this.dialog.open = true;
    }

    private async deleteStrategy() {
        await this.save();
        const event = new Event('state_changed')
        this.dispatchEvent(event)

        this.dialog.open = false;
    }

    private save() {
        return fetch(this.apiUrl + '/features/' + this.featureId, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: 'remove_strategy',
                value: {
                    strategy_id: this.strategyId
                }
            }),
        })
    }

    render() {
        return html`
            <mwc-button slot="primaryAction" @click="${this.showRemoveModal}">Remove</mwc-button>
            <mwc-dialog id="remove-toggle-dialog" heading="Remove Toggle Strategy" class="styled">
                <p>Are you sure you want to delete feature ${this.featureId}?</p>
                <mwc-button slot="primaryAction" @click="${this.deleteStrategy}">Yes, delete it!</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="close">Cancel</mwc-button>
            </mwc-dialog>
        `
    }
}
