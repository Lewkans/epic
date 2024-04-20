import React from 'react';
import { Container, Typography } from '@mui/material';

const GS = () => {
    const [data, setData] = React.useState({})
    const [arr, setArr] = React.useState([])
    
    return (
        <>
            <Container sx={{mt: 10}}>
                <Typography variant='h3'>E7 GS Checker</Typography>
            </Container>
        </>
    )
}

export default GS;