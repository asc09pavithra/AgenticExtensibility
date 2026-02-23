import { Card, CardActions, CardContent, List, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import LogService from '../../services/LogService';

function SolutionAgentNotificationDetails(props) {
    const classes = useStyles();
    const notifications = props.notifications || [];

    if (Object.keys(notifications).length > 0) {
        return(
            <TableContainer style={{ maxHeight: 600 }} component={Paper}>
                <Table className={classes.table} size='small' stickyHeader aria-label="Solution Notifications Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date/TimeStamp</TableCell>
                            <TableCell align="left">Notification Type</TableCell>
                            <TableCell align="left">Payload Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications.map((notification) => (
                            <PayloadRow key={notification.timestamp} row={notification} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return null;
    }
}

function PayloadRow(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    function BuildProperties({ jsonObject }) {
        let returnVal = [];
        if (jsonObject) {
            Object.keys(jsonObject).forEach(val => {
                if (jsonObject[val]) {
                    returnVal.push(
                        <React.Fragment>
                            <PropertyItem primary={val} secondary={jsonObject[val]} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </React.Fragment>);
                }
            });
        }
        return returnVal;
    }

    function BuildArrayData({ header, arrayObject }) {
        if (arrayObject && arrayObject.length > 0) {
            return (
                <React.Fragment>
                    <PropertyHeader name={header}></PropertyHeader>
                    <List style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }} component="div" disablePadding >
                        {arrayObject.map(item => (
                            <div key={item} style={{ fontSize: "18px", paddingLeft: "40px" }}>{item}</div>
                        ))}
                    </List>
                </React.Fragment>
            );
        }
        return null;
    }

    function BuildCertificateList({ certificate }) {
        if (certificate) {
            return (
                <List component="div" disablePadding>
                    <PropertyHeader name="certificate" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <BuildCertificateRow certificate={certificate} />
                    </List>
                </List>
            );
        }
        return null;
    }

    function BuildCertificateRow({ certificate }) {
        if (certificate) {
            let returnVal = [];
            Object.keys(certificate).forEach(val => {
                if (certificate[val]) {
                    if (val === "issuer") {
                        returnVal.push(<BuildArrayData header="issuer" arrayObject={certificate[val]} />)
                    }
                    else if (val === "subject") {
                        returnVal.push(<BuildArrayData header="subject" arrayObject={certificate[val]} />)
                    }
                    else if (val === "usage") {
                        returnVal.push(<BuildArrayData header="usage" arrayObject={certificate[val]} />)
                    }
                    else {
                        returnVal.push(
                            <React.Fragment>
                                <PropertyItem primary={val} secondary={certificate[val]} />
                                <Divider style={{ marginLeft: "40px" }} />
                            </React.Fragment>);
                    }
                }
            });
            return returnVal;
        }
        return null;
    }

    // This method will only be called if the notification contains a notification payload
    // Due to this checks are not needed to see if notification data exists
    function BuildPayloadNotification({ notification }) {
        const ntType = notification.type;
        const ntPayload = notification.data;
        if (ntType === "ntAuthCode" &&
            ntPayload.authCodeNotificationPayload) {
            return (
                <React.Fragment>
                    <PropertyHeader name="code"></PropertyHeader>
                    <Box className={classes.largeScrollingBox} style={{ marginLeft: "40px" }} m={1}><pre className={classes.fit}>{ntPayload.authCodeNotificationPayload.code || ""}</pre></Box>
                </React.Fragment>
            );
        }
        else if (ntType === 'ntShuttingDown') {
            return (
                <BuildProperties jsonObject={ntPayload.shutdownNotificationPayload} />
            );
        }
        else if ((ntType === "ntConfigurationAdded" ||
            ntType === 'ntConfigurationModified' ||
            ntType === 'ntConfigurationDeleted') &&
            ntPayload.configurationsNotificationPayload) {
            return (
                <List component="div" disablePadding>
                    <PropertyHeader name="configuration" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <BuildProperties jsonObject={ntPayload.configurationsNotificationPayload.configuration} />
                    </List>
                </List>
            );
        }
        else if ((ntType === "ntCertificateAuthorityAdded" ||
            ntType === "ntCertificateAuthorityDeleted") &&
            ntPayload.certificateAuthoritiesNotificationPayload) {
            return (
                <BuildCertificateList certificate={ntPayload.certificateAuthoritiesNotificationPayload.certificate} />
            );
        }
        else if ((ntType === "ntCertificateAdded" ||
            ntType === "ntCertificateDeleted") &&
            ntPayload.certificatesNotificationPayload) {
            return (
                <BuildCertificateList certificate={ntPayload.certificatesNotificationPayload.certificate} />
            );
        }
        else if (ntType === "ntInstallerOperation") {
            return (
                <BuildProperties jsonObject={ntPayload.installerOperationNotificationPayload} />
            );
        }

        return (
            <React.Fragment>
                <TableRow guttonbottom={false} className={classes.root}>
                    <TableCell component="th" scope="row">
                        {JSON.stringify(ntPayload, null, 2)}
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <TableRow className={classes}>
                <TableCell component="th" scope="row">{row.timeStamp}</TableCell>
                <TableCell align="left"><Chip className={classes.statusChipTransitional} label={row.type} /></TableCell>
                <TableCell>
                    {(row.data != null && Object.keys(row.data).length > 0) ?
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        : 'NA'
                    }
                </TableCell>
            </TableRow>
            {/* Only add this table row if there is data to show */}
            {row.data &&
                <TableRow >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <BuildPayloadNotification notification={row} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}

function SolutionAgentContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState(null);
    const [showApiResponse, setShowApiResponse] = useState(false);

    useEffect(() => {
        loadSolutionAgentContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadSolutionAgentContent() {
        let response;
        console.log("in loadSolutionAgentContent");

        setIsLoading(true);
        try {
            response = await logService.getLog("solutionNotifications");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentResponse(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SolutionAgentNotification payloads - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function clearSolutionAgentData() {
        console.log("in clearSolutionAgentData");

        setIsLoading(true);
        try {
            await logService.clearLog("solutionNotifications");
            setCurrentResponse(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear SolutionAgentNotification data - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogOpen() {
        setShowApiResponse(true);
    }

    async function handleDialogClose() {
        setShowApiResponse(false);
    }

    return (
        <div>
            <Card>
                <CardContent>
                    <Typography>Solution Notifications</Typography>
                    {
                        isLoading ? <Loading message="Loading resource..." /> :
                            (currentResponse && <SolutionAgentNotificationDetails notifications={currentResponse} />)
                    }
                </CardContent>
                <CardActions>
                    <SDKButton
                        disabled={false}
                        buttonlabel="Refresh"
                        primaryToolTip="Refresh Solution Agent Log"
                        secondaryToolTip="Refresh Unavailable"
                        secondaryToolTipCondition={true}
                        postAlert={props.postAlert}
                        onClick={loadSolutionAgentContent}
                    />
                    <SDKButton
                        disabled={false}
                        buttonlabel="Clear"
                        primaryToolTip="Clear Solution Agent Log"
                        secondaryToolTip="Clear Unavailable"
                        secondaryToolTipCondition={true}
                        postAlert={props.postAlert}
                        onClick={clearSolutionAgentData}
                    />
                    <SDKButton
                        data-testid="solution-agent-logs-api-response"
                        disabled={!currentResponse}
                        buttonlabel="Show Log"
                        primaryToolTip="Show Solution Agent Log API Response"
                        secondaryToolTip="Solution Agent Log Loading"
                        secondaryToolTipCondition={currentResponse !== null}
                        postAlert={props.postAlert}
                        onClick={handleDialogOpen}
                    />
                    <ApiResponseDialog title="Solution Notifications Log" open={showApiResponse} apiResponse={currentResponse} handleClose={handleDialogClose} />
                </CardActions>
            </Card>
        </div>
    )
}

export {
    SolutionAgentContent
}
