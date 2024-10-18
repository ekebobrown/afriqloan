import Link from 'next/link'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ObjectId } from 'mongodb'

import { Submit, ActivateSavings } from '@/app/components/buttons'
import { Token } from '@/app/components/cards'
import Recents from '@/app/(dashboard)/savings/@holder/recents'
import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Savings() {
  const cookieStore = await cookies()
  const session_token = cookieStore.get("session_token")?.value
  const { data } = await Auth()
  const [ user ] = await Connection("afriqloan", "users")
                .then((users)=>users.aggregate([
                  {$match: {_id: new ObjectId(data._id)}},
                  {$lookup: {
                    from:"joint_savings",
                    localField:"_id",
                    foreignField:"members.joined",
                    as:"jointsavings"
                  }},
                  {$unwind: { path: "$jointsavings", preserveNullAndEmptyArrays: true }},
                  {$project: {_id:0, names:1, "contact.phone":1, savings:1, jointsavings:1}}
                ]).toArray())
  if(!user){
    throw new Error("An error occured trying to retrieve savings details")
  }

  return (
    <div id="savings" className="">
      <section className="d-flex flex-column bg-primary px-3 py-4 p-md-5 gap-4">
        <div>
          <h4 className="text-white">Hello Welcome!</h4>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <div className="d-block text-white">
              <span>{user?.names}</span>
            </div>
            <div className="d-flex btn btn-primary border border-2 border-white align-items-center rounded-pill px-4" role="button">
              <i className="fa-solid fa-money-bill-transfer me-2"></i>
              <span>Withdraw</span>
            </div>
            <Link href="/savings/fund?q=wallet" className="d-flex btn btn-primary border border-2 border-white rounded-pill align-items-center px-4" role="button">
              <i className="fa-regular fa-square-plus me-2"></i>
              <span>Fund Wallet</span>
            </Link>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row row-gap-3">
          {user?.savings?.map((saving)=>(
              <Token key={saving.type} title={saving.type} balance={saving.balance} />
          ))}
          {user?.jointsavings && <Token key="Joint Savings" title="Joint Savings" balance={user.jointsavings.savingsgoal} jointsavings={JSON.parse(JSON.stringify(user.jointsavings))} currentuser={data._id} />}
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div className="d-flex flex-row text-white fs-6 gap-2 me-auto">
            Account No: {user?.contact.phone.slice(4,)}
          </div>
          {user?.savings && user?.savings[0].type!=="Wallet" &&
            <Link href="/savings/fund?q=wallet" className="d-flex btn btn-primary rounded-pill border border-2 border-white align-items-center" role="button">
              <i className="fa-solid fa-wallet me-2"></i>
              <span>Create Wallet</span>
            </Link>
          }
          {!user?.jointsavings &&
            <ActivateSavings classNames="px-4" type="joint" holder={true}>
                <i className="fa-solid fa-user-plus me-2"></i>
                <span className="lh-1">Activate Joint Savings</span>
            </ActivateSavings>
          }
          {user?.savings?.length<2 &&
            <ActivateSavings classNames="px-4" type="personal">
                <i className="fa-solid fa-user-plus me-2"></i>
                <span className="lh-1">Add Personal Savings</span>
            </ActivateSavings>
          }
        </div>
      </section>
      <section id="recents" className="d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <Recents session_token={session_token} joint_account={user?.jointsavings?true:false} />
      </section>
    </div>
  )
}
