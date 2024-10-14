import Auth from "@/app/lib/auth"
import { List } from "@/app/(dashboard)/listings/orders/list"

export default async function Order({params}){
    const { data, session_token } = await Auth()
    const {order} = await fetch(`${process.env.SITE_URL}/api/listing/orders/order?id=${params.id}`,{
                                headers: {
                                    "x-authorization-id":data?._id,
                                    "x-authorization-token":session_token
                                }
                            })
                            .then((response)=>response.json())
                            .catch((error)=>console.log(error.message))
    if(!order) {
        return (
            <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2 py-5">
                <i className="fa-solid fa-triangle-exclamation fa-4x text-warning-emphasis"></i>
                <small className="text-warning-emphasis text-center">Error previewing order. Please check the order ID and try again.</small>
            </div>
            )
        }

    return (
        <div className="items flex-fill d-flex flex-column gap-3 p-4 align-items-start">
            <List order={order} />
        </div>
    )
}