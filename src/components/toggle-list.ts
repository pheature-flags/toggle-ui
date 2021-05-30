import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-formfield';
import '@material/mwc-switch';
import './toggle-add.ts'
import './toggle-add-strategy.ts'
import './toggle-remove.ts'
import './toggle-remove-strategy.ts'
import './toggle-segment.ts'
import './toggle-switch.ts'
import {MDCDataTable} from '@material/data-table';
import {Feature, Segment, Strategy} from '../model/model'

import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('toggle-list')
export class ToggleList extends LitElement {
    static styles = css`
        .mdc-data-table {
           width: 100%;
        }
        .actions {
            text-align: right;
        }
        tr.mdc-data-table__header-row.bg-grey th {
            background-color: #eee;
        }

    `;

    @property()
    features!: Array<Feature>;
    @property({ attribute: 'api-url' })
    apiUrl: string;

    @query('.mdc-data-table')
    dataTable!: HTMLTableElement

    constructor() {
        super();
        this.apiUrl = '';
        this.addEventListener('load', () => {
            new MDCDataTable(this.dataTable)
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.getModel();
    }

    private async updateFeatures() {
        console.log('event fired!!')

        await this.getModel()
        await this.requestUpdate();
        return await this.updateComplete;
    }

    private getModel() {
        return fetch(this.apiUrl + '/features')
            .then(data => data.json())
            .then((json) => {
                this.features = []
                return json.map((feature: any) => {
                    return this.features.push(new Feature(feature.id, feature.enabled, feature.strategies.map(
                        (strategy: any) => {
                            return new Strategy(strategy.id, strategy.type, strategy.segments.map((segment: any) => {
                                return new Segment(segment.id, segment.type, segment.criteria)
                            }))
                        }
                    )));
                })
            });
    }

    private renderStrategies(feature: Feature) {
        return html`
            ${0 < feature.strategies.length ? html`
                <tr class="mdc-data-table__header-row bg-grey">
                    <th class="mdc-data-table__header-cell" scope="row"></th>
                    <th class="mdc-data-table__header-cell">Strategy</th>
                    <th class="mdc-data-table__header-cell">Type</th>
                    <th class="mdc-data-table__header-cell">Segments</th>
                    <th class="mdc-data-table__header-cell"></th>
                </tr>
            ` : html``}
            ${feature.strategies.map(
                    (strategy: Strategy) => {
                        return html`
                            <tr class="mdc-data-table__row">
                                <td class="mdc-data-table__cell" scope="row"></td>
                                <td class="mdc-data-table__cell">${strategy.id}</td>
                                <td class="mdc-data-table__cell">${strategy.type}</td>
                                <td class="mdc-data-table__cell">
                                    ${strategy.segments.map((segment) => {
                                        return html`
                                            <toggle-segment 
                                                    segment-id="${segment.id}"
                                            ></toggle-segment>
                                        `
                                    })}
                                </td>
                                <td class="mdc-data-table__cell actions">
                                    <toggle-remove-strategy
                                            api-url="${this.apiUrl}"
                                            feature-id="${feature.id}"
                                            strategy-id="${strategy.id}"
                                            @state_changed="${this.updateFeatures}"
                                    ></toggle-remove-strategy>
                                </td>
                            </tr>
                        `
                    }
            )}

        `
    }

    private renderRows() {
        return html`
            ${this.features.map(
                    (feature: Feature) => {
                        return html`
                            <tr class="mdc-data-table__row">
                                <td class="mdc-data-table__cell" scope="row"></td>
                                <td class="mdc-data-table__cell">${feature.id}</td>
                                <td class="mdc-data-table__cell">
                                    <toggle-switch
                                            api-url="${this.apiUrl}"
                                            featureId="${feature.id}"
                                            enabled="${Number(feature.enabled)}"
                                    ></toggle-switch>
                                </td>
                                <td class="mdc-data-table__cell actions" colspan="2">
                                    <toggle-add-strategy
                                            api-url="${this.apiUrl}"
                                            featureId="${feature.id}"
                                            @state_changed="${this.updateFeatures}"
                                    ></toggle-add-strategy>
                                    <toggle-remove
                                            api-url="${this.apiUrl}"
                                            featureId="${feature.id}"
                                            @state_changed="${this.updateFeatures}"
                                    ></toggle-remove>
                                </td>
                            </tr>
                            ${this.renderStrategies(feature)}
                        `
                    }
            )}
        `
    }

    render() {
        return html`
            <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
                  rel="stylesheet">
            <div class="mdc-data-table">
                <div class="mdc-data-table__table-container">
                    <table id="toggle-table" class="mdc-data-table__table">
                        <thead>
                        <tr class="mdc-data-table__header-row">
                            <th class="mdc-data-table__header-cell" role="columnheader" scope="col"></th>
                            <th class="mdc-data-table__header-cell" role="columnheader">Feature ID</th>
                            <th class="mdc-data-table__header-cell" role="columnheader">Kill Switch</th>
                            <th class="mdc-data-table__header-cell actions" role="columnheader" colspan="2">
                                <toggle-add @state_changed="${this.updateFeatures}"></toggle-add>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        ${this.features ? this.renderRows() : html``}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}
