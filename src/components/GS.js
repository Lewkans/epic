import React from 'react';
import { Alert, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'
import { CloudUpload } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';

const GS = () => {
    const [data, setData] = React.useState([])
    const [dataC, setDataC] = React.useState([])
    const [speedS, setSpeedS] = React.useState(25)
    const [speedN, setSpeedN] = React.useState(25)
    const [gs, setGs] = React.useState(75)
    const [showAlert, setShowAlert] = React.useState(false)
    const uploadFile = (e) => {
      if (e.target.files) {
        const file = e.target.files[0];
        let f = new FileReader();
        f.readAsText(file);
        f.onload = function() {
          try {
            const obj = JSON.parse(f.result)
            if (obj.items === undefined) {
              throw new Error(`"items" field doesn't exist`);
            }
            setShowAlert(false)
            setData(obj.items)
            // console.log(obj.items)
            setDataC(dataCount(obj.items))
          }
          catch (e) {
            setShowAlert(true)
            console.error(e)
          }
          
        }
      }
    }
    
    const dataCount = (items) => {
      let dict = {};
      items.forEach((item) => {
        if (!dict[item.reforgedWss]) {
          dict[item.reforgedWss] = {'SpeedSet': 0, 'NonSpeedSet': 0}
        }
        dict[item.reforgedWss][item.set === 'SpeedSet' ? 'SpeedSet' : 'NonSpeedSet'] = dict[item.reforgedWss][item.set === 'SpeedSet' ? 'SpeedSet' : 'NonSpeedSet'] + 1
      });
      let arrGS = [];
      let arrS = [];
      let arrN = [];
      for (var key in dict) {
        arrGS.push(key)
        arrS.push(dict[key]['SpeedSet'])
        arrN.push(dict[key]['NonSpeedSet'])
      }
      return [arrGS, arrS, arrN];
    }
    
    const noSpeed = (speed) => {
      return data.reduce((total, item) => (item.set === 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= speed)).length) ? total + 1 : total), 0);
    }
    
    const noSpeedN = (speed) => {
      return data.reduce((total, item) => (item.set !== 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= speed)).length) ? total + 1 : total), 0);
    }
    
    const noGS = (gs) => {
      return data.reduce((total, item) => (item.reforgedWss >= gs ? total + 1 : total), 0);
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
            <Container sx={{mt: 5}}>
              <Typography variant='h3'>E7 Gear Checker</Typography>
              <Typography variant='subtitle1'>Not affiliated with Fribbels</Typography>
              {showAlert &&
                <Alert
                  severity='error'
                >
                  Make sure the file you're uploading is the autosave.json file from Fribbels Optimiser
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
                  Upload gear.txt (Fribbels)
                  <VisuallyHiddenInput
                    type="file"
                  />
                </Button>
                <Typography variant='subtitle1'>You can find gear.txt at C:\Users\NAME\Documents\FribbelsOptimizerSaves</Typography>
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
                          },
                          style: {
                            fontSize: 20,
                            width: 100,
                          }
                        }}
                        size='small'
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
                          },
                          style: {
                            fontSize: 20,
                            width: 100,
                          }
                        }}
                        size='small'
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
                          },
                          style: {
                            fontSize: 20,
                            width: 100,
                          }
                        }}
                        size='small'
                      /> + GS Gear: {noGS(gs)}
                    </Typography>
                  </>
                }
              </Stack>
              {dataC.length !== 0 &&
                <BarChart
                  series={[
                    {data: dataC[1], label: 'Speed Set', id: 'speedId', stack: 'all'},
                    {data: dataC[2], label: 'Non Speed Set', id: 'nonSpeedId', stack: 'all'},
                  ]}
                  width={1000}
                  height={600}
                  xAxis={[{data: dataC[0], scaleType: 'band', label: 'Gear Score'}]}
                  yAxis={[{label: 'Number of Gear'}]}
                />
              }
            </Container>
        </>
    )
}

export default GS;