import { LightningElement, wire, api } from 'lwc';
import getOpportunities from '@salesforce/apex/AccountOpportunitiesTreeController.getOpportunities';

const COLUMNS = [
    {
        label: 'Name', fieldName: 'NameUrl', type: 'url', typeAttributes: {
            label: { fieldName: 'Name' },
        }, cellAttributes: {
            iconName: {fieldName: 'iconName'},
            iconLabel: {fieldName: 'iconLabel'}
        },
        initialWidth: 300,

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
    }
    // Add more columns as needed
];

export default class accountOpportunitiesTree extends LightningElement {
    @api recordId; // Current Account Id

    gridColumns = COLUMNS;
    opportunities;

    @wire(getOpportunities, { accountId: '$recordId' })
    wiredOpportunities({ error, data }) {
        if (data) {
            // Process data if needed
            let itemCount  = 0
            this.opportunities = data?.map((item) => {
               itemCount++

                return {
                    Id: item.Id,
                    //To apply indentation to child accounts
                    Name: item.Name,
                    iconName:'standard:account',
                    iconLabel: itemCount == 1 ? '':  '      ',
                    NameUrl: '/' + item.Id,
                    _children: item?.Opportunities?.map((opp) => {
                        return {
                            Id: opp.Id,
                            Name: opp.Name,
                            NameUrl: '/' + opp.Id,
                            StageName: opp.StageName,
                            ExpectedRevenue: opp.ExpectedRevenue,
                            CloseDate: opp.CloseDate,
                            OwnerName: opp.Owner.Name,
                            iconName:'standard:opportunity',

                        }
                    })
                }
            });
        } else if (error) {
            // Handle error
            console.error(error);
        }
    }
}