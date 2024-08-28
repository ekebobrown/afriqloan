'use server'
import { ObjectId } from "mongodb"
import { customAlphabet } from "nanoid"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import Auth from "@/app/lib/auth"
import Connection from "@/app/lib/db"

const nanoid = customAlphabet("1234567890", 10)

export async function personalLoan(entries){
    const { data } = await Auth()
    try{
        const connection = await Connection("afriqloan")
        const users = await connection.collection("users")
        const update = await users.updateOne(
                                    {_id:new ObjectId(data._id)},
                                    {$addToSet: {
                                            loans: {rate:0.15, tenure:entries.tenure, amount:entries.loanamount, purpose:entries.purpose, status:"pending", requested:new Date(), ref:`${new Date().toString()}-${nanoid()}`},
                                            "banks.accounts": {bank:entries.bankname, number:entries.accountnumber, added:new Date()}
                                        },
                                    $set: {
                                        employment: {status:entries.employmentstatus, income:parseInt(entries.income||0)},
                                        contact: {address:entries.address},
                                        dob: entries.dob,

                                        }
                                    })
        console.log(update)
    }catch(error){
        console.log(error)
        return {success:false, message:"Error submitting your loan request form."}
    }
    revalidatePath("/loans")
    redirect("/loans", "replace")
}