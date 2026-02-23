import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import LogService from '../../services/LogService';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const customStyles = makeStyles((theme) => ({
    fitText: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
    }
}), { defaultTheme: theme });

function LogDetails(props) {
    const { log } = props;
    const [open, setOpen] = React.useState(false);
    const [accessTokenOpen, setAccessTokenOpen] = useState(false);
    const classes = useStyles();
    const succeeded = "succeeded";
    const failed = "failed";
    let result = getAuthResult(log.data != null ? log.data.authResult : {});

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

    function ShowResultRow({ authResult }) {
        if (authResult) {
            if (result === succeeded && authResult.succeeded) {
                return (
                    <List component="div" disablePadding>
                        <PropertyHeader name="details" />
                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                            <BuildProperties jsonObject={authResult.succeeded.details} />
                        </List>
                    </List>
                );
            }
            else if (result === failed && authResult.failed) {
                return (
                    <PropertyItem primary="message" secondary={authResult.failed.message || ""} />
                );
            }
        }
        return null;
    }

    function getAuthResult(authResult) {
        let result = "";
        if (authResult) {
            if (authResult.result) {
                if (authResult.result.succeeded) {
                    result = succeeded;
                }
                else if (authResult.result.failed) {
                    result = failed;
                }
                else if (authResult.result.continue) {
                    result = "continue";
                }
                else if (authResult.result.canceled) {
                    result = "canceled";
                }
            }
        }
        return result;
    }

    function handleAccessTokenDialogOpen() {
        setAccessTokenOpen(true);
    }

    function handleAccessTokenDialogClose() {
        setAccessTokenOpen(false);
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell align="left">{log.type || ''}</TableCell>
                <TableCell align="left">{(log.data && log.data.authApiRequest) ? log.data.authApiRequest.sessionId : ''}</TableCell>
                <TableCell align="left">
                    {(log.data && log.data.authApiRequest && log.data.authApiRequest.sessionAccessToken) && 
                        <>
                            {<SDKButton 
                                size = "small"
                                variant="contained"
                                color = "primary"
                                disabled={false}
                                buttonlabel="Show Token"
                                primaryToolTip="Show The Session Access Token"
                                secondaryToolTip="Close Unavailable"
                                secondaryToolTipCondition={true}
                                onClick={handleAccessTokenDialogOpen}
                            />}
                            <AuthenticationAgentAccessTokenDialog open={accessTokenOpen} handleClose={handleAccessTokenDialogClose} sessionAccessToken={log.data.authApiRequest.sessionAccessToken} />
                        </>
                    }  
                </TableCell>
                <TableCell align="left">{(log.data && log.data.authApiRequest) ? log.data.authApiRequest.languageCode : ''}</TableCell>
                <TableCell align="left">{result || 'NA'}</TableCell>
                <TableCell>
                    {(result === "failed" || result === "succeeded") ?
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        : 'NA'
                    }
                </TableCell>
            </TableRow>
            {/* Only add this table row if there is data to show */}
            {(result === failed || result === succeeded) &&
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ShowResultRow authResult={log.data.authResult.result} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}

function AuthenticationAgentLogs(props) {
    const logs = props.logs || [];
    if(Object.keys(logs).length > 0) {
        return (
            <TableContainer style={{ maxHeight: 600 }} component={Paper}>
                <Table size='small' stickyHeader aria-label="Solution Notifications Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date/TimeStamp</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Session Id</TableCell>
                            <TableCell align="left">Session Access Token</TableCell>
                            <TableCell align="left">Language Code</TableCell>
                            <TableCell align="left">Result</TableCell>
                            <TableCell align="left">Result Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <LogDetails key={log.timestamp} log={log} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return null;
    }
    
}

function AuthenticationAgentAccessTokenDialog(props) {
    const classes = useStyles();
    const boxStyles = customStyles();

    return (
        <Dialog fullWidth={true} maxWidth="lg" open={props.open} onClose={props.handleClose}>
            <DialogTitle>Session Access Token</DialogTitle>
            <DialogContent dividers style={{ height: '450px' }}>
                <Box className={classes.json} m={1}><pre className={boxStyles.fitText}>{props.sessionAccessToken}</pre></Box>
            </DialogContent>
            <DialogActions>
                <CopyToClipboard text={props.sessionAccessToken}>
                    <SDKButton 
                        disabled={false}
                        buttonlabel="Copy to Clipboard"
                        primaryToolTip="Copy the access token"
                        secondaryToolTip="Copy Unavailable"
                        secondaryToolTipCondition={true}
                    />
                </CopyToClipboard>
                <SDKButton 
                    disabled={false}
                    buttonlabel="Close"
                    primaryToolTip="Close Access Token Dialog"
                    secondaryToolTip="Close Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={props.handleClose}
                />
            </DialogActions>
        </Dialog>
    );
}

function AgentServiceLogTabContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState(null);
    const [showApiResponse, setShowApiResponse] = useState(false);

    useEffect(() => {
        loadAuthenticationAgentLogContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadAuthenticationAgentLogContent() {
        let response;
        console.log("in loadAuthenticationAgentLogContent");

        setIsLoading(true);
        try {
            response = await logService.getLog("authenticationAgent");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentResponse(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve AuthenticationAgent service logs - ' + error.cause.message);
        }

        setIsLoading(false);
    }

    async function clearAuthenticationAgentData() {
        console.log("in clearAuthenticationAgentData");

        setIsLoading(true);
        try {
            await logService.clearLog("authenticationAgent");
            setCurrentResponse(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear AuthenticationAgent log data - ' + error.cause.message);
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
                <Typography>Authentication Agent Log</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        ( currentResponse && <AuthenticationAgentLogs logs={currentResponse}/> )
                }
            </CardContent>
            <CardActions>
                <SDKButton
                    disabled={false}
                    postAlert={props.postAlert}
                    buttonlabel="Refresh"
                    primaryToolTip="Refresh Agent Service Log"
                    secondaryToolTip="Refresh Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={loadAuthenticationAgentLogContent}
                />
                <SDKButton
                    disabled={false}
                    postAlert={props.postAlert}
                    buttonlabel="Clear"
                    primaryToolTip="Clear Agent Service Log"
                    secondaryToolTip="Clear Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={clearAuthenticationAgentData}
                />
                <SDKButton
                    data-testid="authentication-agent-logs-api-response"
                    disabled={!currentResponse}
                    postAlert={props.postAlert}
                    buttonlabel="Show Log"
                    primaryToolTip="Show Agent Service Log"
                    secondaryToolTip="Agent Service Log Not Loaded"
                    secondaryToolTipCondition={currentResponse != null}
                    onClick={handleDialogOpen}
                />
                <ApiResponseDialog title="Authentication Agent Log" open={showApiResponse} apiResponse={currentResponse} handleClose={handleDialogClose} />
            </CardActions>
        </Card>
        </div>
    )
}
export {
    AgentServiceLogTabContent
};

