import { create } from 'zustand';
import * as Constants from '../components/Dashboard/Dashboard.constants';

export const useStore = create((set) => ({
    // Dates
    startingDate: Constants.MIN_DATE, // initialised as the minimum date of a hire in the hires table
    setStartingDate: (date) => set({ startingDate: date }),
    endingDate: Constants.MAX_DATE, // initialised as the minimum date of a hire in the hires table
    setEndingDate: (date) => set({ endingDate: date }),

    // Loading flags
    mostSustainableBoroughIsLoading: false,
    setMostSustainableBoroughIsLoading: (value) =>
        set({ mostSustainableBoroughIsLoading: value }),
    leastSustainableBoroughsIsLoading: false,
    setLeastSustainableBoroughsIsLoading: (value) =>
        set({ leastSustainableBoroughsIsLoading: value }),
    hotSpotsIsLoading: false,
    setHotSpotsIsLoading: (value) => set({ hotSpotsIsLoading: value }),
    carbonOffsetIsLoading: false,
    setCarbonOffsetIsLoading: (value) => set({ carbonOffsetIsLoading: value }),

    // Data
    topBorough: '',
    setTopBorough: (data) => set({ topBorough: data }),
    bottomBoroughs: [],
    setBottomBoroughs: (data) => ({ bottomBoroughs: data }),
    hotSpots: [],
    setHotSpots: (data) => ({ hotSpots: data }),
    carbonOffset: '',
    setCarbonOffset: (data) => set({ carbonOffset: data }),
    treeEquivalent: '',
    setTreeEquivalent: (data) => set({ treeEquivalent: data }),
    estimatedDistance: '',
    setEstimatedDistance: (data) => set({ estimatedDistance: data }),
}));
