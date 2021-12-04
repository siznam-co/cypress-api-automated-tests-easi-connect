/// <reference types="Cypress" />

describe("Endpoints", () => {
    before(() => {
        // cy.visit("/")
    })

    it("Endpoint GET ClaimDiagnosisCodes", () => {
        cy.fixture("example").then(data => {
            let dsl = data.ClaimDiagnosisCodes
            cy.request({
                method: "GET",
                url: "/" + Cypress.env("v2") + "/ClaimDiagnosisCodes/81278",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                expect(JSON.stringify(response.body.Data[0])).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint POST SearchDiagnosisCodes", () => {

        cy.fixture("example").then(data => {
            let dsl = data.SearchDiagnosisCodes
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/SearchDiagnosisCodes",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    SearchTerm: "Teeth"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint POST SearchProcedureCodes", () => {

        cy.fixture("example").then(data => {
            let dsl = data.SearchProcedureCodes
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/SearchProcedureCodes",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    SearchTerm: "Teeth"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint GET DosageTypes", () => {

        cy.fixture("example").then(data => {
            let dsl = data.DosageTypes
            cy.request({
                method: "GET",
                url: "/" + Cypress.env("v2") + "/DosageTypes",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint POST SearchProviders", () => {
        cy.fixture("example").then(data => {
            let dsl = data.SearchProviders
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/SearchProvidersCodes",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    SearchTerm: "Andrew"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint POST Prescription", () => {
        cy.fixture("example").then(data => {
            let dsl = data.Prescription
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Prescription",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    "Prescription_ID": 0,
                    "easiClaim_Claim_ID": "39390",
                    "Member_ID": "TPI1973-00001-03",
                    "Status": 0,
                    "DateCreated": "2021-11-29T10:30:52.7673627-05:00",
                    "CreatedBy": "JM0313I"
                }
            }).then((response) => {
                expect(response.status).equal(200)

            })
        })
    })

    it("Endpoint POST PrescribedDrug", () => {
        cy.fixture("example").then(data => {
            let dsl = data.PrescribedDrug
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/PrescribedDrug",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: {
                    "PrescribedDrugID": 0,
                    "PrescriptionID": 1113,
                    "easiClaim_Claim_ID": 81735,
                    "Member_ID": "TPI1973-00001-03",
                    "Status": 0,
                    "DrugCode": "ABB00060001",
                    "DrugName": "",
                    "ExpiryDate": "2021-12-29T10:30:52.7673627-05:00",
                    "RelatedDiagnosisCode": "520.2",
                    "AllowSubstitution": 0,
                    "Repeat": 2,
                    "DosageAmount": 1,
                    "DosageType": 9,
                    "Period": 1,
                    "DosagePerPeriod": 1,
                    "DosagePeriodType": 0,
                    "OtherDosagePeriod": "",
                    "OtherDosageType": "",
                    "Comments": "",
                    "OriginalUnits": 0,
                    "LastUpdated": "2021-11-29T10:30:52.7673627-05:00",
                    "DateCreated": "2021-11-29T10:30:52.7673627-05:00",
                    "CreatedBy": "JM0313I"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
            })
        })
    })

    it("Endpoint POST ClaimHeader", () => {
        cy.request({
            method: "POST",
            url: "/" + Cypress.env("v2") + "/ClaimHeader",
            headers: {
                "Authorization": Cypress.env("provider_basicAuth"),
                "Content-Type": "application/json"
            },
            body: {
                "Provider_ID": "P1000_1",
                "member_ID": "TPI1973-00001-03",
                "Comment": "",
                "ScantTypeCode": 2
            }
        }).then((response) => {
            expect(response.status).equal(200)
        })
    })
})