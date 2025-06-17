import React from 'react';
import { useStore } from '../../../../stateManagement/store';
import styles from './MostSustainableBorough.module.css';
import { LoadingSpinner } from '../LoadingSpinner';

export const MostSustainableBorough = () => {
    const { topBorough, mostSustainableBoroughIsLoading } = useStore();

    return (
        <div className={styles.topBoroughContainer}>
            <div className={styles.header}>
                <h4>Most Sustainable Borough 🏆 (Rides / Capita)</h4>
                {/* <div className={styles.ignoreLondonCheckbox}>
                    <input type="checkbox" id="checkbox" />
                    <label htmlFor="checkbox"> Ignore 'City of London'</label>
                </div> */}
            </div>

            <div className={styles.topBoroughOutput}>
                {mostSustainableBoroughIsLoading ? ( // If we are waiting for the API response data, display the loading circle
                    <LoadingSpinner />
                ) : (
                    <>
                        <p style={{ fontWeight: 600, marginTop: '2rem' }}>
                            {topBorough.borough}
                        </p>
                        <p style={{ fontWeight: 300, marginTop: '2rem' }}>
                            {topBorough.rides_per_capita?.toFixed(1)}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
