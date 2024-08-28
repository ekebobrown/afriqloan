import styles from "@/app/page.module.css"

export default async function DefaultLoading(){
    return (
        <section className={`${styles.fh} d-flex justify-content-center align-items-center`}>
            <i className="fa-solid fa-compact-disc fa-spin fa-3x text-primary"></i>
        </section>
    )
}