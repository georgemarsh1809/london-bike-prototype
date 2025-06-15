import { create } from 'zustand';
import * as Constants from '../components/Dashboard/Dashboard.constants';

export const useStore = create((set) => ({
    // showSideModal: false,
    // toggleSideModal: () =>
    //     set((state) => ({ showSideModal: !state.showSideModal })),
    startingDate: Constants.MIN_DATE, // initialised as the minimum date of a hire in the hires table
    setStartingDate: (date) => set({ startingDate: date }),
    endingDate: Constants.MAX_DATE, // initialised as the minimum date of a hire in the hires table
    setEndingDate: (date) => set({ endingDate: date }),
}));
