import React from 'react';
import { Alert, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'
import { CloudUpload } from '@mui/icons-material';


const GS = () => {
    const [data, setData] = React.useState([])
    const [speedS, setSpeedS] = React.useState(25)
    const [speedN, setSpeedN] = React.useState(25)
    const [gs, setGs] = React.useState(75)
    const [showAlert, setShowAlert] = React.useState(false)
    const uploadFile = (e) => {
      if (e.target.files) {
        const file = e.target.files[0];
        console.log(file);
        let f = new FileReader();
        f.readAsText(file);
        f.onload = function() {
          try {
            const obj = JSON.parse(f.result)
            console.log(obj);
            console.log(obj.items);
            if (obj.items === undefined) {
              throw new Error(`"items" field doesn't exist`);
            }
            setShowAlert(false)
            setData(obj.items)
          }
          catch (e) {
            setShowAlert(true)
            console.error(e)
          }
          
        }
      }
    }
    
    const calcGS = (substats, reforgable) => {
      return Math.round(substats.reduce((total, sub) => total + calcStat(sub, reforgable), 0))
    }
    
    // Taken from Fribbels
    const calcStat = (sub, r) => {
      const type = sub.type
      const value = sub.value
      const rolls = sub.rolls
      switch (type) {
        case 'Attack':
          return ((r ? ((rolls - 1) * 11) : 0) + value) * 3.46 / 39;
        case 'AttackPercent':
          return ((r ? (rolls >= 5 ? rolls + 2 : rolls >= 2 ? rolls + 1 : rolls) : 0) + value);
        case 'Defense':
          return ((r ? ((rolls - 1) * 9) : 0) + value) * 4.99 / 31;
        case 'DefensePercent':
          return ((r ? (rolls >= 5 ? rolls + 2 : rolls >= 2 ? rolls + 1 : rolls) : 0) + value);
        case 'Health':
          return ((r ? ((rolls - 1) * 56) : 0) + value) * 3.09 / 174;
        case 'HealthPercent':
          return ((r ? (rolls >= 5 ? rolls + 2 : rolls >= 2 ? rolls + 1 : rolls) : 0) + value);
        case 'CriticalHitChancePercent':
          return ((r ? rolls : 0) + value) * 8 / 5;
        case 'CriticalHitDamagePercent':
          return ((r ? (rolls >= 5 ? rolls + 1 : rolls) : 0) + value) * 8 / 7;
        case 'EffectResistancePercent':
          return ((r ? (rolls >= 5 ? rolls + 2 : rolls >= 2 ? rolls + 1 : rolls) : 0) + value);
        case 'EffectivenessPercent':
          return ((r ? (rolls >= 5 ? rolls + 2 : rolls >= 2 ? rolls + 1 : rolls) : 0) + value);
        case 'Speed':
          return ((r ? (Math.min(rolls - 1, 4)) : 0) + value) * 8 / 4;
        default:
          console.log("You forgot " + type);
      }
    }
    
    const noSpeed = (speed) => {
      return data.reduce((total, item) => (item.set === 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= speed)).length) ? total + 1 : total), 0);
    }
    
    const noSpeedN = (speed) => {
      return data.reduce((total, item) => (item.set !== 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= speed)).length) ? total + 1 : total), 0);
    }
    
    const noGS = (gs) => {
      return data.reduce((total, item) => (calcGS(item.substats, item.level === 85) >= gs ? total + 1 : total), 0);
    }
    
    // Taken from https://mui.com/material-ui/react-button/
    const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    });
    
    return (
        <>
            <Container sx={{mt: 10}}>
              <Typography variant='h3'>E7 Gear Checker</Typography>
              {showAlert &&
                <Alert
                  severity='error'
                >
                  Make sure the file you're uploading is the gear.txt file from Fribbels Optimiser
                </Alert>
              }
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUpload />}
                  onChange={uploadFile}
                >
                  Upload gear.txt
                  <VisuallyHiddenInput
                    type="file"
                  />
                </Button>
                <Stack
                  spacing={2}
                >
                {data &&
                  <>
                    <Typography
                      variant='h4'
                    >
                      Total Number of Gear: {data.length}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      Lvl 88/90 Gear: {data.reduce((total, item) => ((item.level === 88 || item.level === 90) ? total + 1 : total), 0)}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      20+ Speed Speed Set Gear: {noSpeed(20)}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      20+ Speed Non-Speed Set Gear: {noSpeedN(20)}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      <TextField
                        type='number'
                        value={speedS}
                        onChange={(e) => setSpeedS(e.target.value)}
                        InputProps={{
                          inputProps:{
                            min: 1,
                            max: 30,
                            step: 1
                          }
                        }}
                      /> + Speed Speed Set Gear: {noSpeed(parseInt(speedS))}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      <TextField
                        type='number'
                        value={speedN}
                        onChange={(e) => setSpeedN(e.target.value)}
                        InputProps={{
                          inputProps:{
                            min: 1,
                            max: 30,
                            step: 1
                          }
                        }}
                      /> + Speed Non-Speed Set Gear: {noSpeedN(parseInt(speedN))}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      70+ GS Gear: {noGS(70)}
                    </Typography>
                    <Typography
                      variant='h4'
                    >
                      <TextField
                        type='number'
                        value={gs}
                        onChange={(e) => setGs(e.target.value)}
                        InputProps={{
                          inputProps:{
                            min: 50,
                            max: 100,
                            step: 1
                          }
                        }}
                      /> + GS Gear: {noGS(gs)}
                    </Typography>
                  </>
                }
              </Stack>
            </Container>
        </>
    )
}

export default GS;