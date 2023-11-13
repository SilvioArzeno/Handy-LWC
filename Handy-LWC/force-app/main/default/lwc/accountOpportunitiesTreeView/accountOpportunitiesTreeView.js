import { LightningElement, wire, api } from 'lwc';
import {getRelatedListRecords } from 'lightning/uiRelatedListApi';

const COLUMNS = [
    {
        label: 'Name',
        fieldName: 'NameUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
        },
        cellAttributes: {
            iconName: { fieldName: 'iconName' },
        },
        initialWidth: 200,
    },
    {
        type: 'text',
        fieldName: 'StageName',
        label: 'Stage',
    },
    {
        type: 'currency',
        fieldName: 'ExpectedRevenue',
        label: 'Expected Revenue',
    },
    {
        type: 'date',
        fieldName: 'CloseDate',
        label: 'Close Date',
    },
    {
        type: 'text',
        fieldName: 'OwnerName',
        label: 'Owner Name',
    },
    // Add more columns as needed
];


export default class accountOpportunitiesTreeView extends LightningElement {
    @api recordId; // Current Account Id

    gridColumns = COLUMNS;
    opportunities;
    childAccounts;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'ChildAccounts',
        fields: [
            'Account.Id',
            'Account.Name',
        ],
    })
    wiredChildrenAccounts({ error, data }) {
        if (data) {
            console.log(data)
            const childAccounts = data.records.map(acc => ({
                Id: acc.fields.Id.value,
                Name: acc.fields.Name.value,
            }));

            this.childAccounts = [...childAccounts];
        } else if (error) {
            // Handle error
            console.log(error);
        }
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Opportunities',
        fields: [
            'Opportunity.Id',
            'Opportunity.Account.Name',
            'Opportunity.Name',
            'Opportunity.StageName',
            'Opportunity.ExpectedRevenue',
            'Opportunity.CloseDate',
            'Opportunity.Owner.Name'
        ],
    })
    wiredOpportunities({ error, data }) {
        if (data) {
            console.log(data)
            const opportunities = data.records.map(opp => ({
                Id: opp.fields.Id.value,
                Name: opp.fields.Name.value,
                NameUrl: '/' + opp.fields.Id.value,
                StageName: opp.fields.StageName.value,
                ExpectedRevenue: opp.fields.ExpectedRevenue.value,
                CloseDate: opp.fields.CloseDate.value,
                OwnerName:opp.fields.Owner.displayValue,
                iconName: 'standard:opportunity',
            }));
            this.opportunities = [{
                Id: this.recordId,
                Name: data.records[0].fields.Account.displayValue,
                iconName: 'standard:account',
                NameUrl: '/' + this.recordId,
                _children: opportunities,
            }];
        } else if (error) {
            // Handle error
            console.log(error);
        }
    }
}