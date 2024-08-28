import { PrimaryLinkButtonIcon } from "@/app/components/buttons"

export default async function Status({ id }) {
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    const response = await fetch(`${process.env.SITE_URL}/api/loans`,{
        headers: {
            "x-authorization-id": id
        }
    })

    if(!response.ok){
        const data = await response.json()
        throw new Error(`An error occured trying to retrieve loan details ${data.message}`)
    }

    const [ loan ] = await response.json()

    return (
        <section className="d-flex flex-column bg-primary p-4 p-md-5 gap-5">
            <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column justify-content-between">
                    <h4 className="text-white">Hello Welcome!</h4>
                    <div className="d-flex flex-column flex-md-row justify-content-between row-gap-2">
                        <PrimaryLinkButtonIcon href="/loans/application" disabled={loan?.status==="active"}>
                        <i className="fa-solid fa-money-bill-1 me-2"></i>
                        <span className="text-truncate">New Loan</span>
                        </PrimaryLinkButtonIcon>
                        <PrimaryLinkButtonIcon href="/loans/repayment" disabled={loan?.status!=="active"}>
                        <i className="fa-solid fa-money-bill-transfer me-2"></i>
                        <span className="lh-1">Repay Loan</span>
                        </PrimaryLinkButtonIcon>
                        <PrimaryLinkButtonIcon href="/loans/calculator">
                        <i className="fa-solid fa-calculator me-2"></i>
                        <span className="lh-1">Calculator</span>
                        </PrimaryLinkButtonIcon>
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row gap-4">
                    <div className="col-12 col-md-4 d-flex flex-column p-5 justify-content-center align-items-center gap-2 rounded-4 bg-light border border-4 border-primary shadow-sm">
                        <h4>Active Loan</h4>
                        <span className="fs-2 fw-bold">{currencyFormat.format(loan?.amount)}</span>
                    </div>
                    <div className="card col-12 col-md-4 d-flex flex-column p-5 justify-content-center align-items-center gap-2 rounded-4 bg-light border border-4 border-primary shadow-sm">
                        <h4>Repayment Balance</h4>
                        <span className="fs-2 fw-bold">{currencyFormat.format(loan?.amount - (loan?.repayment||0))}</span>
                    </div>
                </div>
            </div>
        </section>
  )
}
