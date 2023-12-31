// custom methods are implemented in support/
describe('Tests for the friend list functionality', function() {

    const randomEmail = 'thisuserdoesnotexists_789454564342@mail.ca'

    beforeEach(() => {
        cy.login('email2', 'password2');
        cy.goToFriendList();
    })

    afterEach(() => {
        cy.wait(2000);
    })

    it('User search an existing user with a public profile and tries to add him', function() {
        cy.addUser(
            Cypress.env('email1'),
            true
        );
    })


    it('User search an existing user with a private profile and tries to add him', function() {
        cy.addUser(
            Cypress.env('email3'),
            false
        );
    })

    it('User search for a non existing user and tries to add him', function() {
        cy.addUser(
            randomEmail,
            false
        );
    })

    it('User can cancel a friend request', function() {
        cy.cancelRequest(Cypress.env('email1'));
    })

    it('User can accept a friend request', function() {
        cy.addUser(
            Cypress.env('email1'),
            true
        );
        cy.changeUser('email1', 'password1');
        cy.goToFriendList();
        cy.get('[data-test="friendRequestsLink"]').click();
        cy.get(`[data-test="accept-request-${Cypress.env('email2')}"]`).click();
        cy.wait(1000);
    })

    it('User can delete a friend', function () {
        cy.wait(1000);
        cy.get(`[data-test="delete-friend-${Cypress.env('email1')}"]`).click();
        // cy.get(`[data-test="delete-friend-${Cypress.env('email1')}"]`).click();
        cy.wait(50);
        cy.get(`[data-test="delete-friend-${Cypress.env('email1')}"]`).should('not.exist');
        cy.wait(50);
        cy.get('[data-test="apply-changes"]').click();
        cy.wait(1000);
        cy.get(`[data-test="delete-friend-${Cypress.env('email1')}"]`).should('not.exist');
        cy.changeUser('email1', 'password1');
        cy.goToFriendList();
        cy.wait(250);
        cy.get(`[data-test="delete-friend-${Cypress.env('email2')}"]`).should('not.exist');
    })

})