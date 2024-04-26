import styles from '@/styles/pages/login.module.css'
export default function Login(){
    return(
        <>
            <div className={styles.container}>
                {/* Log In Circle Icon */}
                <div className={styles.cicrcles}>
                    <div className={styles.circle1}>
                        <div className={styles.circle2}>

                        </div>
                    </div>
                </div>

                {/* Text */}
                <h1> Lets Connect</h1>
                <h1> Together</h1>

                {/* Buttons */}
                <button> Log In</button>
                <button className={styles.signup}> Sign Up</button>

            </div>
        </>
    )
}