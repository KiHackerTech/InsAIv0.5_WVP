import React from "react"

function BaseAPIURL(){
    return "http://localhost:3306/"
}

function PasswordLengthMin(){
    return 8
}

export {BaseAPIURL, PasswordLengthMin}