import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import styles from './Dashboard.module.css';
import 'react-calendar/dist/Calendar.css';

export const Dashboard = () => {
    // const [startingMonth, setStartingMonth] = useState('January');
    // const [endingMonth, setSEndingMonth] = useState('December');

    const [MIN_DATE, SET_MIN_DATE] = useState();
    const [MAX_DATE, SET_MAX_DATE] = useState();

    /*
        UTILITY CALLS - INSIDE A useEffect SO ITS ONLY CALLED ON INITIAL RENDER (technically twice because of StrictMode...)
    */

    useEffect(() => {
        // Get the minimum date and store it
        const getMinDate = async () => {
            const res = await fetch('http://localhost:8000/db/get_min_date', {
                method: 'GET',
            });

            const resData = await res.json();
            const rawMinDate = resData[0].min_date; // target the key of the response and save the value in rawMinDate
            console.log(rawMinDate);
            SET_MIN_DATE(new Date(rawMinDate).toISOString().split('T')[0]);
        };

        // Get the minimum date and store it
        const getMaxDate = async () => {
            const res = await fetch('http://localhost:8000/db/get_max_date', {
                method: 'GET',
            });

            const resData = await res.json();
            const rawMaxDate = resData[0].max_date;
            const MAX_DATE = new Date(rawMaxDate).toISOString().split('T')[0];
            SET_MAX_DATE(MAX_DATE);
        };

        getMinDate();
        getMaxDate();
    }, []);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget}`}>
                    <h4>Most Sustainable Borough 🏆</h4>
                    <p>
                        Min Date: {MIN_DATE}, Max Date: {MAX_DATE}
                    </p>
                </div>
                <div className={`${styles.hotSpotMap} ${styles.widget}`}>
                    <h4>Hot Spots 🔥</h4>
                </div>
                <div className={`${styles.carbonCalculator} ${styles.widget}`}>
                    <h4>Carbon Offset Calculator 🌳</h4>
                </div>
                <div className={`${styles.usageChart} ${styles.widget}`}>
                    <h4>Bike Usage Vs Time ⏱️</h4>
                </div>
                <div className={`${styles.boroughChart} ${styles.widget}`}>
                    <h4>Top Boroughs 📊</h4>
                </div>
                <div className={`${styles.filtersBox} `}>
                    <h4>Filters 🔍</h4>
                    <p>Starting Date</p>
                    <div className={styles.calendar}>
                        <Calendar minDetail="year" />
                    </div>
                    <p>Ending Date</p>
                    <div className={styles.calendar}>
                        <Calendar minDetail="year" />
                    </div>
                </div>
            </div>
        </>
    );
};
