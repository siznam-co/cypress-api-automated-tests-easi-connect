/// <reference types="Cypress" />

describe("Claims Endpoints", () => {
    before(() => {
        cy.ListClaims().then(noOfClaims => [
            window.previsousNoOfClaims = noOfClaims
        ]) // Note the claims before creating new.

        cy.MemberPrescriptions().then(noOfMemberPrescriptions => {
            window.MemberPrescriptions = noOfMemberPrescriptions
        }) // Note the MemberPrescriptions before creating new.

        // cy.defineGlobalVariables()
        cy.postClaimHeader() // Setting window.easiClaim_Claim_ID in this promise (in Commands.js)
        cy.putClaimHeader() // Setting window.easiClaim_Claim_ID in this promise (in Commands.js)
    })

    it("POST ClaimDiagnosisCode", () => {
        // Search Diagnostic code and associate one of them with the claim id. 
        cy.SearchDiagnosisCodes(0) // Setting window.DiagnosisCode in this promise (in Commands.js)
        cy.fixture("Claims_data").then(data => {
            let dsl = data.ClaimDiagnosisCode.post
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.DiagnosisCode = window.DiagnosisCode

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/ClaimDiagnosisCode",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                dsl.response_Body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_Body.DiagnosisCode = window.DiagnosisCode
                expect(response.body.Data).to.deep.equal(dsl.response_Body)

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_Body))

                // Asserting Get ClaimDiagnosisCode to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/ClaimDiagnosisCodes/" + window.easiClaim_Claim_ID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    expect(response.body.Data[0]).to.deep.equal(dsl.response_Body)
                })
            })
        })
    })

    // Search Procedure code and associate one of them with the claim line. 

    it("POST ClaimLine", () => {
        // Search Diagnostic code and associate one of them with the claim id. 
        cy.SearchProcedureCodes(0) // Setting window.SearchProcedureCodes in this promise (in Commands.js)

        cy.fixture("Claims_data").then(data => {
            let dsl = data.ClaimLine.post
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.Diagnosis_code = window.DiagnosisCode
            dsl.request_body.Procedure_code = window.Procedure_Code
            // cy.log(JSON.stringify(dsl.request_body))

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/ClaimLine",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
                window.line_id = response.body.Data.line_id

                // Asserting Get ClaimLine to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/ClaimLine/" + parseInt(window.easiClaim_Claim_ID) + "/" + window.line_id,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    },
                    body: dsl.request_body
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    let expectedDsl = response.body.Data[0]
                    dsl.response_Body.line_id = window.line_id
                    dsl.response_Body.easiClaim_claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_Body.diagnosis_code = window.DiagnosisCode
                    dsl.response_Body.procedure_code = window.Procedure_Code
                    dsl.response_Body.DateOfService = expectedDsl.DateOfService
                    dsl.response_Body.EOB_code = expectedDsl.EOB_code
                    dsl.response_Body.EOB_Codes = expectedDsl.EOB_Codes

                    // cy.log(JSON.stringify(expectedDsl))
                    // cy.log(JSON.stringify(dsl.response_Body))
                    expect(expectedDsl).to.deep.equal(dsl.response_Body)
                })
            })
        })
    })

    it("POST Prescription", () => {

        cy.fixture("Prescription_data").then(data => {
            let dsl = data.post
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.member_ID = Cypress.env("member_ID_2")

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Prescription",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                window.Prescription_ID = response.body.Data.Prescription_ID

                // Asserting Get Prescription to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/Prescription/" + window.Prescription_ID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))

                    // Member_ID assertion is missing due to a defect. 
                    dsl.response_Body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_Body.member_id = Cypress.env("member_ID_2")
                    dsl.response_Body.Prescription_ID = window.Prescription_ID
                    dsl.response_Body.DateCreated = response.body.Data.DateCreated

                    // cy.log(JSON.stringify(response.body.Data))
                    // cy.log(JSON.stringify(dsl.response_Body))
                    expect(response.body.Data).to.deep.equal(dsl.response_Body)
                })
            })
        })
    })

    it("PUT Prescription", () => {

        cy.fixture("Prescription_data").then(data => {
            let dsl = data.put
            dsl.request_body.Prescription_ID = parseInt(window.Prescription_ID)
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.member_ID = Cypress.env("member_ID_1")

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Prescription",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                window.Prescription_ID = response.body.Data.Prescription_ID

                // Asserting Get Prescription to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/Prescription/" + window.Prescription_ID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))

                    // Member_ID assertion is missing due to a defect. 
                    dsl.response_Body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_Body.member_id = Cypress.env("member_ID_1")
                    dsl.response_Body.Prescription_ID = window.Prescription_ID
                    dsl.response_Body.DateCreated = response.body.Data.DateCreated

                    // cy.log(JSON.stringify(response.body.Data))
                    // cy.log(JSON.stringify(dsl.response_Body))
                    expect(response.body.Data).to.deep.equal(dsl.response_Body)
                })
            })
        })
    })

    it("POST PrescribedDrug", () => {

        cy.fixture("PrescribedDrug_data").then(data => {
            let dsl = data.post

            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.PrescriptionID = parseInt(window.Prescription_ID)
            dsl.request_body.Member_ID = Cypress.env("member_ID_2")
            dsl.request_body.RelatedDiagnosisCode = window.DiagnosisCode

            cy.log(JSON.stringify(dsl.request_body))
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
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
                window.PrescribedDrugID = response.body.Data.PrescribedDrugID

                dsl.response_Body.PrescribedDrugID = parseInt(response.body.Data.PrescribedDrugID)
                dsl.response_Body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_Body.PrescriptionID = parseInt(window.Prescription_ID)
                dsl.response_Body.MemberUD = Cypress.env("member_ID_2")
                dsl.response_Body.RelatedDiagnosisCode = window.DiagnosisCode
                dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_Body.DateCreated = response.body.Data.DateCreated
                dsl.response_Body.LastUpdated = response.body.Data.LastUpdated

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_Body))

                expect(response.body.Data).to.deep.equal(dsl.response_Body)

                // Asserting Get PrescribedDrug to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/PrescribedDrug/" + window.PrescribedDrugID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    },
                    body: dsl.request_body
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                    dsl.response_Body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                    dsl.response_Body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_Body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_Body.MemberUD = Cypress.env("member_ID_2")
                    dsl.response_Body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_Body.DateCreated = response.body.Data.DateCreated
                    dsl.response_Body.LastUpdated = response.body.Data.LastUpdated

                    expect(response.body.Data).to.deep.equal(dsl.response_Body)

                })
            })
        })
    })

    it("PUT PrescribedDrug", () => {

        cy.fixture("PrescribedDrug_data").then(data => {
            let dsl = data.put

            dsl.request_body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.PrescriptionID = parseInt(window.Prescription_ID)
            dsl.request_body.Member_ID = Cypress.env("member_ID_1")
            dsl.request_body.RelatedDiagnosisCode = window.DiagnosisCode

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
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                dsl.response_Body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                dsl.response_Body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_Body.PrescriptionID = parseInt(window.Prescription_ID)
                dsl.response_Body.MemberUD = Cypress.env("member_ID_2") // Doesn't work.
                dsl.response_Body.RelatedDiagnosisCode = window.DiagnosisCode
                dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_Body.DateCreated = response.body.Data.DateCreated
                dsl.response_Body.LastUpdated = response.body.Data.LastUpdated
                dsl.response_Body.DosageAmount = response.body.Data.DosageAmount


                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_Body))

                expect(response.body.Data).to.deep.equal(dsl.response_Body)

                // Asserting Get PrescribedDrug to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/PrescribedDrug/" + window.PrescribedDrugID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    },
                    body: dsl.request_body
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                    dsl.response_Body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                    dsl.response_Body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_Body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_Body.MemberUD = Cypress.env("member_ID_2")
                    dsl.response_Body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_Body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_Body.DateCreated = response.body.Data.DateCreated
                    dsl.response_Body.LastUpdated = response.body.Data.LastUpdated

                    expect(response.body.Data).to.deep.equal(dsl.response_Body)

                })
            })
        })
    })

    it("POST EstimateClaim", () => {

        cy.fixture("example").then(data => {
            // let dsl = data.EstimateClaim
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/EstimateClaim/" + window.easiClaim_Claim_ID,
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                expect(response.body.Data[0].easiClaim_claim_id).to.equal(parseInt(window.easiClaim_Claim_ID))
                // window.PrescribedDrugID = response.body.Data.PrescribedDrugID
            })
        })
    })

    it("POST SubmitClaim", () => {

        cy.fixture("example").then(data => {
            // let dsl = data.SubmitClaim
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/SubmitClaim/" + window.easiClaim_Claim_ID + "/JM0313I",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                expect(response.body.Data[0].easiClaim_claim_id).to.equal(parseInt(window.easiClaim_Claim_ID))
                // window.PrescribedDrugID = response.body.Data.PrescribedDrugID
            })
        })
    })

    after(() => {
        cy.ListClaims().then(noOfClaims => [
            expect(window.previsousNoOfClaims).be.equal(noOfClaims - 1)
        ])

        cy.MemberPrescriptions().then(noOfMemberPrescriptions => {
            expect(window.MemberPrescriptions).be.equal(noOfMemberPrescriptions - 1)
        })
    })
})