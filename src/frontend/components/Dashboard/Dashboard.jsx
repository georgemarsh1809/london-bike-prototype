import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BottomBoroughsGraph } from './BottomBoroughsGraph/';
import { LoadingSpinner } from './LoadingSpinner';
import { MIN_DATE, MAX_DATE } from './Dashboard.constants';
import dayjs from 'dayjs';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
    // Global State
    const { startingDate, setStartingDate, endingDate, setEndingDate } =
        useStore();

    // Local State
    const [tempStartingDate, setTempStartingDate] = useState(MIN_DATE);
    const [tempEndingDate, setTempEndingDate] = useState(MAX_DATE);
    const [topBorough, setTopBorough] = useState('');
    const [bottomBoroughs, setBottomBoroughs] = useState([]);

    // Having individual loading states for each widget means that the data can be returned out of sync for each widget,
    //      and they will load individually
    const [
        mostSustainableBoroughIsLoading,
        setMostSustainableBoroughIsLoading,
    ] = useState(false);

    const [
        leastSustainableBoroughsIsLoading,
        setLeastSustainableBoroughsIsLoading,
    ] = useState(false);

    useEffect(() => {
        setMostSustainableBoroughIsLoading(true); // Renders the loading spinner whilst waiting for the API response
        setLeastSustainableBoroughsIsLoading(true); // Renders the loading spinner whilst waiting for the API response

        const getMostSustainableBorough = async () => {
            // This API call gets the data for 'Most Sustainable Borough', which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE

            try {
                const res = await fetch(
                    'http://localhost:8000/db/most_sustainable_borough?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                // Explicit handling of a 200 response
                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                // console.log('(Res) most_sustainable_boroughs::', resData);
                const resData = await res.json();
                if (resData?.borough) {
                    setTopBorough(resData.borough);
                } else {
                    setTopBorough('No data found');
                }
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        const getLeastSustainableBoroughs = async () => {
            // This API call gets the data for 'Least Sustainable Boroughs', which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE

            try {
                const res = await fetch(
                    'http://localhost:8000/db/least_sustainable_boroughs?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                // console.log('(Res) least_sustainable_boroughs:', resData);

                const resData = await res.json();

                setBottomBoroughs(resData);
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        Promise.all([
            getLeastSustainableBoroughs(),
            getMostSustainableBorough(),
        ]).finally(() => {
            setLeastSustainableBoroughsIsLoading(false); // Turns the loading spinner off once we have data
            setMostSustainableBoroughIsLoading(false); // Turns the loading spinner off once we have data
        });
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <h4>Most Sustainable Borough 🏆 (Rides / Capita)</h4>
                    {mostSustainableBoroughIsLoading ? ( // If we are waiting for the API response data, display the loading circle
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
                    {leastSustainableBoroughsIsLoading ? (
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
