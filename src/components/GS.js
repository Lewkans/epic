import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import gear from '../data/gear.js'

const GS = () => {
    const [data, setData] = React.useState([])
    
    const f = () => {
      console.log(JSON.parse(gear).items);
      setData(JSON.parse(gear).items);
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
    
    return (
        <>
            <Container sx={{mt: 10}}>
                <Typography variant='h3'>E7 Gear Checker</Typography>
                <Button onClick={() => {f()}}>TODO: Upload</Button>
                {data &&
                  <>
                    <Typography variant='h4'>Total Number of Gear: {data.length}</Typography>
                    <Typography variant='h4'>Lvl 88/90 Gear: {data.reduce((total, item) => ((item.level === 88 || item.level === 90) ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>20+ Speed Speed Set Gear: {data.reduce((total, item) => (item.set === 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= 20)).length) ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>20+ Speed Non-Speed Set Gear: {data.reduce((total, item) => (item.set !== 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= 20)).length) ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>25+ Speed Speed Set Gear: {data.reduce((total, item) => (item.set === 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= 25)).length) ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>25+ Speed Non-Speed Set Gear: {data.reduce((total, item) => (item.set !== 'SpeedSet' && (item.substats.filter(sub => (sub.type === 'Speed' && sub.value >= 25)).length) ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>70+ GS Gear: {data.reduce((total, item) => (calcGS(item.substats, item.level === 85) >= 70 ? total + 1 : total), 0)}</Typography>
                    <Typography variant='h4'>75+ GS Gear: {data.reduce((total, item) => (calcGS(item.substats, item.level === 85) >= 75 ? total + 1 : total), 0)}</Typography>
                  </>
                }
            </Container>
        </>
    )
}

export default GS;