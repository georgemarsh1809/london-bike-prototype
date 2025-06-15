import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './Dashboard.module.css';
import dayjs from 'dayjs';

import { findTopBoroughByRidesPerCapita } from './utils/findTopBoroughByRidesPerCapita';
import { MIN_DATE, MAX_DATE } from './Dashboard.constants';
import stationDetails from '../../../backend/app/utils/_station_details.json';
import boroughPopulations from '../../../backend/app/utils/borough_population.json';

export const Dashboard = () => {
    const { startingDate, setStartingDate, endingDate, setEndingDate } =
        useStore();

    const [tempStartingDate, setTempStartingDate] = useState('');
    const [tempEndingDate, setTempEndingDate] = useState('');

    const [topBorough, setTopBorough] = useState('');

    useEffect(() => {
        const getTopBorough = async () => {
            // API Call
            const res = await fetch(
                'http://localhost:8000/get_top_100_stations?' +
                    new URLSearchParams({
                        start_date: startingDate.toString(),
                        end_date: endingDate.toString(),
                    }).toString(),
                { method: 'GET' }
            );

            const resData = await res.json();
            console.log('Res', resData);

            // From the reponse of the call, work out the most sustainable borough
            setTopBorough(
                findTopBoroughByRidesPerCapita(
                    resData,
                    stationDetails,
                    boroughPopulations
                ).borough
            );
        };

        getTopBorough();
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <h4>Most Sustainable Borough 🏆</h4>
                    <p className={styles.topBoroughOutput}>{topBorough}</p>
                </div>
                <div className={`${styles.hotSpotMap} ${styles.widget}`}>
                    <h4>Hot Spots 🔥</h4>
                    <p>Leaflets</p>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="startDate"
                            defaultValue={dayjs(MIN_DATE)}
                            minDate={dayjs(MIN_DATE)}
                            maxDate={dayjs(MAX_DATE)}
                            format="DD-MM-YYYY"
                            onChange={(newStartingDate) => {
                                setTempStartingDate(newStartingDate.toString());
                            }}
                        />
                    </LocalizationProvider>
                    {/* <button
                        onClick={() => {
                            const fullStartDate = new Date(tempStartingDate);
                            const formattedStartDate =
                                dayjs(fullStartDate).format('YYYY-MM-DD');
                            setStartingDate(formattedStartDate);
                        }}
                    >
                        Apply
                    </button> */}
                    <p>Ending Date</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="startDate"
                            defaultValue={dayjs(MAX_DATE)}
                            minDate={dayjs(MIN_DATE)}
                            maxDate={dayjs(MAX_DATE)}
                            format="DD-MM-YYYY"
                            onChange={(newEndingDate) => {
                                setTempEndingDate(newEndingDate.toString());
                            }}
                        />
                    </LocalizationProvider>
                    <button
                        className={styles.applyButton}
                        onClick={() => {
                            const fullDate = new Date(tempEndingDate);
                            const formattedDate =
                                dayjs(fullDate).format('YYYY-MM-DD');
                            setEndingDate(formattedDate);

                            const fullStartDate = new Date(tempStartingDate);
                            const formattedStartDate =
                                dayjs(fullStartDate).format('YYYY-MM-DD');
                            setStartingDate(formattedStartDate);
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
};
