import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: number;
  name: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      const index = state.locations.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation: (state, action: PayloadAction<number>) => {
      state.locations = state.locations.filter(l => l.id !== action.payload);
    },
  },
});

export const {
  setLocations,
  setSelectedLocation,
  setLoading,
  setError,
  addLocation,
  updateLocation,
  deleteLocation,
} = locationSlice.actions;

export default locationSlice.reducer; 