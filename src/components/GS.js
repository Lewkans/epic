import React from 'react';
import { Alert, AppBar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, MenuItem, Modal, Select, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'
import { CloudUpload, InfoRounded } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const RATIO = 0.995;

const GS = () => {
    const [data, setData] = React.useState([])
    const [dataC, setDataC] = React.useState([])
    const [speedS, setSpeedS] = React.useState(25)
    const [speedN, setSpeedN] = React.useState(25)
    const [gs, setGs] = React.useState(75)
    const [showAlert, setShowAlert] = React.useState(false)
    const [showSpeed, setShowSpeed] = React.useState(false)
    const [baseSpeed, setBaseSpeed] = React.useState(129)
    const [showScoreModal, setShowScoreModal] = React.useState(false)
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
            console.log(obj.items)
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
    
    const calcTopSpeedStatS = (gear) => {
      return Math.max(...(data.filter((item) => item.set === 'SpeedSet' && item.gear === gear)).map((weapon) => (weapon.reforgedStats.Speed)))
    }
    
    const calcTopSpeedStatAll = (gear) => {
      return Math.max(...(data.filter((item) => item.gear === gear)).map((weapon) => (weapon.reforgedStats.Speed)))
    }
    
    const calcTopSpeed = (base) => {
      const topSpeedWeaponS = calcTopSpeedStatS('Weapon')
      const topSpeedWeaponAll = calcTopSpeedStatAll('Weapon')
      
      const topSpeedHelmetS = calcTopSpeedStatS('Helmet')
      const topSpeedHelmetAll = calcTopSpeedStatAll('Helmet')
      
      const topSpeedArmorS = calcTopSpeedStatS('Armor')
      const topSpeedArmorAll = calcTopSpeedStatAll('Armor')
      
      const topSpeedNecklaceS = calcTopSpeedStatS('Necklace')
      const topSpeedNecklaceAll = calcTopSpeedStatAll('Necklace')
      
      const topSpeedRingS = calcTopSpeedStatS('Ring')
      const topSpeedRingAll = calcTopSpeedStatAll('Ring')
      
      const diff = [topSpeedWeaponAll - topSpeedWeaponS,
        topSpeedHelmetAll - topSpeedHelmetS,
        topSpeedArmorAll - topSpeedArmorS,
        topSpeedNecklaceAll - topSpeedNecklaceS,
        topSpeedRingAll - topSpeedRingS
      ].sort().reverse()
            
      return base * 1.25 + topSpeedWeaponS + topSpeedHelmetS + topSpeedArmorS + topSpeedNecklaceS + topSpeedRingS + 45 + diff[0] + diff[1];
    }
    
    const calcMedianGS = () => {
      if (data.length <= 1) {
        return 0
      }
      const sorted = data.sort((a, b) => a.reforgedWss - b.reforgedWss);
      const mid = Math.floor(data.length / 2);
      if (data.length % 2 === 0) {
        return (sorted[mid - 1].reforgedWss + sorted[mid].reforgedWss) / 2
      }
      return sorted[mid].reforgedWss;
    }
    
    const calcOverallScore = () => {
      const sorted = data.sort((a, b) => b.reforgedWss - a.reforgedWss);
      return (sorted.reduce((total, item, idx) => (total + item.reforgedWss * Math.pow(RATIO, idx)), 0)/100).toFixed(2);
    }
    
    const calcCombatScore = () => {
      const sorted = data.sort((a, b) => b.combatWss - a.combatWss);
      return (sorted.reduce((total, item, idx) => (total + item.combatWss * Math.pow(RATIO, idx)), 0)/100).toFixed(2);
    }
    
    const calcSupportScore = () => {
      const sorted = data.sort((a, b) => b.supportWss - a.supportWss);
      return (sorted.reduce((total, item, idx) => (total + item.supportWss * Math.pow(RATIO, idx)), 0)/100).toFixed(2);
    }
    
    const calcDPSScore = () => {
      const sorted = data.sort((a, b) => b.dpsWss - a.dpsWss);
      return (sorted.reduce((total, item, idx) => (total + item.dpsWss * Math.pow(RATIO, idx)), 0)/100).toFixed(2);
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
              <Typography variant='h3'>E7 Gear Checker</Typography>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={8}>
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
                    Upload autosave.json (Fribbels)
                    <VisuallyHiddenInput
                      type="file"
                    />
                  </Button>
                  <Typography variant='subtitle1'>
                    You can find autosave.json at C:\Users\NAME\Documents\FribbelsOptimizerSaves
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={showSpeed}
                        onChange={(e) => setShowSpeed(!showSpeed)}
                      />
                    }
                    label="Show Top Speed"
                  />
                </Grid>
              </Grid>
              {data.length !== 0 &&
                <>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={5}>
                      <AppBar position='static' sx={{mb: 1}}>
                        <Toolbar>
                          <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                          >
                            General Stats
                          </Typography>
                        </Toolbar>
                      </AppBar>
                      <Stack
                        spacing={2}
                      >
                        <>
                          <Typography
                            variant='h5'
                          >
                            Total Number of Gear: {data.length}
                          </Typography>
                          <Typography
                            variant='h5'
                          >
                            Lvl 88 Gear: {data.reduce((total, item) => ((item.level === 88) ? total + 1 : total), 0)}
                          </Typography>
                          <Typography
                            variant='h5'
                          >
                            Lvl 90 Gear: {data.reduce((total, item) => ((item.level === 90) ? total + 1 : total), 0)}
                          </Typography>
                          <Typography
                            variant='h5'
                          >
                            20+ Speed Speed Set Gear: {noSpeed(20)}
                          </Typography>
                          <Typography
                            variant='h5'
                          >
                            20+ Speed Non-Speed Set Gear: {noSpeedN(20)}
                          </Typography>
                          <Typography
                            variant='h5'
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
                            variant='h5'
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
                            variant='h5'
                          >
                            70+ GS Gear: {noGS(70)}
                          </Typography>
                          <Typography
                            variant='h5'
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
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <AppBar position='static' sx={{mb: 1}}>
                        <Toolbar>
                          <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                          >
                            Other Stats
                          </Typography>
                        </Toolbar>
                      </AppBar>
                      <Stack
                        spacing={2}
                      >
                        {showSpeed &&
                          <Box>
                            <Typography
                              variant='h5'
                              sx={{
                                display: 'flex',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              Top Speed <FormControl
                                sx={{
                                  ml: 1,
                                }}
                                InputProps={{
                                  style: {
                                    fontSize: 20,
                                    width: 100,
                                  }
                                }}>
                                <Select
                                  default={baseSpeed}
                                  value={baseSpeed}
                                  onChange={(e) => setBaseSpeed(e.target.value)}
                                >
                                  <MenuItem value={129}>Ran</MenuItem>
                                  <MenuItem value={128}>Peira</MenuItem>
                                  <MenuItem value={117}>Auxiliary Lots</MenuItem>
                                  <MenuItem value={121}>Conqueror Lilias</MenuItem>
                                  <MenuItem value={120}>Sea Phantom Politis</MenuItem>
                                  <MenuItem value={115}>Nahkwol</MenuItem>
                                </Select>
                              </FormControl>: {Math.round(calcTopSpeed(baseSpeed))}
                            </Typography>
                          </Box>
                        }
                        <Typography
                          variant='h5'
                        >
                          Max Attack %: {Math.max(...(data.map((weapon) => (weapon.reforgedStats.AttackPercent))), 0)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Max Defense %: {Math.max(...(data.map((weapon) => (weapon.reforgedStats.DefensePercent))), 0)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Max HP %: {Math.max(...(data.map((weapon) => (weapon.reforgedStats.HealthPercent))), 0)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Max Effectiveness %: {Math.max(...(data.map((weapon) => (weapon.reforgedStats.EffectivenessPercent))), 0)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Max Effect Resistance %: {Math.max(...(data.map((weapon) => (weapon.reforgedStats.EffectResistancePercent))), 0)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Average GS: {(data.reduce((total, item) => total + item.reforgedWss, 0) / data.length).toFixed(2)}
                        </Typography>
                        <Typography
                          variant='h5'
                        >
                          Median GS: {calcMedianGS()}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <AppBar position='static' sx={{mb: 1}}>
                        <Toolbar>
                          <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                          >
                            Score (Beta)
                          </Typography>
                          <IconButton
                            size="large"
                            onClick={() => setShowScoreModal(true)}
                            color="inherit"
                          >
                            <InfoRounded />
                          </IconButton>
                        </Toolbar>
                      </AppBar>
                      <Stack
                        spacing={2}
                      >
                        <Typography
                            variant='h5'
                          >
                            Overall Score: {calcOverallScore()}
                        </Typography>
                        <Typography
                            variant='h5'
                          >
                            DPS Score: {calcDPSScore()}
                        </Typography>
                        <Typography
                            variant='h5'
                          >
                            Bruiser Score: {calcCombatScore()}
                        </Typography>
                        <Typography
                            variant='h5'
                          >
                            Support Score: {calcSupportScore()}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}
                    >
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
                    </Grid>
                  </Grid>
                </>
              }
              <Modal
                open={showScoreModal}
                onClose={() => setShowScoreModal(false)}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography variant='h5'>
                    Score is calculated by:
                  </Typography>
                  <Typography variant='h6'>
                    1. Sorting the gear by gear score (depending on the stat)
                  </Typography>
                  <Typography variant='h6'>
                    2. Total Score = <InlineMath math={`\\frac{\\text{Gear Score of }n\\text{th item} \\times ${RATIO} ^ {n - 1}}{100}`} />
                  </Typography>
                  <Typography variant='subtitle'>
                    If you can think of a better calculation for this dm me @ekans on Discord
                  </Typography>
                </Box>
              </Modal>
        </>
    )
}

export default GS;