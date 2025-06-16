import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { findTopBoroughByRidesPerCapita } from './utils/findTopBoroughByRidesPerCapita';
import { findBottomBoroughByRidesPerCapita } from './utils/findBottomBoroughByRidesPerCapita';
import { BottomBoroughsGraph } from './BottomBoroughsGraph/BottomBoroughsGraph';
import { LoadingSpinner } from '../loadingSpinner';
import { MIN_DATE, MAX_DATE } from './Dashboard.constants';
import dayjs from 'dayjs';
import stationDetails from '../../../backend/app/utils/_station_details.json';
import styles from './Dashboard.module.css';
import boroughPopulations from '../../../backend/app/utils/borough_population.json';

export const Dashboard = () => {
    const { startingDate, setStartingDate, endingDate, setEndingDate } =
        useStore();

    const [isLoading, setIsLoading] = useState(false);

    const [tempStartingDate, setTempStartingDate] = useState(MIN_DATE);
    const [tempEndingDate, setTempEndingDate] = useState(MAX_DATE);

    const [topBorough, setTopBorough] = useState('');
    const [bottom10Boroughs, setBottom10Boroughs] = useState([]);

    useEffect(() => {
        const getTop100Stations = async () => {
            // API Call
            setIsLoading(true); // Renders the loading spinner whilst waiting for the API response
            try {
                const res = await fetch(
                    'http://localhost:8000/get_top_100_stations?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                const resData = await res.json();
                console.log('Response:', resData);

                // Parsing data for 'Most Sustainable Borough'
                setTopBorough(
                    findTopBoroughByRidesPerCapita(
                        resData,
                        stationDetails,
                        boroughPopulations
                    ).borough
                );

                // Parsing data for 'Least Sustainable Boroughs'
                setBottom10Boroughs(
                    findBottomBoroughByRidesPerCapita(
                        resData,
                        stationDetails,
                        boroughPopulations
                    )
                );
            } catch (error) {
                console.log('Fetch error:', error);
            } finally {
                setIsLoading(false); // Turns the loading spinner off once we have data
            }
        };

        getTop100Stations();
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <h4>Most Sustainable Borough 🏆 (Riders per Capita)</h4>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <p className={styles.topBoroughOutput}>{topBorough}</p>
                    )}
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
                    <h4> Least Sustainable Boroughs 📊 (Rides per Capita) </h4>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <BottomBoroughsGraph data={bottom10Boroughs} />
                    )}
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
                            value={dayjs(tempStartingDate)}
                            onChange={(newStartingDate) => {
                                const fullStartDate = new Date(newStartingDate);
                                const formattedStartDate =
                                    dayjs(fullStartDate).format('YYYY-MM-DD');
                                setTempStartingDate(
                                    formattedStartDate.toString()
                                );
                                console.log(formattedStartDate);
                            }}
                        />
                    </LocalizationProvider>
                    <p>Ending Date</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="endDate"
                            defaultValue={dayjs(MAX_DATE)}
                            minDate={dayjs(MIN_DATE).add(1, 'day')}
                            maxDate={dayjs(MAX_DATE)}
                            format="DD-MM-YYYY"
                            value={dayjs(tempEndingDate)}
                            onChange={(newEndingDate) => {
                                const fullEndDate = new Date(newEndingDate);
                                const formattedEndDate =
                                    dayjs(fullEndDate).format('YYYY-MM-DD');
                                setTempEndingDate(formattedEndDate.toString());
                                console.log(formattedEndDate);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={styles.filterButtonContainer}>
                        <button
                            className={styles.applyButton}
                            disabled={
                                tempEndingDate != MAX_DATE ||
                                tempStartingDate != MIN_DATE
                                    ? false
                                    : true
                            }
                            onClick={() => {
                                if (tempStartingDate != MIN_DATE) {
                                    const fullStartDate = new Date(
                                        tempStartingDate
                                    );
                                    const formattedStartDate =
                                        dayjs(fullStartDate).format(
                                            'YYYY-MM-DD'
                                        );
                                    setStartingDate(formattedStartDate);
                                }

                                if (tempEndingDate != MAX_DATE) {
                                    const fullEndDate = new Date(
                                        tempEndingDate
                                    );
                                    const formattedEndDate =
                                        dayjs(fullEndDate).format('YYYY-MM-DD');
                                    setEndingDate(formattedEndDate);
                                }
                            }}
                        >
                            Apply
                        </button>
                        <button
                            className={styles.resetButton}
                            onClick={() => {
                                setStartingDate(MIN_DATE);
                                setEndingDate(MAX_DATE);
                                setTempStartingDate(MIN_DATE);
                                setTempEndingDate(MAX_DATE);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                    {/* <LoadingSpinner /> */}
                </div>
            </div>
        </>
    );
};
