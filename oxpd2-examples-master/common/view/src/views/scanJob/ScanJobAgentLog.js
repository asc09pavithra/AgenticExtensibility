import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import ActivityStatus from '../../common/ActivityStatus';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import LogService from '../../services/LogService';
import SDKButton from '../../common/SDKButton';
import { PropertyItem } from '../../common/ResponseTypes';
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

function ScanJobNotificationLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Scan Job Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell align="left">Scan Job Id</TableCell>
                        <TableCell align="left">Solution Context</TableCell>
                        <TableCell align="left">Scan Job Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <NotificationRow key={log.timestamp} log={log} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function NotificationRow({ log }) {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    function BuildScanJobStatus({ ScanJobStatus }) {
        return (
            <React.Fragment>
                <ActivityStatus name="cancelingState" object={ScanJobStatus.cancelingState} />

                <ActivityStatus name="jobActivity" object={ScanJobStatus.jobActivity} />

                <PropertyItem primary="jobDoneStatus" secondary={ScanJobStatus.jobDoneStatus} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="jobDoneStatusDetail" secondary={ScanJobStatus.jobDoneStatusDetail} />
                <Divider style={{ marginLeft: "40px" }} />

                <ActivityStatus name="processingActivity" object={ScanJobStatus.processingActivity} />

                <PropertyItem primary="processingRestartCount" secondary={ScanJobStatus.processingRestartCount} />
                <Divider style={{ marginLeft: "40px" }} />

                <ActivityStatus name="scanningActivity" object={ScanJobStatus.scanningActivity} />

                <PropertyItem primary="totalImagesProcessed" secondary={ScanJobStatus.totalImagesProcessed} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="totalImagesScanned" secondary={ScanJobStatus.totalImagesScanned} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="totalImagesTransmitted" secondary={ScanJobStatus.totalImagesTransmitted} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="transmissionConsecutiveRetryCount" secondary={ScanJobStatus.transmissionConsecutiveRetryCount} />
                <Divider style={{ marginLeft: "40px" }} />
                
                <PropertyItem primary="transmissionRetryCount" secondary={ScanJobStatus.transmissionRetryCount} />
                <Divider style={{ marginLeft: "40px" }} />

                <ActivityStatus name="transmittingActivity" object={ScanJobStatus.transmittingActivity} />
                
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <TableRow className={classes}>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell align="left">{log.data.jobNotification.scanJobId}</TableCell>
                <TableCell align="left">{log.data.jobNotification.solutionContext}</TableCell>
                <TableCell>
                    {(log.data != null && Object.keys(log.data).length > 0) ?
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        : 'NA'
                    }
                </TableCell>
            </TableRow>
            {/* Only add this table row if there is data to show */}
            {log.data &&
                <TableRow >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <BuildScanJobStatus ScanJobStatus={log.data.jobNotification.scanJobStatus} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}

function ScanJobReceiverLogDetails({ log }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell align="left">{log.type || ''}</TableCell>
                <TableCell align="left">{log.data.scanJobId}</TableCell>
                <TableCell align="left">{log.data.deliveredScanFiles || ''}</TableCell>
                <TableCell align="left">{log.data.includedScanFiles || ''}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function ScanJobReceiverLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Scan Job Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell align="left">Transmitting State</TableCell>
                        <TableCell align="left">Scan Job Id</TableCell>
                        <TableCell align="left">Delivered Scan Files</TableCell>
                        <TableCell align="left">Included Scan Files</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <ScanJobReceiverLogDetails key={log.timestamp} log={log} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function ScanJobAgentLogContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isReceiverLoading, setReceiverLoading] = useState(false);
    const [isNotificationLoading, setNotificationLoading] = useState(false);

    const [scanJobReceiverLog, setScanJobReceiverLog] = useState(null);
    const [showScanJobReceiverResponse, setShowScanJobReceiverResponse] = useState(false);

    const [notificationLog, setNotificationLog] = useState(null);
    const [showNotificationResponse, setShowNotificationResponse] = useState(false);

    useEffect(() => {
        loadScanJobNotificationLogContent();
        loadScanJobReceiverLogContent();
    }, []);

    async function loadScanJobNotificationLogContent() {
        let response;
        console.log("in loadScanJobReceiverLogContent");

        setNotificationLoading(true);
        try {
            response = await logService.getLog("scanNotifications");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setNotificationLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Scan Job Notification logs - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function clearScanJobNotificationLog() {
        console.log("in clearScanJobReceiverLog");

        setNotificationLoading(true);
        try {
            await logService.clearLog("scanNotifications");
            setNotificationLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear ScanJob Notification log data - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function loadScanJobReceiverLogContent() {
        let response;
        console.log("in loadScanJobReceiverLogContent");

        setReceiverLoading(true);
        try {
            response = await logService.getLog("scanJobReceiver");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setScanJobReceiverLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Scan Job Receiver logs - ' + error.cause.message);
        }
        setReceiverLoading(false);
    }

    async function clearScanJobReceiverLog() {
        console.log("in clearScanJobReceiverLog");

        setReceiverLoading(true);
        try {
            await logService.clearLog("scanJobReceiver");
            setScanJobReceiverLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear ScanJob Receiver log data - ' + error.cause.message);
        }
        setReceiverLoading(false);
    }

    async function handleScanJobNotificationDialogOpen() {
        setShowNotificationResponse(true);
    }

    async function handleScanJobNotificationDialogClose() {
        setShowNotificationResponse(false);
    }

    async function handleScanJobReceiverDialogOpen() {
        setShowScanJobReceiverResponse(true);
    }

    async function handleScanJobReceiverDialogClose() {
        setShowScanJobReceiverResponse(false);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} spacing={2}>
                <Card>
                    <CardContent>
                        <Typography>Scan Job Notifications</Typography>
                        {
                            isNotificationLoading ? <Loading message="Loading resource..." /> :
                                (notificationLog && <ScanJobNotificationLogs logs={notificationLog} />)
                        }
                    </CardContent>
                    <CardActions>
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Refresh"
                            primaryToolTip="Refresh ScanJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={loadScanJobNotificationLogContent}
                        />
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Clear"
                            primaryToolTip="Clear ScanJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={clearScanJobNotificationLog}
                        />
                        <SDKButton
                            disabled={!notificationLog}
                            postAlert={props.postAlert}
                            buttonlabel="Show Log"
                            primaryToolTip="Show ScanJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={notificationLog != null}
                            onClick={handleScanJobNotificationDialogOpen}
                        />
                        <ApiResponseDialog title="Scan Job Log" open={showNotificationResponse} apiResponse={notificationLog} handleClose={handleScanJobNotificationDialogClose} />
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} spacing={2}>
                <Card>
                    <CardContent>
                        <Typography>Scan Job Receiver</Typography>
                        {
                            isReceiverLoading ? <Loading message="Loading resource..." /> :
                                (scanJobReceiverLog && <ScanJobReceiverLogs logs={scanJobReceiverLog} />)
                        }
                    </CardContent>
                    <CardActions>
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Refresh"
                            primaryToolTip="Refresh ScanJob Receiver Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={loadScanJobReceiverLogContent}
                        />
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Clear"
                            primaryToolTip="Clear ScanJob Receiver Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={clearScanJobReceiverLog}
                        />
                        <SDKButton
                            disabled={!scanJobReceiverLog}
                            postAlert={props.postAlert}
                            buttonlabel="Show Log"
                            primaryToolTip="Show ScanJob Receiver Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={scanJobReceiverLog != null}
                            onClick={handleScanJobReceiverDialogOpen}
                        />
                        <ApiResponseDialog title="Scan Job Log" open={showScanJobReceiverResponse} apiResponse={scanJobReceiverLog} handleClose={handleScanJobReceiverDialogClose} />
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}
export {
    ScanJobAgentLogContent
};
