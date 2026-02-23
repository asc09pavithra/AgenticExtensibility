import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import LogService from '../../services/LogService';
import SDKButton from '../../common/SDKButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'set',
        },
    },
    loading: {
        marginTop: 10,
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
    table: {
        minWidth: 450,
    }
}), { defaultTheme: theme });

function RegistrationLogDetails({ log }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell align="left">{log.type || ''}</TableCell>
                <TableCell align="left">{log.data.resourceId}</TableCell>
                <TableCell align="left">{log.data.resourceLink}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function RegistrationLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Solution Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Resource Id</TableCell>
                        <TableCell align="left">Resource Link</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <RegistrationLogDetails key={log.timestamp} log={log} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function CallbackLogDetails({ log }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell>{log.type.replace('CallbackPayload', '')}</TableCell>
                <TableCell align="left">{log.data.operationId}</TableCell>
                <TableCell align="left">{log.data.usbTransferStatus}</TableCell>
                <TableCell align="left">{log.data.data ? log.data.data : log.data.bytesWritten}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function CallbackLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Solution Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Operation Id</TableCell>
                        <TableCell>Usb Transfer Status</TableCell>
                        <TableCell align="left">Bytes Written or Data</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <CallbackLogDetails key={log.timestamp} log={log} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function UsbAccessoriesLogContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isCallbackLoading, setIsCallbackLoading] = useState(false);
    const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
    const [registrationLog, setRegistrationLog] = useState(null);
    const [callbackLog, setCallbackLog] = useState(null);
    const [showCallbackResponse, setShowCallbackResponse] = useState(false);
    const [showRegistrationResponse, setShowRegistrationResponse] = useState(false);

    useEffect(() => {
        loadRegistrationLogContent();
        loadCallbackLogContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadCallbackLogContent() {
        let response;
        console.log("in loadCallbackLogContent");

        setIsCallbackLoading(true);
        try {
            response = await logService.getLog("usbcallback");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCallbackLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve UsbAccessories service logs - ' + error.cause.message);
        }
        setIsCallbackLoading(false);
    }

    async function clearCallbackLog() {
        setIsCallbackLoading(true);
        try {
            await logService.clearLog("usbcallback");
            setCallbackLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear Callback log data - ' + error.cause.message);
        }
        setIsCallbackLoading(false);
    }

    async function loadRegistrationLogContent() {
        let response;
        console.log("in loadRegistrationLogContent");

        setIsRegistrationLoading(true);
        try {
            response = await logService.getLog("usbregistration");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setRegistrationLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve UsbAccessories service logs - ' + error.cause.message);
        }
        setIsRegistrationLoading(false);
    }

    async function clearRegistrationLog() {
        console.log("in clearRegistrationLog");

        setIsRegistrationLoading(true);
        try {
            await logService.clearLog("usbregistration");
            setRegistrationLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear Registration log data - ' + error.cause.message);
        }
        setIsRegistrationLoading(false);
    }

    async function handleRegistrationDialogOpen() {
        setShowRegistrationResponse(true);
    }

    async function handleRegistrationDialogClose() {
        setShowRegistrationResponse(false);
    }

    async function handleCallbackDialogOpen() {
        setShowCallbackResponse(true);
    }

    async function handleCallbackDialogClose() {
        setShowCallbackResponse(false);
    }

    return (
        <Grid container spacing={2}>
        <Grid item xs={12} spacing={2}>
            <Card>
                <CardContent>
                    <Typography>Owned USB Device Registrations</Typography>
                    {
                        isCallbackLoading ? <Loading message="Loading resource..." /> :
                            (registrationLog && <RegistrationLogs logs={registrationLog} />)
                    }
                </CardContent>
                <CardActions>
                    <SDKButton
                        disabled={false}
                        postAlert={props.postAlert}
                        buttonlabel="Refresh"
                        primaryToolTip="Refresh Registration Log"
                        secondaryToolTip="Log Unavailable"
                        secondaryToolTipCondition={true}
                        onClick={loadRegistrationLogContent}
                    />
                    <SDKButton
                        disabled={false}
                        postAlert={props.postAlert}
                        buttonlabel="Clear"
                        primaryToolTip="Clear Registration Log"
                        secondaryToolTip="Log Unavailable"
                        secondaryToolTipCondition={true}
                        onClick={clearRegistrationLog}
                    />
                    <SDKButton
                        data-testid="usb-accessories-logs-api-response"
                        disabled={!registrationLog}
                        postAlert={props.postAlert}
                        buttonlabel="Show Log"
                        primaryToolTip="Show Registration Log"
                        secondaryToolTip="Log Unavailable"
                        secondaryToolTipCondition={registrationLog != null}
                        onClick={handleRegistrationDialogOpen}
                    />
                    <ApiResponseDialog title="UsbAccessories Log" open={showRegistrationResponse} apiResponse={registrationLog} handleClose={handleRegistrationDialogClose} />
                </CardActions>
            </Card>
        </Grid>
        <Grid item xs={12} spacing={2}>
            <Card>
                <CardContent>
                    <Typography>Callbacks</Typography>
                    {
                        isRegistrationLoading ? <Loading message="Loading resource..." /> :
                            (callbackLog && <CallbackLogs logs={callbackLog} />)
                    }
                </CardContent>
                <CardActions>
                <SDKButton
                    disabled={false}
                    postAlert={props.postAlert}
                    buttonlabel="Refresh"
                    primaryToolTip="Refresh Callback Log"
                    secondaryToolTip="Log Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={loadCallbackLogContent}
                />
                <SDKButton
                    disabled={false}
                    postAlert={props.postAlert}
                    buttonlabel="Clear"
                    primaryToolTip="Clear Callback Log"
                    secondaryToolTip="Log Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={clearCallbackLog}
                />
                <SDKButton
                    data-testid="usb-accessories-logs-api-response"
                    disabled={!callbackLog}
                    postAlert={props.postAlert}
                    buttonlabel="Show Log"
                    primaryToolTip="Show Callback Log"
                    secondaryToolTip="Log Unavailable"
                    secondaryToolTipCondition={callbackLog != null}
                    onClick={handleCallbackDialogOpen}
                />
                    <ApiResponseDialog title="UsbAccessories Log" open={showCallbackResponse} apiResponse={callbackLog} handleClose={handleCallbackDialogClose} />
                </CardActions>
            </Card>
        </Grid>
        </Grid>
    );
}
export {
    UsbAccessoriesLogContent
};
