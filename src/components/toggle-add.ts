import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('toggle-add')
export class ToggleAdd extends LitElement {
    static styles = css`
        mwc-dialog {
            text-align: left;
            --mdc-dialog-z-index: 1111;
        }
        mwc-textfield {
           min-width: 500px;
           margin-bottom: 32px;
        }
    `;
    @property({ attribute: 'api-url' })
    apiUrl: string;

    @query('#add-feature-dialog')
    dialog!: HTMLDialogElement
    @query('#feature-id-text-field')
    featureIdInput!: HTMLInputElement

    constructor() {
        super();
        this.apiUrl = '';
    }

    private openAddToggleForm() {
        this.dialog.open = true;
    }

    private async addFeature() {
        await this.save(this.featureIdInput.value);
    }

    private save(featureId: String) {
        return fetch(this.apiUrl + '/features/' + featureId, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        }).then(response => {
            if (201 === response.status) {
                this.featureIdInput.value = ''
                const event = new Event('state_changed')
                this.dispatchEvent(event)
                this.dialog.open = false;
            }
        })
    }

    render() {
        return html`
            <mwc-button @click="${this.openAddToggleForm}">Add Feature</mwc-button>
            <mwc-dialog id="add-feature-dialog" heading="Add New Feature" class="styled">
                <mwc-textfield
                        id="feature-id-text-field"
                        class="text-field"
                        minlength="3"
                        maxlength="64"
                        placeholder="Type the feature Identifier"
                        required
                ></mwc-textfield>
                <br>
                <mwc-button slot="primaryAction" @click="${this.addFeature}">Save</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="close">Cancel</mwc-button>
            </mwc-dialog>
        `
    }
}
