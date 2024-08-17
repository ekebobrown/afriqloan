

import {  Testimonial } from "@/app/components/cards";
import { getTestimonies } from "@/app/lib/actions";

export default async function Testimonials() {
    const testimonies = await getTestimonies()
    return (
        <>
            <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={1} author={testimonies[0].names} avatar={testimonies[0].avatar}>
                  <p>{testimonies[0].testimony}</p>
                </Testimonial>
            </div>
            <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={2} author={testimonies[0].names} avatar={testimonies[0].avatar}>
                    <p>{testimonies[0].testimony}</p>
                </Testimonial>
                <Testimonial layout={2} author={testimonies[0].names} avatar={testimonies[0].avatar}>
                    <p>{testimonies[0].testimony}</p>
                </Testimonial>
            </div>
            <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={1} author={testimonies[0].names} avatar={testimonies[0].avatar}>
                    <p>{testimonies[0].testimony}</p>
                </Testimonial>
            </div>
        </>
    )
}