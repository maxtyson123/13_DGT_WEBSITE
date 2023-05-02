import styles from "@/styles/page_header.module.css"
import Image from 'next/image';
export default function PageHeader({ children }){

    // Show the background
    // Show the white Blur

    return(
        <>
            <div className={styles.headerContainer}>

                <div className={"absolute -z-10 "+ styles.mainBG}>
                    <Image
                        src={"/media/images/main_bg.jpg"}
                        alt={"Plants Background"}
                        fill={true}
                        objectFit="cover"
                        quality={100}
                    />
                </div>

                <div className={styles.contentContainer}>
                    <div>{children}</div>
                </div>

            </div>
        </>
    )
}