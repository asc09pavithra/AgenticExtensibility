import React, { } from 'react';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        width: '100%',
        '& > * + *': {
            color: grey[500],
            marginLeft: theme.spacing(4),
        },
    },
}), { defaultTheme: theme });


export default function Loading(props) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CircularProgress />
            <Typography variant="h6" component="span">{props.message}</Typography>
        </div>
    );
}
