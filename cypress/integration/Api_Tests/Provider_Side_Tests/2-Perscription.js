/// <reference types="Cypress" />

describe("All Endpoints of Prescription.", () => {
    before(() => {
        // cy.visit("/")
    })

    window.Prescription_ID = null

    it("POST Prescription", () => {
        cy.fixture("Prescription_data").then(data => {
            let dsl = data.post
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Prescription",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl
            }).then((response) => {
                expect(response.status).equal(200)
                window.Prescription_ID = JSON.stringify(response.body.Data.Prescription_ID)
            })
        })
    })

    it("PUT Prescription", () => {
        cy.fixture("Prescription_data").then(data => {
            let dsl = data.put
            dsl.Prescription_ID = window.Prescription_ID
            cy.request({
                method: "PUT",
                url: "/" + Cypress.env("v2") + "/Prescription",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl
            }).then((response) => {
                expect(response.status).equal(200)
                expect(JSON.stringify(response.body.Data.Prescription_ID)).to.equal(window.Prescription_ID)
            })
        })
    })
})