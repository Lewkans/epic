import { Tab, Tabs } from '@mui/material';
import './App.css';
import React from 'react';
import GW from './components/GW';
import GS from './components/GS';
import GWS from './components/GWS';

import { Container } from '@mui/material';

function App() {
  const [tab, setTab] = React.useState(0);
  const [value, setValue] = React.useState('GS');

  const handleChange = (e, newValue) => {
    setTab(newValue);
    setValue(e.target.id);
  };
  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Gear Score" id="GS" />
        <Tab label="Guild War" id="GW" />
        <Tab label="Guild War Scout" id="GWS" />
      </Tabs>
      <Container maxWidth={'xl'} sx={{ mt: 5 }}>
        {value === 'GS' &&
          <GS />
        }
        {value === 'GW' &&
          <GW />
        }
        {value === 'GWS' &&
          <GWS />
        }
      </Container>
    </>
  );
}

export default App;
