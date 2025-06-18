import { useStore } from '../../../../stateManagement/store';
import { LoadingSpinner } from '../LoadingSpinner';
import styles from './CarbonOffsetCalc.module.css';

export const CarbonOffsetCalc = () => {
    const {
        carbonOffset,
        carbonOffsetIsLoading,
        treeEquivalent,
        estimatedDistance,
    } = useStore();

    return (
        <>
            <h4>Carbon Offset Calculator 🌳</h4>
            <div className={styles.outputContainer}>
                {carbonOffsetIsLoading ? ( // If we are waiting for the API response data, display the loading circle
                    <LoadingSpinner />
                ) : (
                    <>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'clamp(0.8rem, 1.3vw, 1.5rem)',
                            }}
                        >
                            CO² saved:
                        </p>
                        <p
                            style={{
                                margin: 0,
                                marginTop: -50,
                                marginBottom: -55,
                                fontSize: 'clamp(1rem, 5vw, 3rem)',
                                fontWeight: 700,
                            }}
                        >
                            {carbonOffset.toLocaleString('en-US')}kg
                        </p>

                        <p
                            style={{
                                margin: 0,
                                marginTop: 20,
                                marginBottom: 20,
                                fontSize: 'clamp(0.5rem, 1vw, 1rem)',
                                fontStyle: 'italic',
                                fontWeight: 400,
                            }}
                        >
                            That's like{' '}
                            <strong>
                                {treeEquivalent.toLocaleString('en-US')}
                            </strong>{' '}
                            trees planted in a year... 🌳
                        </p>
                    </>
                )}
            </div>
            <div style={{ marginLeft: 10, fontWeight: 500 }}>
                <strong>Estimated Distance:</strong>{' '}
                {estimatedDistance.toLocaleString('en-US')} km
            </div>
        </>
    );
};
