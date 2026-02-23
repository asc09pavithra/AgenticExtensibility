import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { grey, indigo } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import AppAlert from '../../common/AppAlert';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { ScanJobAgentTabs } from './ScanJobAgent';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
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
    },
    row: {
        cursor: "pointer",
    },
    selected: {
        backgroundColor: indigo[50] + '!important',
        color: "#fff !important",
        "&:hover": {
            backgroundColor: "transparent !important",
        },
    },
    hoverx: {
        "&:hover": {
            backgroundColor: grey[50] + "!important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
}), { defaultTheme: theme });


function ScanJobAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const scanJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [scanJobAgents, setScanJobAgents] = useState([]);
    const [scanJobAgentsResponse, setScanJobAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Scan Job Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadScanJobAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadScanJobAgents();
    }

    async function loadScanJobAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await scanJobService.enumerateScanJobAgents();
            console.log("loadScanJobAgents - " + JSON.stringify(response));
            setScanJobAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setScanJobAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate ScanJobAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedScanJobAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="scan-job-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">Scan Job Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Scan Job Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {scanJobAgents.map((scanJobAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={scanJobAgent} hover onClick={(event) => handleRowClicked(event, scanJobAgent)} selected={scanJobAgent === props.selectedScanJobAgent}>
                                            <TableCell component="th" scope="scanJobAgent">
                                                {scanJobAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Scan Job Agents API Response" open={state.showApiResponse} apiResponse={scanJobAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function ScanJobAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const scanJobService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const [selectedScanJobAgent, setSelectedScanJobAgent] = useState('');

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ScanJobAgents service={scanJobService} loadEnabled={state.loadEnabled} postAlert={postAlert} selectedScanJobAgent={selectedScanJobAgent} setSelectedScanJobAgent={setSelectedScanJobAgent} />
                </Grid>
                <Grid item xs={12}>
                    <ScanJobAgentTabs service={scanJobService} loadEnabled={state.loadEnabled} postAlert={postAlert} agentId={selectedScanJobAgent} />
                </Grid>
            </Grid>
        </div>
    );
}

export {
    ScanJobAgentsTabContent
};
