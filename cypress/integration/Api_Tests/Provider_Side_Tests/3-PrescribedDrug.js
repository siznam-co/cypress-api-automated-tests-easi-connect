/// <reference types="Cypress" />

describe("All Endpoints of PrescribedDrug", () => {
    before(() => {
        // cy.visit("/")
    })

    window.PrescribedDrugID = null

    it("POST PrescribedDrug", () => {
        cy.fixture("PrescribedDrug_data").then(data => {
            let dsl = data.post
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/PrescribedDrug",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                window.PrescribedDrugID = parseInt(JSON.stringify(response.body.Data.PrescribedDrugID))
                // Difference in POST request body and response body.
                dsl.response_Body.PrescribedDrugID = parseInt(JSON.stringify(response.body.Data.PrescribedDrugID))
                dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_Body.DateCreated = response.body.Data.DateCreated
                dsl.response_Body.LastUpdated = response.body.Data.LastUpdated

                expect(dsl.response_Body).to.deep.equal(response.body.Data)
            })
        })
    })

    it("PUT PrescribedDrug", () => {
        cy.fixture("PrescribedDrug_data").then(data => {
            let dsl = data.put
            dsl.request_body.PrescribedDrugID = window.PrescribedDrugID
            cy.request({
                method: "PUT",
                url: "/" + Cypress.env("v2") + "/PrescribedDrug",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // Difference in POST request body and response body.
                dsl.response_Body.PrescribedDrugID = window.PrescribedDrugID
                dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_Body.DateCreated = response.body.Data.DateCreated
                dsl.response_Body.LastUpdated = response.body.Data.LastUpdated

                cy.log(JSON.stringify(dsl.response_Body))
                cy.log(JSON.stringify(response.body.Data))
                // expect(dsl.response_Body).to.deep.equal(response.body.Data)
            })
        })
    })
})
