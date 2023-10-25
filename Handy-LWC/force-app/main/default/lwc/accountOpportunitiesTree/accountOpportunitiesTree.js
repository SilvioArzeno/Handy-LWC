import { LightningElement, wire, api } from 'lwc';
import getOpportunities from '@salesforce/apex/AccountOpportunitiesTreeController.getOpportunities';

const COLUMNS = [
    {
        label: 'Account Name', fieldName: 'NameUrl', type: 'url', typeAttributes: {
            label: { fieldName: 'Name' },
        },

    }, 
    {
        type: 'phone',
        fieldName: 'phone',
        label: 'Phone Number',
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
            this.opportunities = data?.map((item)=>{
                return {
                    Id: item.Id,
                    Name: item.Name,
                    NameUrl: '/'+item.Id,
                    _children: item?.Opportunities?.map((opp)=> {
                        return{
                            Id:opp.Id,
                            Name: opp.Name,
                            NameUrl: '/'+opp.Id
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