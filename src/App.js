import { Tab, Tabs } from '@mui/material';
import './App.css';
import React from 'react';
import GW from './components/GW';
import GS from './components/GS';

function App() {
  const [tab, setTab] = React.useState(0)
  const [value, setValue] = React.useState('GW')
  
  const handleChange = (e, newValue) => {
    setTab(newValue)
    setValue(e.target.id);
  }
  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Guild War" id="GW" />
        <Tab label="Gear Score" id="GS" />
      </Tabs>
      {value === 'GW' &&
        <GW />
      }
      {value === 'GS' &&
        <GS />
      }
    </>
  );
}

export default App;
