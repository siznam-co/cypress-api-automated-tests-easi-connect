/// <reference types="Cypress" />

describe("Complete Flows", () => {
    before(() => {
        cy.ListClaims().then(noOfClaims => [
            window.previsousNoOfClaims = noOfClaims
        ]) // Note the claims before creating new.

        cy.MemberPrescriptions(Cypress.env("member_ID_1")).then(noOfMemberPrescriptions => {
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

            console.log(JSON.stringify(dsl.request_body))

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
                dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_body.DiagnosisCode = window.DiagnosisCode
                expect(response.body.Data).to.deep.equal(dsl.response_body)

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

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
                    expect(response.body.Data[0]).to.deep.equal(dsl.response_body)
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
                    dsl.response_body.line_id = window.line_id
                    dsl.response_body.easiClaim_claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_body.diagnosis_code = window.DiagnosisCode
                    dsl.response_body.procedure_code = window.Procedure_Code
                    dsl.response_body.DateOfService = expectedDsl.DateOfService
                    dsl.response_body.EOB_code = expectedDsl.EOB_code
                    dsl.response_body.EOB_Codes = expectedDsl.EOB_Codes

                    // cy.log(JSON.stringify(expectedDsl))
                    // cy.log(JSON.stringify(dsl.response_body))
                    expect(expectedDsl).to.deep.equal(dsl.response_body)
                })
            })
        })
    })

    it("POST Prescription", () => {

        cy.fixture("Prescription_data").then(data => {
            let dsl = data.post
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            // dsl.request_body.member_ID = Cypress.env("member_ID_1") // Bug

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
                    dsl.response_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_body.member_id = Cypress.env("member_ID_1") // Bug
                    dsl.response_body.Prescription_ID = window.Prescription_ID
                    dsl.response_body.DateCreated = response.body.Data.DateCreated

                    cy.log(JSON.stringify(response.body.Data))
                    cy.log(JSON.stringify(dsl.response_body))
                    // expect(response.body.Data).to.deep.equal(dsl.response_body)
                })
            })
        })
    })

    it("PUT Prescription", () => {

        cy.fixture("Prescription_data").then(data => {
            let dsl = data.put
            dsl.request_body.Prescription_ID = parseInt(window.Prescription_ID)
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            // dsl.request_body.member_ID = Cypress.env("member_ID_1") // Bug

            cy.request({
                method: "PUT",
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

                // Asserting Get Prescription to check whether it was Updated or not.
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
                    dsl.response_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_body.member_id = Cypress.env("member_ID_1") // Bug
                    dsl.response_body.Prescription_ID = window.Prescription_ID
                    dsl.response_body.DateCreated = response.body.Data.DateCreated

                    // cy.log(JSON.stringify(response.body.Data))
                    // cy.log(JSON.stringify(dsl.response_body))
                    expect(response.body.Data).to.deep.equal(dsl.response_body)
                })
            })
        })
    })

    it("POST PrescribedDrug", () => {

        cy.fixture("PrescribedDrug_data").then(data => {
            let dsl = data.post

            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.PrescriptionID = parseInt(window.Prescription_ID)
            dsl.request_body.Member_ID = Cypress.env("member_ID_1")
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

                dsl.response_body.PrescribedDrugID = parseInt(response.body.Data.PrescribedDrugID)
                dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                dsl.response_body.MemberUD = Cypress.env("member_ID_1")
                dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_body.DateCreated = response.body.Data.DateCreated
                dsl.response_body.LastUpdated = response.body.Data.LastUpdated

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

                expect(response.body.Data).to.deep.equal(dsl.response_body)

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

                    dsl.response_body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                    dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_body.MemberUD = Cypress.env("member_ID_1")
                    dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_body.DateCreated = response.body.Data.DateCreated
                    dsl.response_body.LastUpdated = response.body.Data.LastUpdated

                    expect(response.body.Data).to.deep.equal(dsl.response_body)

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

                dsl.response_body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                dsl.response_body.MemberUD = Cypress.env("member_ID_1") // Doesn't work.
                dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                dsl.response_body.DateCreated = response.body.Data.DateCreated
                dsl.response_body.LastUpdated = response.body.Data.LastUpdated
                dsl.response_body.DosageAmount = response.body.Data.DosageAmount


                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

                expect(response.body.Data).to.deep.equal(dsl.response_body)

                // Asserting Get PrescribedDrug to check whether it was Updated or not.
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

                    dsl.response_body.PrescribedDrugID = parseInt(window.PrescribedDrugID)
                    dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_body.MemberUD = Cypress.env("member_ID_1")
                    dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_body.DateCreated = response.body.Data.DateCreated
                    dsl.response_body.LastUpdated = response.body.Data.LastUpdated

                    expect(response.body.Data).to.deep.equal(dsl.response_body)

                })
            })
        })
    })

    // Entering a referral that can be used in next test

    it("POST Referral", () => {

        cy.fixture("Referral_data").then(data => {
            let dsl = data.post

            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.Member_ID = Cypress.env("member_ID_1")
            dsl.request_body.RelatedDiagnosisCode = window.DiagnosisCode
            dsl.request_body.ReferredServiceCode = window.Procedure_Code
            dsl.request_body.ReferToProviderID = "TT" + Cypress.env("Provider_ID_1")

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Referral",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
                window.ReferralID = response.body.Data.Referral_ID

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

                // Asserting Get Referral to check whether it was POSTED or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/Referral/" + window.ReferralID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    },
                    body: dsl.request_body
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                    dsl.response_body.Referral_ID = parseInt(window.ReferralID)
                    dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_body.MemberUD = Cypress.env("member_ID_1") // bug
                    dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_body.RelatedDiagnosis = response.body.Data.RelatedDiagnosis
                    dsl.response_body.ReferToProviderID = "TT" + Cypress.env("Provider_ID_1")
                    dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_body.ReferedServiceCode = window.Procedure_Code
                    dsl.response_body.ReferedService = response.body.Data.ReferedService
                    dsl.response_body.DateCreated = response.body.Data.DateCreated
                    dsl.response_body.LastUpdated = response.body.Data.LastUpdated

                    // cy.log(JSON.stringify(response.body.Data))
                    // cy.log(JSON.stringify(dsl.response_body))

                    expect(response.body.Data).to.deep.equal(dsl.response_body)

                })
            })
        })
    })

    it("PUT Referral", () => {

        cy.fixture("Referral_data").then(data => {
            let dsl = data.put

            dsl.request_body.ReferralID = parseInt(window.ReferralID)
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.Member_ID = Cypress.env("member_ID_1")
            dsl.request_body.RelatedDiagnosisCode = window.DiagnosisCode
            dsl.request_body.ReferredServiceCode = window.Procedure_Code
            dsl.request_body.ReferToProviderID = "TT" + Cypress.env("Provider_ID_2")

            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/Referral",
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

                // Asserting Get Referral to check whether it was Updated or not.
                cy.request({
                    method: "GET",
                    url: "/" + Cypress.env("v2") + "/Referral/" + window.ReferralID,
                    headers: {
                        "Authorization": Cypress.env("provider_basicAuth"),
                        "Content-Type": "application/json"
                    },
                    body: dsl.request_body
                }).then((response) => {
                    expect(response.status).equal(200)
                    // cy.log(JSON.stringify(response.body.Data))
                    // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))

                    dsl.response_body.Referral_ID = parseInt(window.ReferralID)
                    dsl.response_body.Claim_id = parseInt(window.easiClaim_Claim_ID)
                    // dsl.response_body.PrescriptionID = parseInt(window.Prescription_ID)
                    dsl.response_body.MemberUD = Cypress.env("member_ID_1")
                    dsl.response_body.RelatedDiagnosisCode = window.DiagnosisCode
                    dsl.response_body.RelatedDiagnosis = response.body.Data.RelatedDiagnosis
                    dsl.response_body.ReferToProviderID = "TT" + Cypress.env("Provider_ID_2")
                    dsl.response_body.ExpiryDate = response.body.Data.ExpiryDate
                    dsl.response_body.ReferedServiceCode = window.Procedure_Code
                    dsl.response_body.ReferedService = response.body.Data.ReferedService
                    dsl.response_body.DateCreated = response.body.Data.DateCreated
                    dsl.response_body.LastUpdated = response.body.Data.LastUpdated

                    expect(response.body.Data).to.deep.equal(dsl.response_body)

                })
            })
        })
    })

    it("POST ConfirmReferral", () => {

        cy.fixture("example").then(data => {
            // let dsl = data.ConfirmReferral
            cy.request({
                method: "POST",
                url: "/" + Cypress.env("v2") + "/ConfirmReferral/" + window.easiClaim_Claim_ID + "/" + window.ReferralID,
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                cy.log(JSON.stringify(response.body.Data))
                // expect(response.body.Data[0].easiClaim_claim_id).to.equal(parseInt(window.easiClaim_Claim_ID))
                window.line_id = response.body.Data.line_id
            })
        })
    })

    it("PUT ClaimLine", () => {
        // Search Diagnostic code and associate one of them with the claim id. 
        cy.SearchProcedureCodes(2) // Setting window.SearchProcedureCodes in this promise (in Commands.js)
        cy.SearchDiagnosisCodes(2) // Setting window.DiagnosisCode in this promise (in Commands.js)

        cy.fixture("Claims_data").then(data => {
            let dsl = data.ClaimLine.put
            dsl.request_body.easiClaim_Claim_ID = parseInt(window.easiClaim_Claim_ID)
            dsl.request_body.Diagnosis_code = window.DiagnosisCode
            dsl.request_body.Procedure_code = window.Procedure_Code
            // cy.log(JSON.stringify(dsl.request_body))

            cy.request({
                method: "PUT",
                url: "/" + Cypress.env("v2") + "/ClaimLine/" + window.easiClaim_Claim_ID + "/" + window.line_id,
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                },
                body: dsl.request_body
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
                expect(parseInt(window.line_id)).to.equal(response.body.Data.line_id)

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
                    dsl.response_body.line_id = window.line_id
                    dsl.response_body.easiClaim_claim_id = parseInt(window.easiClaim_Claim_ID)
                    dsl.response_body.diagnosis_code = window.DiagnosisCode
                    dsl.response_body.procedure_code = window.Procedure_Code
                    dsl.response_body.DateOfService = expectedDsl.DateOfService
                    dsl.response_body.EOB_code = expectedDsl.EOB_code
                    dsl.response_body.EOB_Codes = expectedDsl.EOB_Codes

                    cy.log(JSON.stringify(expectedDsl))
                    cy.log(JSON.stringify(dsl.response_body))
                    // expect(expectedDsl).to.deep.equal(dsl.response_body)
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
                // window.ReferralID = response.body.Data.ReferralID
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

        cy.MemberPrescriptions(Cypress.env("member_ID_1")).then(noOfMemberPrescriptions => {
            expect(window.MemberPrescriptions).be.equal(noOfMemberPrescriptions - 1)
        })
    })
})