import Link from 'next/link'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ObjectId } from 'mongodb'

import { Token } from '@/app/components/cards'
import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'
import { Submit } from '@/app/components/buttons'
import Recents from '@/app/(dashboard)/account/savings/@holder/recents'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Account() {
  const session_token = cookies().get("session_token")?.value
  const { user } = await fetch(`${process.env.SITE_URL}/api/account/balances`, {
    headers: {
      Authorization: `Bearer ${session_token}`
    }
  }).then((response) => response.json())

  async function addAccount(formData){
    "use server"
    try{
      const { user } = await Auth(session_token)
      const users = await Connection("afriqloan", "users")
      const add = await users.findOneAndUpdate({ _id:new ObjectId(user._id)},
                                          {$addToSet: {accounts: {
                                              type:"Joint Savings",
                                              balance:0,
                                              created:new Date(),
                                              status:"active"
                                            }}},
                                      {returnDocument:"after"})
      if(!add) throw new Error()
      revalidatePath("/account/savings/accountholder", "page")
      return {sucess:true, message:"Accouunt successfully activated"}
    }catch(error){
      return {sucess:false, message:"An error occurred trying to activate account"}
    }
  }

  return (
    <div className="">
      <section className="d-flex flex-column bg-primary p-5 gap-4">
        <div>
          <h4 className="text-white">Hello Welcome!</h4>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <div className="d-block text-white">
              <span>{user[0]?.names}</span>
            </div>
            <div className="d-flex btn btn-primary border border-2 border-white align-items-center rounded-pill" role="button">
              <i className="fa-solid fa-money-bill-transfer me-2"></i>
              <span>Withdraw</span>
            </div>
            <Link href="/dashboard/fund?q=wallet" className="d-flex btn btn-primary border border-2 border-white rounded-pill align-items-center" role="button">
              <i className="fa-regular fa-square-plus me-2"></i>
              <span>Fund Wallet</span>
            </Link>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row row-gap-3">
          {user[0].accounts?.map((account)=>(
              <Token key={account.type} title={account.type} balance={account.balance} />
          ))}
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div className="d-flex flex-row text-white fs-6 gap-2 me-auto">
            Account No: {user[0]?.phone.slice(1,)}
          </div>
          {user[0].accounts[0]?.type!=="Wallet" &&
            <Link href="/dashboard/fund?q=wallet" className="d-flex btn btn-primary rounded-pill border border-2 border-white align-items-center" role="button">
              <i className="fa-solid fa-wallet me-2"></i>
              <span>Create Wallet</span>
            </Link>
          }
          {user[0].accounts[2]?.type!=="Joint Savings" &&
            <form action={addAccount}>
              <Submit>
                <i className="fa-solid fa-user-plus me-2"></i>
                <span className="lh-1">Activate Joint Savings</span>
              </Submit>
            </form>
          }
        </div>
      </section>
      <section id="recents" className="d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <Recents session_token={session_token} joint_account={user[0].accounts[2]?.type==="Joint Savings"} />
      </section>
    </div>
  )
}
