public with sharing class AccountOpportunitiesTreeController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getOpportunities(String accountId) {

        try{
            if(accountId == ''){
                //To Accomodate for Test Class
                throw new AuraHandledException('Invalid Account Id');
            }
            List<Account> accounts = [SELECT Id, Name, (SELECT Id, Name, StageName, ExpectedRevenue,CloseDate,Owner.Name FROM Opportunities) Opportunities FROM Account WHERE Id =: accountId OR ParentId =: accountId ORDER BY CreatedDate ASC];
            return accounts;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}