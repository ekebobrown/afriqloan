'use server'

import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'
import { customAlphabet } from 'nanoid'
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs"

import Auth from '@/app/lib/auth';
import Connection from "@/app/lib/db"
import { Activation, Invitation } from '@/app/lib/mailer';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
const digits = customAlphabet('1234567890', 10)

export async function submitForm(state, formData) {
    const session_token = cookies().get("session_token")?.value
    const entries = Object.fromEntries(formData)
    Object.keys(entries).forEach(key => {if(key.startsWith('$ACTION_')){delete entries[key]}})
    //Check for extra information in the state and add to form entries
    if(Object.hasOwn(state, 'status')){
        entries.status = state.status
        entries.image = state.image
    }
    //Submit form entries
    const response = await fetch(`${process.env.SITE_URL}/${state.api}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${session_token}`
        },
        body: JSON.stringify(entries)
    })
    const data = await response.json()
    //Confirm submission
    if (response.ok) {
        if(data?.session_token) {
            cookies().set('session_token', data.session_token, {
                expires: new Date(Date.now() + 60*30*1000),
                httpOnly: true,
                secure: true,
                path: '/',
            })
        }
        return ({...state,
            success: true,
            message: data.message,
        });
    }else{
        return ({...state,
            success: false,
            message: data.error,
        });
    }
}

export async function accountActivationInstruction(formData){
    const email = formData.get("email")
    try{
        //Check if user's existence and activation status
        const user = await Connection("afriqloan", "users")
                    .then((users)=>users.findOne({"contact.email":email},{projection: {"contact.email":1, role:1, status:1}}))
        if(!user) throw new Error("Email does not exist")
        if(user?.status !== "pending") throw new Error("Email already activated")
        //Create activation token and insert into collection
        const activation = await Connection('afriqloan', 'activations')
        const payload = {
            user:user._id,
            email:user.contact.email,
            role:user.role,
            status:user.status
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        await activation.insertOne({token:token, user:user._id, createdAt: new Date()})
        //Send activation email and return response
        const response = await Activation(token, "Account Activation", user.contact.email)
        return {success:true, message:"Activivation instruction sent successfully"}
    }catch(error){
        return {success:false, message:"There was an error sending activation instruction"}
    }
}

export async function passwordResetInstruction(state, formData) {
    const email = formData.get("email")
    try {
        //Connect to database and change for user existance, activation status and if password has been changed the last two months
        const connection = await Connection("afriqloan")
        const [ user ] = await connection.collection("users").aggregate([
                                        {$match: {"contact.email": email}},
                                        {$project: {"contact.email":1, password:1, role:1, status:1}}
                                    ]).toArray()
        if(!user) throw new Error("Sorry, we cannot find this email. Check and try again.")
        if(user.status !== "activated") throw new Error("Supplied email isn't active.")
        if(user.password.updated){
            const wait = (new Date() - user.password.updated)/3600000

            if(wait < 48) throw new Error(`You have recently changed your password. Please try again in about ${48 - Math.round(wait)} hours.`)
        }
        //Create and store activation token in the database
        const payload = {
            user:user._id,
            email:user.contact.email,
            role:user.role,
            status:user.status
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        await connection.collection("password_resets").updateOne(
                            {email:email}, {$set: {token:token, requested: new Date()}}, {upsert:true}
                        )
        //Send password reset link containing activation token to user email address and return response
        const response = await Activation(token, "Password Reset Instruction", "reset", email)
        if(!response) throw new Error("Error sending activation instruction to user's email.")
        return {...state, success: true, message:`A password reset link has been sent to ${user.contact.email}`}
    }catch(error){
        revalidatePath("/password")
        return {...state, success:false, message:error.message||"An error occurred trying to send your request. Please try again."}
    }
}

export async function passwordReset(state, formData) {
    const password = formData.get("password")
    try {
        //Encrypt and upsate user password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)
        //Establish database connection to modify information
        const connection = await Connection("afriqloan")
        const users = await connection.collection("users")
        const user = await users.findOne({"contact.email":state.email})
        if(!user){
            throw new Error("User not found")
        }
        const passwords = [...user.password.previous, user.password.current].slice(-5)
        const matched = async function(){
            for(let i = 0; i<passwords.length; i++){
                if(await bcrypt.compare(password, passwords[i])){
                    return true
                }
            }
            return false
        }
        if(await matched()) throw new Error("Password matches one of your last five passwords. Please choose something different for added security.")
        const update = await users.updateOne({"contact.email":state.email}, { $addToSet: {"password.previous": user.password.current}, $set: {"password.current":hashpassword, "password.updated":new Date()}})
        if(!update.acknowledged){
            throw new Error("Error updating user password. Please try again later!")
        }
        await connection.collection("password_resets").deleteOne({email:state.email})
        return {...state, success: true, message:`Password for ${state.email} has been updated successfully. Have a great day.`}
    }catch(error){
        return {...state, success:false, message:error.message}
    }
}

export async function createSavingsAccount(entries){
    const { data } = await Auth()
    const savingsgoal = parseInt(entries.savingsgoal)
    const initialdeposit = parseInt(entries.initialdeposit)||0
    let savings
    try{
        const connection = await Connection("afriqloan")
        if(entries.type==="personal"){
            savings = await connection.collection("users").updateOne({"contact.email":entries.email},
                        {$set:
                            {
                                "contact.phone":entries.phone,
                                "identifications.nin":entries.nin,
                                "banks.verification": {number:entries.bvn, added:new Date(), verified:true},
                                "savings": [
                                    {type:"Wallet", _id:new ObjectId(), created:new Date(), status:"active", balance:0},
                                    {type:"Personal Savings", opened:new Date(), status:"active", balance:initialdeposit, goal:savingsgoal}
                                ]
                            }
                        })
            if(savings.modifiedCount === 0) throw new Error("There was an error creating your savings account, please try again shortly.")
            if(initialdeposit > 0) await createTransaction("External", initialdeposit, "Personal Savings", "Initial Deposit", data._id, data._id)
        }
        if(entries.type==="joint"){
            const updateuser = await connection.collection("users").updateOne({"contact.email":entries.email},
                {$set:
                    {
                        "contact.phone":entries.phone,
                        "identifications.nin":entries.nin,
                        "banks.verification": {number:entries.bvn, added:new Date(), verified:true},
                        "savings": [
                            {type:"Wallet", _id:new ObjectId(), created:new Date(), status:"active", balance:0}
                        ]
                    }
                })
            if(updateuser.modifiedCount === 0) throw new Error("Error updating your information. Please check your request and try again.")
            savings = await createJointSavings({savingsgoal: savingsgoal})
            if(!savings.success) throw new Error("An error occurred trying to create your account. Please try again later.")
        }
    }catch(error){
        return {success:false, message:error.message||"Error creating account"}
    }
    revalidatePath("/savings")
    redirect("/savings", "replace")
}

export async function addPersonalSavings(state, formData){
    const initialdeposit = parseInt(formData.get('initialdeposit'))
    const savingsgoal = parseInt(formData.get('savingsgoal'))
    const { data } = await Auth()
    try{
        const connection = await Connection("afriqloan")
        const update = await connection.collection("users").updateOne(
                                {_id:new ObjectId(data._id)},
                                {$addToSet: {"savings": {type:"Personal Savings", opened:new Date(), status:"active", balance:initialdeposit, goal:savingsgoal}}}
                              )
        if(!update.acknowledged) throw new Error("Error adding account.")
        if(initialdeposit > 0) await createTransaction("External", initialdeposit, "Personal Savings", "Initial Deposit", data._id, data._id)
        revalidatePath("/savings/@holder", "page")
        return {sucess:true, message:"Account successfully Added."}
    }catch(error){
        return {sucess:false, message:error.message||"An error occurred trying to add personal savings account."}
    }
}

export async function createJointSavings(state, formData){
    const savingsgoal = state.savingsgoal||parseInt(formData?.get('savingsgoal'))
    const duration = state.duration||parseInt(formData?.get('duration'))||6
    const members = state.members||parseInt(formData?.get('members'))||6
    const payout = state.payout||parseInt(formData?.get('payout'))||4
    const { data } = await Auth()
    try{
        const connection = await Connection("afriqloan")
        const create = await connection.collection("joint_savings").insertOne({
                                    members: {total:members, joined: [new ObjectId(data._id)]},
                                    manager:new ObjectId(data._id),
                                    duration:duration,
                                    created:new Date(),
                                    savingsgoal:savingsgoal,
                                    payout:payout,
                                    rounds:[{status:"pending"}]},
                                {returnDocument:"after"}
                              )
        if(!create) throw new Error("Error creating account.")
        revalidatePath("/savings/@holder", "page")
        return {success:true, message:"Account successfully activated."}
    }catch(error){
        return {success:false, message:error.message||"An error occurred trying to activate account."}
    }
}

export async function createTransaction(source, amount, destination, description, sender, beneficiary){
    const connection = await Connection("afriqloan")
    const transaction = await connection.collection("transactions")
                                        .insertOne({
                                            source:source,
                                            amount:amount,
                                            destination:destination,
                                            description:description,
                                            timestamp:new Date(),
                                            sender:new ObjectId(sender),
                                            beneficiary:new ObjectId(beneficiary),
                                            reference: `${Date.now()}-${digits(10)}`
                                        })
    if(!transaction.acknowledged) throw new Error("There was an error creating your transaction.")
}

export async function jointSavingsInvitation(state, formData){
    const { data } = await Auth()
    const contact = formData.get("invitee")
    try{
        const connection = await Connection("afriqloan")
        const users = await connection.collection("users")
        const user = await users.findOne({_id:new ObjectId(data._id)})
        if(!user) throw new Error("Not allowed! Invalid or missing session information. Please logout and in to try again.")
        const invitee = await users.findOne({$or: [{"contact.email":contact}, {"contact.phone":contact}]})
        if(!invitee) throw new Error("User not found!. Please check the supplied information and try again.")
        if(invitee.contact.email === user.contact.email) throw new Error("You cannot send an invitation to yourself.")
        const invitation = await connection.collection("joint_savings_invitations").findOne({user:invitee.contact.email, inviter:user._id})
        if(invitation) throw new Error("User already has a pending invitation from you.")
        const savings = await connection.collection("joint_savings")
        const managed = await savings.findOne({manager:user._id})
        if(!managed){
            throw new Error("Sorry, you cannot invite others! You do not have any account you are managing.")
        }
        if(managed.members.total===managed.members.joined.length){
            throw new Error("Number of participants reached.")
        }
        if(JSON.stringify(managed.members.joined).includes(JSON.stringify(invitee._id))) throw new Error("User is already a member of this group.")
        const saving = await savings.find({'members.joined': invitee._id}).toArray()
        if(saving.length === 1) throw new Error("User already belong to the maximum number of groups.")
        const code = nanoid()
        const invite = await connection.collection("joint_savings_invitations")
                                        .insertOne({inviter:user._id, group:managed._id, code:code, user:contact, status:"pending", sent:new Date()})
        if(!invite.acknowledged) throw new Error()
        const subject = "Joint Savings Invitation"
        const body = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; gap:10px; border:0px solid #0c4b54; text-align:center; border-radius:10px; padding:20px; background-color:#F0F1F3">
                            <h4 style="margin-bottom:0px">Dear ${invitee.names}</h4>
                            <p>You have been invited to join a joint savings group by <strong>${user.names}</strong>.<br />
                            Kindly click on the following link to accept or manually insert the invitation code <strong>(${code})</strong> in your savings&apos; dashboard.</p>
                            <p><a href=${process.env.SITE_URL}/savings/join?code=${code} rel='nofollow' style='color:#FFFFFF;text-decoration:none; border:1px solid green; padding:10px 40px; border-radius:10px; width:100%; background-color:#0c4b54'>Join Here</a></p>
                            <p>Please note that this invitation will expire in about 24 hours. Both the link and invitation code will cease to work but this message will however remain in your inbox.</p>
                            <p>Thank you!</p>
                            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center">
                                <img src="cid:icon@afriqloan.com" width="40px" height="50px" alt="Afriqloan Icon" />
                                <strong>Afriqloan Team</strong>
                            </div>
                        </div>`
        await connection.collection("messages")
                        .insertOne({subject:subject, body:body, timestamp:new Date(), priority:1, recipient:invitee._id, sender:new ObjectId("66e8411093b375ec7102a44a"), flags: {status:"unread"}})
        await Invitation(invitee.contact.email, subject, body)
        return {success:true, code:code, message:`Invitation created and sent successfully, kindly copy the invitation code (${code}) for manual joining. Have a nice day.`}
    }catch(error){
        return {success:false, message:error.message||"An error occurred trying to send your invitation."}
    }
}

export async function joinJointSavings(state){
    const { data } = await Auth()
    const code = state.code
    try{
        const connection = await Connection("afriqloan")
        const user = await connection.collection("users").findOne({_id:new ObjectId(data._id)})
        const invitations = await connection.collection("joint_savings_invitations")
        const invitation = await invitations.findOne({user:user.contact.email, code:code})
        if(!invitation) throw new Error("You do not have any pending invitation or you have supplied an invalid invitation code.")
        const jointsavings = await connection.collection("joint_savings")
        const jointsaving = await jointsavings.find({'members.joined': new ObjectId(data._id)}).toArray()
        if(jointsaving.length > 0) throw new Error("You cannot belong to more than one group at a time.")
        const join = jointsavings.updateOne({_id:invitation.group}, {$addToSet: {"members.joined":new ObjectId(data._id)}})
        if(!join) throw new Error()
        await invitations.deleteOne({_id:invitation._id})

        await connection.collection("users").updateOne(
            {"contact.email":user.contact.email},
            {$set:{ "savings": [{type:"Wallet", _id:new ObjectId(), created:new Date(), status:"active", balance:0}]}}
        )

        return {...state, success:true, message:"You are successfully joined a joint savings group."}
    }catch(error){
        return {...state, success:false, pending:false, message:error.message||"Error joining savings group."}
    }
}

export async function upgradeToMerchant(state, formData){
    const userId = formData.get("userId")
    const location = formData.get("location").trim()
    try {
        const user = await Connection("afriqloan", "users")
                        .then((users)=>users.findOneAndUpdate(
                            {_id: new ObjectId(userId)},
                            {$set: {type:"merchant"}, $addToSet: {locations:location}},
                            {projection: {role:1, type:1, status:1}, returnDocument:"after"}
                        ))
        //Throw an error if user doesn't exist (invalid session information)
        if(!user) throw new Error("Email does not exist in our database", {status: 404})
        //Create new token with updated status and set cookie
        const payload = {
            _id: user._id,
            role: user.role,
            type: user.type,
            status: user.status
        }
        const session_token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        cookies().set('session_token', session_token, {
            expires: new Date(Date.now() + 60*30*1000),
            httpOnly: true,
            secure: true,
            path: '/',
        })
        //Revalidate path and return successful server action
        revalidatePath("/(dashboard)")
        return {...state, success:true, message:"Your account has been successfully updated."}
    }catch(error){
        return{...state, success:false, message:"There was an error updating your account. Please try again!"}
    }
}

export async function getListings(params){
    const { data } = await Auth()
    const listing = typeof params === "object"?params.listing:params
    const query = data && typeof params==="string"?{merchant:new ObjectId(data?._id), type:listing, status: {$ne: "deleted"}}:{type:listing, status: {$ne: "deleted"}}
    const listings = await Connection("afriqloan", "listings")
                    .then((listings)=>listings.find(query, {$sort: {_id:-1}}).toArray())
    return listings
}