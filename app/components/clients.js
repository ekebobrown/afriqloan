import Carousel, { Carousels } from '@/app/components/carousels'

export default function Clients() {
  return (
    <div className="w-100 d-flex flex-column text-center flex-fill justify-content-center">
        <h1 className="text-primary display-5">Some Of Our Clients</h1>
        <p className="fs-5 text-primary">Here are some leading brands that have trusted us to recover delinquent loans.</p>
        <Carousel show={5} autoplay={true} loop={true} arrows='hover' delay={5} pauseonhover={false}>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan1</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan2</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan3</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan4</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan5</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan3</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan4</span></span></div>
            <div className="d-flex justify-content-center"><span className="flex-fill p-3 btn btn-light fs-2 fw-bold text-primary">Afriq<span className="text-secondary">Loan5</span></span></div>
        </Carousel>
    </div>
  )
}
