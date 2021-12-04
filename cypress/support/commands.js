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
