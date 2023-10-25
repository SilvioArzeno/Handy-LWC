public with sharing class AccountOpportunitiesTreeController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getOpportunities(String accountId) {

        try{

            List<Account> accounts = [SELECT Id, Name, (SELECT Id, Name FROM Opportunities) Opportunities FROM Account WHERE Id =: accountId OR ParentId =: accountId ORDER BY CreatedDate ASC];
            return accounts;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}