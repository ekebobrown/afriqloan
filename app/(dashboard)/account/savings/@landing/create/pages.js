
import { AccountOpening } from "@/app/components/forms"

export default function CreateAccount({searchParams}) {
    return (
        <section className="bg-light p-5 rounded-5">
            <form className="d-flex flex-column w-100 p-5 bg-white rounded-5">
                <input type="hidden" name={`${searchParams.type==="personal"?"personal":"joint"}`} />
                <AccountOpening />
            </form>
        </section>
    )
}
