import React, { } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import { green, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}), { defaultTheme: theme });

export default function AppAlert(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
                <Alert 
                    elevation={6} 
                    variant="filled" 
                    onClose={props.handleClose} 
                    severity={props.severity}
                    sx={{
                        '&.MuiAlert-filledSuccess': {
                            backgroundColor: green[500]
                        },
                        '&.MuiAlert-filledError': {
                            backgroundColor: red[500]
                        }
                    }}
                >
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
