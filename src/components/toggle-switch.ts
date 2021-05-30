import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('toggle-switch')
export class ToggleSwitch extends LitElement {
    @property({type: String})
    featureId: String
    @property({ attribute: 'api-url' })
    apiUrl: string
    @property({type: Number})
    enabled: Number;

    constructor() {
        super();
        this.apiUrl = '';
        this.featureId = ''
        this.enabled = 0
    }

    private enableFeature() {
        this.enabled = 1;
        this.save(this.featureId, 'enable_feature')

    }

    private disableFeature() {
        this.enabled = 0;
        this.save(this.featureId, 'disable_feature')
    }

    private save(featureId: String, action: String) {
        fetch(this.apiUrl + '/features/' + featureId, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: action
            }),
        })
    }

    private renderCheckbox() {
        if (1 === this.enabled) {
            return html`
                <mwc-formfield>
                    <mwc-switch checked @click="${this.disableFeature}"></mwc-switch>
                </mwc-formfield>            
            `
        } else {
            return html`
                <mwc-formfield>
                    <mwc-switch @click="${this.enableFeature}"></mwc-switch>
                </mwc-formfield>            
            `
        }
    }

    render() {
        return html`
            ${this.renderCheckbox()}
        `
    }
}
