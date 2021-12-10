/// <reference types="Cypress" />

describe("Pre Requisites.", () => {
    before(() => {
        // cy.defineGlobalVariables()
    })

    window.otucode = null

    // Get otucode

    it("POST otucode", () => {

        cy.fixture("example").then(data => {
            // let dsl = data.otucode
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/otucode",
                headers: {
                    "Authorization": Cypress.env("basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    "member_ID": Cypress.env("member_ID_1"),
                    "CardIDCode": "GLIP"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
                window.otucode = response.body.Data.Code
            })
        })
    })

    // Eligibility Check missing.

    // Check MemberReferrals before

    // it("GET MemberReferrals", () => {
    //     cy.fixture("example").then(data => {
    //         // let dsl = data.MemberReferrals
    //         cy.request({
    //             method: "GET",
    //             url: "/" + Cypress.env("v2") + "/MemberReferrals/" + Cypress.env("member_ID_1"),
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             expect(response.body.Data).to.equal(null)
    //         })
    //     })
    // })

})