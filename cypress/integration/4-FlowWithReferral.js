/// <reference types="Cypress" />

describe("Claims Endpoints", () => {
    before(() => {
        cy.ListClaims().then(noOfClaims => [
            window.previsousNoOfClaims = noOfClaims
        ]) // Note the claims before creating new.

        // cy.MemberPrescriptions().then(noOfMemberPrescriptions => {
        //     window.MemberPrescriptions = noOfMemberPrescriptions
        // }) // Note the MemberPrescriptions before creating new.

        // cy.defineGlobalVariables()
        cy.postClaimHeader() // Setting window.easiClaim_Claim_ID in this promise (in Commands.js)
        cy.putClaimHeader() // Setting window.easiClaim_Claim_ID in this promise (in Commands.js)
    })

    it("GET MemberReferrals", () => {
        cy.fixture("example").then(data => {
            // let dsl = data.MemberReferrals
            cy.request({
                method: "GET",
                url: "/" + Cypress.env("v2") + "/MemberReferrals/" + Cypress.env("member_ID_2"),
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                for (let ref in response.body.Data) {
                    if (ref.Status == 0) {
                        window.referral = ref
                        break
                    }
                }
                // expect(response.body.Data).to.equal(null)
            })
        })
    })
})