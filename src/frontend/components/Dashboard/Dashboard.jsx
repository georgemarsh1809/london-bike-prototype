import styles from './Dashboard.module.css';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MostSustainableBorough } from './components/MostSustainableBorough';
import { BottomBoroughsGraph } from './components/BottomBoroughsGraph';
import { HotSpotsMap } from './components/HotSpotsMap';
import { BoroughChangesGraph } from './components/BoroughChangesGraph';
import { CarbonOffsetCalc } from './components/CarbonOffsetCalc';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MIN_DATE, MAX_DATE } from './Dashboard.constants';

export const Dashboard = () => {
    // Global State
    const {
        startingDate,
        setStartingDate,
        endingDate,
        setEndingDate,
        setTopBorough,
        setMostSustainableBoroughIsLoading,
        ignoreCityOfLondon,
        hotSpotsIsLoading,
        setHotSpotsIsLoading,
        leastSustainableBoroughsIsLoading,
        setLeastSustainableBoroughsIsLoading,
        setCarbonOffset,
        setCarbonOffsetIsLoading,
        setTreeEquivalent,
        setEstimatedDistance,
        biggestBoroughChangesIsLoading,
        setBiggestBoroughChangesIsLoading,
    } = useStore();

    // Local State
    const [tempStartingDate, setTempStartingDate] = useState(MIN_DATE);
    const [tempEndingDate, setTempEndingDate] = useState(MAX_DATE);

    // Graph and map related states - they don't like being moved into global state for some reason...
    const [bottomBoroughs, setBottomBoroughs] = useState([]);
    const [hotSpots, setHotSpots] = useState();
    const [biggestBoroughChanges, setBiggestBoroughChanges] = useState();

    useEffect(() => {
        setMostSustainableBoroughIsLoading(true); // Renders the loading spinner whilst waiting for the API response

        const getMostSustainableBorough = async () => {
            // This API call gets the data for 'Most Sustainable Borough', which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE

            try {
                const res = await fetch(
                    'http://localhost:8000/db/most_sustainable_borough?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                            ignoreCityOfLondon: ignoreCityOfLondon,
                        }).toString(),
                    { method: 'GET' }
                );

                // Explicit handling of a 200 response
                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                const resData = await res.json();
                console.log(
                    '(Res) most_sustainable_boroughs:',
                    resData[0]['borough']
                );
                setTopBorough(resData);
            } catch (error) {
                console.log('Fetch error:', error);
            } finally {
                setMostSustainableBoroughIsLoading(false);
            }
        };

        // This API call is in a separate useEffect since its also dependent on the state of 'ignoreCityOfLondon'
        getMostSustainableBorough();
    }, [startingDate, endingDate, ignoreCityOfLondon]);

    useEffect(() => {
        setLeastSustainableBoroughsIsLoading(true);
        setHotSpotsIsLoading(true);
        setCarbonOffsetIsLoading(true);
        setBiggestBoroughChangesIsLoading(true);

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

                const resData = await res.json();
                console.log(resData);

                setBottomBoroughs(resData);
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        const getHotSpots = async () => {
            // This API call gets the data for 'Hot Spots', which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE

            try {
                const res = await fetch(
                    'http://localhost:8000/db/hot_spots?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                // console.log('(Res) least_sustainable_boroughs:', resData);

                const resData = await res.json();
                setHotSpots(resData);
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        const getCO2Offset = async () => {
            // This API call gets the data for 'Carbon Offset Calculator', which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE
            try {
                const res = await fetch(
                    'http://localhost:8000/db/CO2_offset?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                const resData = await res.json();
                setCarbonOffset(Math.round(resData[0]), 2);
                setTreeEquivalent(resData[1]);
                setEstimatedDistance(Math.round(resData[2]), 2);
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        const getChangeInUsage = async () => {
            // This API call gets the data for the 'Change in Usage vs Time' graph, which is handled by backend services
            // The data is then passed to a state setter for rendering on the FE
            try {
                const res = await fetch(
                    'http://localhost:8000/db/change_in_usage?' +
                        new URLSearchParams({
                            start_date: startingDate,
                            end_date: endingDate,
                        }).toString(),
                    { method: 'GET' }
                );

                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                const resData = await res.json();
                setBiggestBoroughChanges(resData);
            } catch (error) {
                console.log('Fetch error:', error);
            }
        };

        const getAllData = async () => {
            const promises = [
                getLeastSustainableBoroughs(),
                getHotSpots(),
                getCO2Offset(),
                getChangeInUsage(),
            ];

            await Promise.all(promises);
            setLeastSustainableBoroughsIsLoading(false); // Turns the loading spinners off once we have data
            setHotSpotsIsLoading(false);
            setCarbonOffsetIsLoading(false);
            setBiggestBoroughChangesIsLoading(false);
        };

        getAllData();
    }, [startingDate, endingDate]);

    return (
        <>
            <div className={styles.dashboardContainer}>
                <div className={`${styles.topBorough} ${styles.widget} `}>
                    <MostSustainableBorough />
                </div>
                <div className={`${styles.hotSpotMap} ${styles.widget}`}>
                    <h4>Top Hot Spots 🔥</h4>
                    {hotSpotsIsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <HotSpotsMap stations={hotSpots} />
                        </>
                    )}
                </div>

                <div className={`${styles.carbonCalculator} ${styles.widget}`}>
                    <CarbonOffsetCalc />
                </div>
                <div className={`${styles.usageChart} ${styles.widget}`}>
                    <h4>Change in Usage Vs Time ⏱️</h4>
                    {biggestBoroughChangesIsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <BoroughChangesGraph data={biggestBoroughChanges} />
                        </>
                    )}
                </div>
                <div className={`${styles.boroughChart} ${styles.widget}`}>
                    <h4> Least Sustainable Boroughs 📊</h4>
                    {leastSustainableBoroughsIsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <BottomBoroughsGraph data={bottomBoroughs} />
                    )}
                </div>
                <div className={`${styles.filtersBox} `}>
                    <h4 style={{ color: ' #557751' }}>Filters 🔍</h4>
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
