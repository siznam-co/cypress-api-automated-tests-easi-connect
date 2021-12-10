/// <reference types="Cypress" />

describe("Positive Flow", () => {
    before(() => {
        // cy.defineGlobalVariables()
    })

    window.otucode = null
    window.easiClaim_Claim_ID = null
    window.DiagnosisCode = null
    window.line_id = null
    window.Prescription_ID = null
    window.PrescribedDrugID = null

    // Get otucode

    // it("POST otucode", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.otucode
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/otucode",
    //             headers: {
    //                 "Authorization": Cypress.env("basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "member_ID": "TPI1973-00001-01",
    //                 "CardIDCode": "GLIP"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.otucode = response.body.Data.Code
    //             Cypress.env("member_ID_1") = response.body.Data.Member_ud
    //         })
    //     })
    // })

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

    // it("POST ClaimHeader", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.ClaimHeader
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/ClaimHeader",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "Provider_ID": Cypress.env("Provider_ID_1"),
    //                 "member_ID": Cypress.env("member_ID_1"),
    //                 "Comment": "Claim header by Bot"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.easiClaim_Claim_ID = response.body.Data.easiClaim_Claim_ID
    //         })
    //     })
    // })

    // // Search Diagnostic code and associate one of them with the claim id. 

    // it("POST ClaimDiagnosisCode", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.ClaimDiagnosisCode
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/ClaimDiagnosisCode",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "easiClaim_Claim_ID": window.easiClaim_Claim_ID,
    //                 "DiagnosisCode": "524.35",
    //                 "ReferralID": 0,
    //                 "PrescribedDrugID": 0,
    //                 "PrescriptionID": 0
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.DiagnosisCode = response.body.Data.DiagnosisCode

    //         })
    //     })
    // })

    // // Search Procedure code and associate one of them with the claim line. 

    // it("POST ClaimLine", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.ClaimLine
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/ClaimLine",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "easiClaim_Claim_ID": window.easiClaim_Claim_ID,
    //                 "Procedure_code": "00170",
    //                 "Diagnosis_code": window.DiagnosisCode,
    //                 "Units": 2,
    //                 "CostPerUnit": "120",
    //                 "OralArea": "",
    //                 "Modifier": "",
    //                 "PlaceOfService": 13,
    //                 "DrugInfo": "More than one to be taken"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.line_id = response.body.Data.line_id
    //         })
    //     })
    // })

    // it("POST Prescription", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.Prescription
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/Prescription",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "Prescription_ID": 0,
    //                 "easiClaim_Claim_ID": window.easiClaim_Claim_ID,
    //                 "Status": 0,
    //                 "Member_ID": Cypress.env("member_ID_1"),
    //                 "DateCreated": "2021-12-09T10:30:52.7673627-05:00", // Need to get current date/time here.
    //                 "CreatedBy": "JM0313I"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.Prescription_ID = response.body.Data.Prescription_ID
    //         })
    //     })
    // })

    // it("POST PrescribedDrug", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.PrescribedDrug
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/PrescribedDrug",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             },
    //             body: {
    //                 "PrescribedDrugID": 0,
    //                 "PrescriptionID": window.Prescription_ID,
    //                 "easiClaim_Claim_ID": window.easiClaim_Claim_ID,
    //                 "Member_ID": Cypress.env("member_ID_1"),
    //                 "Status": 0,
    //                 "DrugCode": "ABB00060001",
    //                 "DrugName": "",
    //                 "ExpiryDate": "2023-12-29T10:30:52.7673627-05:00",
    //                 "RelatedDiagnosisCode": window.DiagnosisCode,
    //                 "AllowSubstitution": 0,
    //                 "Repeat": 2,
    //                 "DosageAmount": 1,
    //                 "DosageType": 9,
    //                 "Period": 1,
    //                 "DosagePerPeriod": 1,
    //                 "DosagePeriodType": 0,
    //                 "OtherDosagePeriod": "",
    //                 "OtherDosageType": "",
    //                 "Comments": "",
    //                 "OriginalUnits": 0,
    //                 "LastUpdated": "2021-11-29T10:30:52.7673627-05:00",
    //                 "DateCreated": "2021-11-29T10:30:52.7673627-05:00",
    //                 "CreatedBy": "JM0313I"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             // expect(JSON.stringify(response.body.Data)).to.deep.equal(JSON.stringify(dsl))
    //             window.PrescribedDrugID = response.body.Data.PrescribedDrugID
    //         })
    //     })
    // })

    // FillPrescribedDrug can also be added as a second line item.

    // it("POST EstimateClaim", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.EstimateClaim
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/EstimateClaim/" + window.easiClaim_Claim_ID,
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             expect(response.body.Data[0].easiClaim_claim_id).to.equal(parseInt(window.easiClaim_Claim_ID))
    //             // window.PrescribedDrugID = response.body.Data.PrescribedDrugID
    //         })
    //     })
    // })

    // it("POST SubmitClaim", () => {

    //     cy.fixture("example").then(data => {
    //         // let dsl = data.SubmitClaim
    //         cy.request({
    //             method: "POST",
    //             url: "/" + Cypress.env("v2") + "/SubmitClaim/" + window.easiClaim_Claim_ID + "/JM0313I",
    //             headers: {
    //                 "Authorization": Cypress.env("provider_basicAuth"),
    //                 "Content-Type": "application/json"
    //             }
    //         }).then((response) => {
    //             expect(response.status).equal(200)
    //             // cy.log(JSON.stringify(response.body.Data))
    //             expect(response.body.Data[0].easiClaim_claim_id).to.equal(parseInt(window.easiClaim_Claim_ID))
    //             // window.PrescribedDrugID = response.body.Data.PrescribedDrugID
    //         })
    //     })
    // })
})