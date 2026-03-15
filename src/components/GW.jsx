import React from 'react';
import battleWin from '../images/battle_pvp_icon_win.png';
import battleDraw from '../images/battle_pvp_icon_draw.png';
import battleLoss from '../images/battle_pvp_icon_lose.png';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';

const GW = () => {
  const [data, setData] = React.useState({});
  const [arr, setArr] = React.useState([]);

  React.useEffect(() => {
    if (localStorage.getItem('data') === null) {
      localStorage.setItem('data', JSON.stringify({}));
    }
    (async () => {
      const res = await fetch("https://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json");
      const json = await res.json();
      setData(json);
      setArr(Object.keys(json).map(function (key, idx) {
        return { "name": key, "icon": json[key].assets.icon };
      }));
    })();
  }, []);

  const [open, setOpen] = React.useState(false);

  const [hero1, setHero1] = React.useState(null);
  const [hero2, setHero2] = React.useState(null);
  const [hero3, setHero3] = React.useState(null);
  const [inputHero1, setInputHero1] = React.useState('');
  const [inputHero2, setInputHero2] = React.useState('');
  const [inputHero3, setInputHero3] = React.useState('');

  // Modal variables
  const [defHero1, setDefHero1] = React.useState(null);
  const [defHero2, setDefHero2] = React.useState(null);
  const [defHero3, setDefHero3] = React.useState(null);
  const [inputDefHero1, setInputDefHero1] = React.useState('');
  const [inputDefHero2, setInputDefHero2] = React.useState('');
  const [inputDefHero3, setInputDefHero3] = React.useState('');

  const [atkHero1, setAtkHero1] = React.useState(null);
  const [atkHero2, setAtkHero2] = React.useState(null);
  const [atkHero3, setAtkHero3] = React.useState(null);
  const [inputAtkHero1, setInputAtkHero1] = React.useState('');
  const [inputAtkHero2, setInputAtkHero2] = React.useState('');
  const [inputAtkHero3, setInputAtkHero3] = React.useState('');

  const [battleRes, setBattleRes] = React.useState('W');
  const [notes, setNotes] = React.useState('');

  const [res, setRes] = React.useState([]);


  const copy = () => {
    setDefHero1(hero1);
    setDefHero2(hero2);
    setDefHero3(hero3);
  };

  const remove = (key, idx) => {
    const storage = JSON.parse(localStorage.getItem('data'));
    const sortedName = [hero1.name, hero2.name, hero3.name].sort((a, b) => a > b ? 1 : a < b ? -1 : 0).join(',');
    if (storage[sortedName][key].length === 1) {
      delete storage[sortedName][key];
      console.log(storage[sortedName]);
      if (Object.keys(storage[sortedName]).length === 0) {
        delete storage[sortedName];
      }
    } else {
      storage[sortedName][key].splice(idx, 1);
    }
    localStorage.setItem('data', JSON.stringify(storage));
    search();
  };

  const search = () => {
    if (hero1 === null || hero2 === null || hero3 === null) return;
    const tmp = [hero1.name, hero2.name, hero3.name];
    tmp.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    const str = tmp.join(',');
    const storage = JSON.parse(localStorage.getItem('data'));
    console.log(storage[str]);
    setRes(storage[str]);
  };

  const add = () => {
    if (defHero1 === null || defHero2 === null || defHero3 === null) return;
    if (atkHero1 === null || atkHero2 === null || atkHero3 === null) return;
    const def = [defHero1.name, defHero2.name, defHero3.name];
    const atk = [atkHero1.name, atkHero2.name, atkHero3.name];
    def.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    atk.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    const defStr = def.join(',');
    const atkStr = atk.join(',');
    const result = { "result": battleRes, "notes": notes };
    const storage = JSON.parse(localStorage.getItem('data'));
    if (storage[defStr] === undefined) {
      storage[defStr] = {};
    }
    if (storage[defStr][atkStr] === undefined) {
      storage[defStr][atkStr] = [result];
    } else {
      storage[defStr][atkStr].push(result);
    }
    localStorage.setItem('data', JSON.stringify(storage));
    search();
  };

  const getSavedDefenses = () => {
    const storage = JSON.parse(localStorage.getItem('data'));
    const teams = Object.keys(storage).map((team) => { return team; });
    return teams;
  };

  async function copyToHeroes(team) {
    const chars = team.split(',');
    setHero1(data[chars[0]]);
    setHero2(data[chars[1]]);
    setHero3(data[chars[2]]);
    const storage = JSON.parse(localStorage.getItem('data'));
    setRes(storage[team]);
  }

  return (
    <>
      <Typography variant='h3'
        component="a"
        href="#"
        onClick={() => {
          setRes([]);
        }}
        sx={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        E7 GW Self-Tracker
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <Autocomplete
            sx={{ width: 300, p: 2 }}
            options={arr}
            autoHighlight
            value={hero1}
            onChange={(e, v) => {
              setHero1(v);
            }}
            inputValue={inputHero1}
            onInputChange={(e, v) => {
              setInputHero1(v);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="30"
                  src={option.icon}
                  alt={option.name}
                />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Hero"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                error={hero1 === null}
              />
            )}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            sx={{ width: 300, p: 2 }}
            options={arr}
            autoHighlight
            value={hero2}
            onChange={(e, v) => {
              setHero2(v);
            }}
            inputValue={inputHero2}
            onInputChange={(e, v) => {
              setInputHero2(v);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="30"
                  src={option.icon}
                  alt={option.name}
                />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Hero"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                error={hero2 === null}
              />
            )}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            sx={{ width: 300, p: 2 }}
            options={arr}
            autoHighlight
            value={hero3}
            onChange={(e, v) => {
              setHero3(v);
            }}
            inputValue={inputHero3}
            onInputChange={(e, v) => {
              setInputHero3(v);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="30"
                  src={option.icon}
                  alt={option.name}
                />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Hero"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                error={hero3 === null}
              />
            )}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          pb: 2
        }}
      >
        <Button variant="contained" onClick={() => { search(); }}>Search</Button>
        <Button variant="contained" onClick={() => { setOpen(true); }}>Add New Attack</Button>
      </Box>
      {res !== undefined && Object.keys(data).length !== 0 && res.length === 0 &&
        <>
          <Typography variant='h5'>Saved Defences</Typography>
          {
            <List sx={{ width: '100%', maxWidth: 250 }}>
              {
                getSavedDefenses().map((team, idx) => {
                  return <ListItem>
                    <ListItemButton
                      onClick={() => { copyToHeroes(team); }}
                    >
                      <ListItemIcon>
                        {team.split(',').map((c) => {
                          return (
                            <Tooltip title={c}>
                              <img
                                loading="lazy"
                                width="60"
                                src={data[c].assets.icon}
                                alt={c}
                              />
                            </Tooltip>);
                        })}
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>;
                })
              }
            </List>
          }
        </>
      }
      {res === undefined ?
        <Typography>No Results. <Link onClick={() => { setOpen(true); }} href="#">Add it</Link></Typography> :
        <>
          {Object.keys(res).map(function (key, idx) {
            return <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
              >
                <Box
                  sx={{ width: '85%' }}
                >
                  {key.split(',').map((c) => {
                    return (<img
                      loading="lazy"
                      width="60"
                      src={data[c].assets.icon}
                      alt={c}
                    />);
                  })}
                </Box>
                <Typography variant='h6'>
                  {res[key].filter((o) => o.result === 'W').length} W {res[key].filter((o) => o.result === 'D').length} D {res[key].filter((o) => o.result === 'L').length} L
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {res[key].map((o) => {
                  return (
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <img
                            src={o.result === 'W' ? battleWin : o.result === 'L' ? battleLoss : battleDraw}
                            width={40}
                            alt={o.result}
                          />
                        </ListItemIcon>
                        <ListItemText primary={o.notes} />
                        <Button
                          variant='contained'
                          color='error'
                          onClick={() => { remove(key, idx); }}
                        >
                          Delete
                        </Button>
                      </ListItem>
                    </List>);
                })}
              </AccordionDetails>
            </Accordion>;
          })}
        </>
      }
      <Modal
        open={open}
        onClose={() => { setOpen(false); }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 1200,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            padding: 2,
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Typography variant='h5'>Defence Team</Typography>
            <Button onClick={() => { copy(); }}>Copy Search</Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={defHero1}
                onChange={(e, v) => {
                  setDefHero1(v);
                }}
                inputValue={inputDefHero1}
                onInputChange={(e, v) => {
                  setInputDefHero1(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={defHero1 === null}
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={defHero2}
                onChange={(e, v) => {
                  setDefHero2(v);
                }}
                inputValue={inputDefHero2}
                onInputChange={(e, v) => {
                  setInputDefHero2(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={defHero2 === null}
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={defHero3}
                onChange={(e, v) => {
                  setDefHero3(v);
                }}
                inputValue={inputDefHero3}
                onInputChange={(e, v) => {
                  setInputDefHero3(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={defHero3 === null}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Typography variant='h5'>Attack Team</Typography>
          <Grid container spacing={2}>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={atkHero1}
                onChange={(e, v) => {
                  setAtkHero1(v);
                }}
                inputValue={inputAtkHero1}
                onInputChange={(e, v) => {
                  setInputAtkHero1(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={atkHero1 === null}
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={atkHero2}
                onChange={(e, v) => {
                  setAtkHero2(v);
                }}
                inputValue={inputAtkHero2}
                onInputChange={(e, v) => {
                  setInputAtkHero2(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={atkHero2 === null}
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <Autocomplete
                sx={{ width: 300, p: 2 }}
                options={arr}
                autoHighlight
                value={atkHero3}
                onChange={(e, v) => {
                  setAtkHero3(v);
                }}
                inputValue={inputAtkHero3}
                onInputChange={(e, v) => {
                  setInputAtkHero3(v);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="30"
                      src={option.icon}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Hero"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={atkHero3 === null}
                  />
                )}
              />
            </Grid>
          </Grid>
          <FormControl>
            <FormLabel>Battle Result</FormLabel>
            <RadioGroup
              value={battleRes}
              onChange={(e) => { setBattleRes(e.target.value); }}
              defaultValue="W"
              row
            >
              <FormControlLabel value="W" control={<Radio />} label="Win" />
              <FormControlLabel value="D" control={<Radio />} label="Draw" />
              <FormControlLabel value="L" control={<Radio />} label="Loss" />
            </RadioGroup>
          </FormControl>
          <Typography>Notes</Typography>
          <TextField
            label="Extra Notes"
            fullWidth
            value={notes}
            onChange={(e) => { setNotes(e.target.value); }}
          />
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pt: 1
          }}>
            <Button variant='contained' sx={{ mr: 1 }} onClick={() => { add(); setOpen(false); }}>Add</Button>
            <Button variant='contained' color='error' onClick={() => { setOpen(false); }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GW;