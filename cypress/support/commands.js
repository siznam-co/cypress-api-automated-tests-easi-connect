/// <reference types="Cypress" />

import 'cypress-mailosaur'

let LOCAL_STORAGE_MEMORY = {}

const modifierKey = Cypress.platform === "darwin" ? "meta" : "ctrl"

// Below github uuid is unique during execution globally and use it for all user, team, templates, checklist, inventory etc operations.
window.uniqueId = generateUUID()

export function generateUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id.split("-")[4]
}

export function generateFullUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id
}

export function getColor(type) {
    switch (type) {
        case "valid":
            return "rgb(4, 9, 48)"
        case "invalid":
            return "rgb(255, 130, 130)"
        case "validBorder":
            return "rgb(219, 220, 221)"
    }
}

function numToWords(num) {
    var a = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "]
    var b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

    if ((num = num.toString()).length > 9) return "overflow"
    let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return; var str = ""
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore " : ""
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh " : ""
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand " : ""
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred " : ""
    str += (n[5] != 0) ? ((str != "") ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : ""
    return str.trim()
}

export function getUniqueName(previousName) {   // theqa13119+User1
    let firstHalf = previousName.split("_")[0]
    let newName = firstHalf + "_" + window.uniqueId    // theqa13119 + '+' + asdj23j 
    return newName
}

export function getUniqueEmail(previousEmail) { // theqa13119+User1@gmail.com
    let firstHalf = previousEmail.split("+")[0]                   // theqa13119
    let secondHalf = previousEmail.split("@")[1]                      // gmail.com
    let newEmail = firstHalf + "+" + window.uniqueId + "@" + secondHalf    // theqa13119 + '+' + 23jkq3jkbf + '@' + gmail.com
    return newEmail
}

Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
})

Cypress.Commands.add("restoreLocalStorage", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
    })
})

Cypress.Commands.add("postClaimHeader", () => {

    cy.fixture("Claims_data").then(data => {
        let dsl = data.ClaimHeader.post
        dsl.request_body.Provider_ID = Cypress.env("Provider_ID_2")
        dsl.request_body.member_ID = Cypress.env("member_ID_2")

        cy.request({
            method: "POST",
            url: "/" + Cypress.env("v2") + "/ClaimHeader",
            headers: {
                "Authorization": Cypress.env("provider_basicAuth"),
                "Content-Type": "application/json"
            },
            body: dsl.request_body
        }).then((response) => {
            expect(response.status).equal(200)
            window.easiClaim_Claim_ID = response.body.Data.easiClaim_Claim_ID

            // GET the claimHeader and assert the response
            cy.request({
                method: "GET",
                url: "/" + Cypress.env("v2") + "/ClaimHeader/" + parseInt(window.easiClaim_Claim_ID),
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                dsl.response_body.easiClaim_claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_body.provider_id = Cypress.env("Provider_ID_2")
                dsl.response_body.member_id = Cypress.env("member_ID_2")
                dsl.response_body.DateOfService = response.body.Data.DateOfService
                dsl.response_body.dateCreated = response.body.Data.dateCreated
                dsl.response_body.DateLastModified = response.body.Data.DateLastModified
                dsl.response_body.DOB = response.body.Data.DOB

                // cy.log(JSON.stringify(response.body.Data))
                // cy.log(JSON.stringify(dsl.response_body))

                expect(response.body.Data).to.deep.equal(dsl.response_body)
            })
        })
    })
})

Cypress.Commands.add("putClaimHeader", () => {

    cy.fixture("Claims_data").then(data => {
        let dsl = data.ClaimHeader.put
        dsl.request_body.Provider_ID = Cypress.env("Provider_ID_1")
        dsl.request_body.member_ID = Cypress.env("member_ID_1")
        dsl.request_body.Comment = parseInt(window.easiClaim_Claim_ID) + ": " + dsl.request_body.Comment
        dsl.request_body.easiClaim_Claim_ID = window.easiClaim_Claim_ID

        cy.request({
            method: "PUT",
            url: "/" + Cypress.env("v2") + "/ClaimHeader",
            headers: {
                "Authorization": Cypress.env("provider_basicAuth"),
                "Content-Type": "application/json"
            },
            body: dsl.request_body
        }).then((response) => {
            expect(response.status).equal(200)
            // cy.log(JSON.stringify(response.body.Data))

            window.easiClaim_Claim_ID = response.body.Data.easiClaim_Claim_ID

            // GET the claimHeader and assert the response
            cy.request({
                method: "GET",
                url: "/" + Cypress.env("v2") + "/ClaimHeader/" + parseInt(window.easiClaim_Claim_ID),
                headers: {
                    "Authorization": Cypress.env("provider_basicAuth"),
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                expect(response.status).equal(200)
                // cy.log(JSON.stringify(response.body.Data))
                dsl.response_body.easiClaim_claim_id = parseInt(window.easiClaim_Claim_ID)
                dsl.response_body.provider_id = Cypress.env("Provider_ID_1")
                dsl.response_body.member_id = Cypress.env("member_ID_1")
                dsl.response_body.DateOfService = response.body.Data.DateOfService
                dsl.response_body.dateCreated = response.body.Data.dateCreated
                dsl.response_body.DateLastModified = response.body.Data.DateLastModified
                dsl.response_body.DOB = response.body.Data.DOB
                dsl.response_body.Comment = parseInt(window.easiClaim_Claim_ID) + ": " + dsl.response_body.Comment

                expect(response.body.Data).to.deep.equal(dsl.response_body)
            })
        })
    })
})

Cypress.Commands.add("SearchDiagnosisCodes", (choice) => {
    cy.fixture("Claims_data").then(data => {
        let dsl = data.SearchDiagnosisCodes
        cy.request({
            method: "POST",
            url: "/" + Cypress.env("v2") + "/SearchDiagnosisCodes",
            headers: {
                "Authorization": Cypress.env("provider_basicAuth"),
                "Content-Type": "application/json"
            },
            body: {
                "SearchTerm": "Teeth"
            }
        }).then((response) => {
            expect(response.status).equal(200)
            // cy.log(JSON.stringify(response.body.Data))
            expect(response.body.Data).to.deep.equal(dsl)
            window.DiagnosisCode = response.body.Data.Result[choice].Diagnosis_Code
        })
    })
})

Cypress.Commands.add("SearchProcedureCodes", (choice) => {
    cy.fixture("Claims_data").then(data => {
        let dsl = data.SearchProcedureCodes
        cy.request({
            method: "POST",
            url: "/" + Cypress.env("v2") + "/SearchProcedureCodes",
            headers: {
                "Authorization": Cypress.env("provider_basicAuth"),
                "Content-Type": "application/json"
            },
            body: {
                "SearchTerm": "teeth"
            }
        }).then((response) => {
            expect(response.status).equal(200)
            // cy.log(JSON.stringify(response.body.Data))
            expect(response.body.Data).to.deep.equal(dsl)
            window.Procedure_Code = response.body.Data.Result[choice].Procedure_Code
        })
    })
})

Cypress.Commands.add("ListClaims", () => {
    cy.request({
        method: "POST",
        url: "/" + Cypress.env("v2") + "/ListClaims",
        headers: {
            "Authorization": Cypress.env("provider_basicAuth"),
            "Content-Type": "application/json"
        },
        body: {
            "FromDate": "2021-12-09 00:45",
            "ToDate": "2022-12-9 09:45"
        }
    }).then((response) => {
        expect(response.status).equal(200)
        // cy.log(JSON.stringify(response.body.Data))
        return parseInt(response.body.Data.TotalRecords)
    })
})

Cypress.Commands.add("MemberPrescriptions", (provid) => {
    cy.request({
        method: "GET",
        url: "/" + Cypress.env("v2") + "/MemberPrescriptions/" + provid,
        headers: {
            "Authorization": Cypress.env("provider_basicAuth"),
            "Content-Type": "application/json"
        }
    }).then((response) => {
        expect(response.status).equal(200)
        // cy.log(JSON.stringify(response.body.Data))
        return response.body.Data.length
    })
})

Cypress.Commands.add("MemberReferrals", (member_ID) => {
    cy.request({
        method: "GET",
        url: "/" + Cypress.env("v2") + "/MemberReferrals/" + member_ID,
        headers: {
            "Authorization": Cypress.env("provider_basicAuth"),
            "Content-Type": "application/json"
        }
    }).then((response) => {
        expect(response.status).equal(200)
        // cy.log(JSON.stringify(response.body.Data))
        return response.body.Data.length
    })
})