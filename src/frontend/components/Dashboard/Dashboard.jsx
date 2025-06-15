import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './Dashboard.module.css';
import dayjs from 'dayjs';

import { MIN_DATE, MAX_DATE } from './Dashboard.constants';
import stationDetails from '../../../backend/app/utils/_station_details.json';

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

            // Find the busiest borough
            const stationToBorough = {};
            stationDetails.forEach(({ name, borough }) => {
                stationToBorough[name.trim().toLowerCase()] = borough;
            });

            const boroughRides = {};

            resData.forEach(({ station_name, total_rides }) => {
                const name = station_name.trim().toLowerCase();
                const borough = stationToBorough[name];

                if (borough) {
                    boroughRides[borough] =
                        (boroughRides[borough] || 0) + total_rides;
                } else {
                    console.warn(
                        `Station not found in details: ${station_name}`
                    );
                }
            });

            console.log(boroughRides);

            // Find the busiest borough
            const busiestBorough = Object.entries(boroughRides).reduce(
                (max, [borough, rides]) => {
                    // if (borough.toLowerCase() === 'unknown') return max; // skip unknown
                    return rides > max.rides ? { borough, rides } : max;
                },
                { borough: null, rides: 0 }
            );

            console.log(
                'Busiest borough:',
                busiestBorough.borough,
                busiestBorough.rides
            );
            setTopBorough(busiestBorough.borough);
        };

        getTopBorough();
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <h4>Most Popular Borough 🏆</h4>
                    <p className={styles.topBoroughOutput}>{topBorough}</p>
                </div>
                <div className={`${styles.hotSpotMap} ${styles.widget}`}>
                    <h4>Hot Spots 🔥</h4>
                    <p>Starting Date: {startingDate}</p>
                    <p>Ending Date: {endingDate}</p>
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
                    <button
                        onClick={() => {
                            const fullDate = new Date(tempStartingDate);
                            const formattedDate =
                                dayjs(fullDate).format('YYYY-MM-DD');
                            setStartingDate(formattedDate);
                        }}
                    >
                        Apply
                    </button>
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
                        onClick={() => {
                            const fullDate = new Date(tempEndingDate);
                            const formattedDate =
                                dayjs(fullDate).format('YYYY-MM-DD');
                            setEndingDate(formattedDate);
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
};
