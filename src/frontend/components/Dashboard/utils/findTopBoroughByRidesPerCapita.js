export function findTopBoroughByRidesPerCapita(
    topStations,
    stationDetails,
    boroughPopulations
) {
    // Created by ChatGPT

    // Map station_id to borough
    const stationIdToBorough = {};
    stationDetails.forEach(({ id, borough }) => {
        stationIdToBorough[id] = borough;
    });

    // Aggregate rides by borough
    const boroughRides = {};
    topStations.forEach(({ station_id, total_rides }) => {
        const borough = stationIdToBorough[station_id];
        if (!borough) {
            console.warn(`No borough found for station ID ${station_id}`);
            return;
        }
        boroughRides[borough] = (boroughRides[borough] || 0) + total_rides;
    });

    // Map population data
    const boroughToPopulation = {};
    boroughPopulations.forEach(({ borough, population_2021 }) => {
        boroughToPopulation[borough] = population_2021;
    });

    // Calculate rides per capita
    const ridesPerCapita = {};
    for (const [borough, rides] of Object.entries(boroughRides)) {
        const population = boroughToPopulation[borough];
        if (!population) {
            console.warn(`No population found for borough: ${borough}`);
            continue;
        }
        ridesPerCapita[borough] = rides / population;
    }

    // Find the borough with the highest rides per capita
    let maxBorough = null;
    let maxRate = 0;
    for (const [borough, rate] of Object.entries(ridesPerCapita)) {
        if (rate > maxRate) {
            maxRate = rate;
            maxBorough = borough;
        }
    }

    return {
        borough: maxBorough,
        rides_per_capita: maxRate,
    };
}
