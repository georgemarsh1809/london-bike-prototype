import { Dashboard } from './components/Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div style={{ width: '100dvw', backgroundColor: '#f5f5f5' }}>
                <div style={{ marginLeft: 20 }}>
                    <h1>Sustainable Travel in London 🌳</h1>
                </div>
                <Dashboard></Dashboard>
            </div>
        </LocalizationProvider>
    );
}

export default App;
