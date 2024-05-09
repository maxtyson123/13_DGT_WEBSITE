import {CustomSweeper, Theme, Config} from "custom-sweeper";
import styles from "@/styles/pages/plants/id.module.css";

export default function Page() {

    const theme : Theme = {
        primaryColor: '#41af85',
        secondaryColor: '#72cca9',
        darkColor: '#2c775b',
        mineImage: 'https://art.pixilart.com/thumb/sr28d51fc1bf8aws3.png',
        flagImage: 'https://sunhaven.wiki.gg/images/5/55/Iron_Watering_Can.png'
    }

    const config : Config = {
        title: "Seed Sweeper",
        subtitle: "By Max Tyson",
        goalTitle: "Predict where the seeds are without digging them up!",
        theme: theme
    }

    return (
        <div className={styles.game}>
            <CustomSweeper {...config} />
        </div>
    );
};
