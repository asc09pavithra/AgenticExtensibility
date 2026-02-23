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
import SDKButton from '../../common/SDKButton';
import { SolutionDiagnosticsAgentTabs } from './SolutionDiagnosticsAgent';
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


function SolutionDiagnosticsAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const solutionDiagnosticsService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [solutionDiagnosticsAgents, setSolutionDiagnosticsAgents] = useState([]);
    const [solutionDiagnosticsAgentsResponse, setSolutionDiagnosticsAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <SDKButton
                size="medium"
                color="primary"
                disabled={isLoading}
                onClick={handleLoadClicked}
                buttonlabel="Load/Refresh"
                primaryToolTip="Refresh Solution Diagnsotics Agents"
                secondaryToolTip="Loading Diagnostics Agents"
                secondaryToolTipCondition={!isLoading}
            />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadSolutionDiagnosticsAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadSolutionDiagnosticsAgents();
    }

    async function loadSolutionDiagnosticsAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents();
            console.log("loadSolutionDiagnosticsAgents - " + JSON.stringify(response));
            setSolutionDiagnosticsAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setSolutionDiagnosticsAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate SolutionDiagnosticsAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedSolutionDiagnosticsAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="solution-diagnostics-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">Solution Diagnostics Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Solution Diagnostics Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {solutionDiagnosticsAgents.map((solutionDiagnosticsAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={solutionDiagnosticsAgent} hover onClick={(event) => handleRowClicked(event, solutionDiagnosticsAgent)} selected={solutionDiagnosticsAgent === props.selectedSolutionDiagnosticsAgent}>
                                            <TableCell component="th" scope="solutionDiagnosticsAgent">
                                                {solutionDiagnosticsAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Solution Diagnostics Agents API Response" open={state.showApiResponse} apiResponse={solutionDiagnosticsAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function SolutionDiagnosticsAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const solutionDiagnosticsService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const [selectedSolutionDiagnosticsAgent, setSelectedSolutionDiagnosticsAgent] = useState('');

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
                    <SolutionDiagnosticsAgents service={solutionDiagnosticsService} loadEnabled={state.loadEnabled} postAlert={postAlert} selectedSolutionDiagnosticsAgent={selectedSolutionDiagnosticsAgent} setSelectedSolutionDiagnosticsAgent={setSelectedSolutionDiagnosticsAgent} />
                </Grid>
                <Grid item xs={12}>
                    <SolutionDiagnosticsAgentTabs service={solutionDiagnosticsService} loadEnabled={state.loadEnabled} postAlert={postAlert} agentId={selectedSolutionDiagnosticsAgent} />
                </Grid>
            </Grid>
        </div>
    );
}

export {
    SolutionDiagnosticsAgentsTabContent
};

