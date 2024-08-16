import { PrimaryLinkButtonIcon } from "@/app/components/buttons"

export default async function Status({ token }) {
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    const response = await fetch(`${process.env.SITE_URL}/api/account/loans`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok){
        const data = await response.json()
        return <p className="text-white fs-6">Error retrieving your loan details ({data.message})</p>
    }

    const [loanDetails] = await response.json()

    return (
        <>
            <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column justify-content-between">
                    <h4 className="text-white">Hello Welcome!</h4>
                    <div className="d-flex flex-column flex-md-row justify-content-between row-gap-2">
                        <PrimaryLinkButtonIcon href="/account/loan/application" disabled={loanDetails?.status==="approved"}>
                        <i className="fa-solid fa-money-bill-1 me-2"></i>
                        <span className="text-truncate">New Loan</span>
                        </PrimaryLinkButtonIcon>
                        <PrimaryLinkButtonIcon href="/account/loan/repayment" disabled={loanDetails?.status!=="approved"}>
                        <i className="fa-solid fa-money-bill-transfer me-2"></i>
                        <span className="lh-1">Repay Loan</span>
                        </PrimaryLinkButtonIcon>
                        <PrimaryLinkButtonIcon href="/account/loan/calculator">
                        <i className="fa-solid fa-calculator me-2"></i>
                        <span className="lh-1">Calculator</span>
                        </PrimaryLinkButtonIcon>
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row">
                    <div className="col-12 col-md-4 d-flex flex-column p-5 justify-content-center align-items-center gap-2 rounded-4 bg-light border border-4 border-primary shadow-sm">
                        <h5>Active Loan</h5>
                        <span className="fs-2 fw-bold">{currencyFormat.format(loanDetails?.amount)}</span>
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column p-5 justify-content-center align-items-center gap-2 rounded-4 bg-light border border-4 border-primary shadow-sm">
                        <h5>Repayment Balance</h5>
                        <span className="fs-2 fw-bold">{currencyFormat.format(loanDetails?.amount - (loanDetails?.repayment||0))}</span>
                    </div>
                </div>
            </div>
        </>
  )
}
