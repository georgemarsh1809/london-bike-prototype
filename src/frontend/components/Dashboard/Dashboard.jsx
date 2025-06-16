import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { findTopBoroughByRidesPerCapita } from './_utils/findTopBoroughByRidesPerCapita';
import { findBottomBoroughByRidesPerCapita } from './_utils/findBottomBoroughByRidesPerCapita';
import { BottomBoroughsGraph } from './BottomBoroughsGraph/';
import { LoadingSpinner } from './LoadingSpinner';
import { MIN_DATE, MAX_DATE } from './Dashboard.constants';
import dayjs from 'dayjs';
import stationDetails from '../../../backend/app/utils/data/_station_details.json';
import boroughPopulations from '../../../backend/app/utils/data/borough_population.json';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
    // Global State
    const { startingDate, setStartingDate, endingDate, setEndingDate } =
        useStore();

    // Local State
    const [isLoading, setIsLoading] = useState(false);
    const [tempStartingDate, setTempStartingDate] = useState(MIN_DATE);
    const [tempEndingDate, setTempEndingDate] = useState(MAX_DATE);
    const [topBorough, setTopBorough] = useState('');
    const [bottomBoroughs, setBottomBoroughs] = useState([]);

    useEffect(() => {
        const getStationsByRideNumber = async () => {
            // This API Call returns the stations in order of the number of rides that started or ended there
            // The data is then used and manipulated in different ways to provide various insights
            // i.e. 'Most Sustainable Borough (hightest rides/capita)', or 'Least Sustainable Boroughs (lowest rides/capita)'
            // Its inside a useEffect, which is dependent on the start and end date states, so that it runs again and
            //      updates the data when the filters are changed

            setIsLoading(true); // Renders the loading spinner whilst waiting for the API response
            try {
                const res = await fetch(
                    'http://localhost:8000/get_top_stations?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                const resData = await res.json();
                console.log('Response:', resData);

                // Parsing data to an external function to work out the 'Most Sustainable Borough' (rides/capita)
                setTopBorough(
                    findTopBoroughByRidesPerCapita(
                        resData,
                        stationDetails,
                        boroughPopulations
                    ).borough
                );

                // Parsing data to an external function to work out the 8 Least Sustainable Boroughs (rides/capita)
                setBottomBoroughs(
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
        getStationsByRideNumber();
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <h4>Most Sustainable Borough 🏆 (Rides / Capita)</h4>
                    {isLoading ? ( // If we are waiting for the API response data, display the loading circle
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
                    <h4> Least Sustainable Boroughs 📊 (Rides / Capita) </h4>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <BottomBoroughsGraph data={bottomBoroughs} />
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
                            views={['year', 'month', 'day']}
                            value={dayjs(tempStartingDate)}
                            onChange={(newStartingDate) => {
                                // The date value changes whenever something changes on the picker,
                                //      even if the year is just changed.
                                // I only want the filters to apply once a new date is confirmed,
                                //      which is why I save the updates to temp*Date state
                                // The filters are then applied and the real start and end date states are updated
                                //      once the 'Apply' button is clicked -> it then triggers a new API call
                                const fullStartDate = new Date(newStartingDate);
                                const formattedStartDate =
                                    dayjs(fullStartDate).format('YYYY-MM-DD');
                                setTempStartingDate(
                                    formattedStartDate.toString()
                                );
                                console.log(formattedStartDate);
                            }}
                            slotProps={{
                                // Styling for Filter Date Selectors
                                textField: {
                                    fullWidth: true,
                                    sx: {
                                        backgroundColor: '#fff',
                                        borderRadius: '5px',
                                        border: 'none',
                                        '& .MuiInputBase-root': {
                                            padding: '4px 12px',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4caf50',
                                        },
                                    },
                                },
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
                            views={['year', 'month', 'day']}
                            value={dayjs(tempEndingDate)}
                            onChange={(newEndingDate) => {
                                const fullEndDate = new Date(newEndingDate);
                                const formattedEndDate =
                                    dayjs(fullEndDate).format('YYYY-MM-DD');
                                setTempEndingDate(formattedEndDate.toString());
                                console.log(formattedEndDate);
                            }}
                            slotProps={{
                                // Styling for Filter Date Selectors
                                textField: {
                                    fullWidth: true,
                                    sx: {
                                        backgroundColor: '#fff',
                                        borderRadius: '5px',
                                        '& .MuiInputBase-root': {
                                            padding: '4px 12px',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4caf50',
                                        },
                                    },
                                },
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
                </div>
            </div>
        </>
    );
};
