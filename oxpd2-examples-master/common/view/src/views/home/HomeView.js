import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
}), { defaultTheme: theme });

export default function HomeView() {
    const classes = useStyles();

    return (
        <div data-testid='home-view' className={classes.root}>
            <Typography variant="h4" paragraph={true}>
                Introduction to the OXPd2 Examples
            </Typography>
            <Typography paragraph={true}>
                A wonderful introduction to the OXPd2 examples follows. Details about how to navigate and use the app are provided as well.
            </Typography>
        </div>
    );
}
