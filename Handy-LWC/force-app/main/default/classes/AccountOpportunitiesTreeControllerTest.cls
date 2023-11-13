@isTest
public with sharing class AccountOpportunitiesTreeControllerTest {
    

    @isTest
    static void testGetOpportunities() {
        // Create test account
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        // Create test opportunity
        Opportunity testOpportunity = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            Amount = 10000,
            CloseDate = Date.today(),
            AccountId = testAccount.Id
        );
        insert testOpportunity;

        // Call the method to be tested
        Test.startTest();
        List<Account> result = AccountOpportunitiesTreeController.getOpportunities(testAccount.Id);
        Test.stopTest();

        // Assertions
        System.assertNotEquals(null, result, 'Result should not be null');
        System.assertEquals(1, result.size(), 'There should be one account in the result');
        System.assertEquals(testAccount.Id, result[0].Id, 'Account Id should match');
        System.assertEquals(testAccount.Name, result[0].Name, 'Account Name should match');
        System.assertEquals(1, result[0].Opportunities.size(), 'There should be one opportunity under the account');
        Opportunity returnedOpportunity = result[0].Opportunities[0];
        System.assertEquals(testOpportunity.Id, returnedOpportunity.Id, 'Opportunity Id should match');
        System.assertEquals(testOpportunity.Name, returnedOpportunity.Name, 'Opportunity Name should match');
        // Add more assertions based on your actual data model

    }

    @isTest
    static void testGetOpportunitiesWithInvalidId(){
        Test.startTest();
        try {
            // Call the method with an invalid accountId to trigger the catch block
            List<Account> invalidResult = AccountOpportunitiesTreeController.getOpportunities('');
            // Add assertions to verify that the catch block is triggered
            System.assertEquals(0, invalidResult.size(), 'Result should be null in case of exception');
        } catch (Exception e) {
            // Add assertions to verify the caught exception
            System.assertNotEquals(null, e.getMessage(), 'Exception message should not be null');
        }
        Test.stopTest();
    }
    
}
