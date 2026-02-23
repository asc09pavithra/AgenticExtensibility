import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import ActivityStatus from '../../common/ActivityStatus';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import { PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import LogService from '../../services/LogService';
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

function CopyJobNotificationLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Copy Job Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell align="left">Copy Job Id</TableCell>
                        <TableCell align="left">Solution Context</TableCell>
                        <TableCell align="left">Copy Job Status</TableCell>
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

    function BuildCopyJobStatus({ CopyJobStatus }) {
        return (
            <React.Fragment>
                <ActivityStatus name="cancelingState" object={CopyJobStatus.cancelingState} />

                <ActivityStatus name="jobActivity" object={CopyJobStatus.jobActivity} />

                <PropertyItem primary="jobDoneStatus" secondary={CopyJobStatus.jobDoneStatus} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="jobDoneStatusDetail" secondary={CopyJobStatus.jobDoneStatusDetail} />
                <Divider style={{ marginLeft: "40px" }} />

                <ActivityStatus name="printingActivity" object={CopyJobStatus.printingActivity} />

                <ActivityStatus name="scanningActivity" object={CopyJobStatus.scanningActivity} />

                <PropertyItem primary="totalImagesScanned" secondary={CopyJobStatus.totalImagesScanned} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="totalSheetsPrinted" secondary={CopyJobStatus.totalSheetsPrinted} />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <>
                <TableRow className={classes}>
                    <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                    <TableCell align="left">{log.data.jobNotification.copyJobId}</TableCell>
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
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <BuildCopyJobStatus CopyJobStatus={log.data.jobNotification.copyJobStatus} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        </React.Fragment>
    );
}

function CopyAgentLogContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isNotificationLoading, setNotificationLoading] = useState(false);

    const [notificationLog, setNotificationLog] = useState(null);
    const [showNotificationResponse, setShowNotificationResponse] = useState(false);

    useEffect(() => {
        loadCopyJobNotificationLogContent();
    }, []);

    async function loadCopyJobNotificationLogContent() {
        let response;
        console.log("in loadCopyJobNotificationLogContent");

        setNotificationLoading(true);
        try {
            response = await logService.getLog("copyNotifications");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setNotificationLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Copy Job Notification logs - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function clearCopyJobNotificationLog() {
        console.log("in clearCopyJobNotificationLog");

        setNotificationLoading(true);
        try {
            await logService.clearLog("copyNotifications");
            setNotificationLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear Copy Job Notification log data - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function handleCopyJobNotificationDialogOpen() {
        setShowNotificationResponse(true);
    }

    async function handleCopyJobNotificationDialogClose() {
        setShowNotificationResponse(false);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} spacing={2}>
                <Card>
                    <CardContent>
                        <Typography>Copy Job Notifications</Typography>
                        {
                            isNotificationLoading ? <Loading message="Loading resource..." /> :
                                (notificationLog && <CopyJobNotificationLogs logs={notificationLog} />)
                        }
                    </CardContent>
                    <CardActions>
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Refresh"
                            primaryToolTip="Refresh CopyJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={loadCopyJobNotificationLogContent}
                        />
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Clear"
                            primaryToolTip="Clear CopyJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={clearCopyJobNotificationLog}
                        />
                        <SDKButton
                            disabled={!notificationLog}
                            postAlert={props.postAlert}
                            buttonlabel="Show Log"
                            primaryToolTip="Show CopyJob Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={notificationLog != null}
                            onClick={handleCopyJobNotificationDialogOpen}
                        />
                        <ApiResponseDialog title="Copy Job Log" open={showNotificationResponse} apiResponse={notificationLog} handleClose={handleCopyJobNotificationDialogClose} />
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}
export {
    CopyAgentLogContent
};
