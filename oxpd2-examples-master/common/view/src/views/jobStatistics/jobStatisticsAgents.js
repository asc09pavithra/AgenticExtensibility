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
import { JobStatisticsAgentTabs } from './jobStatisticsAgent';
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


function JobStatisticsAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const jobStatisticsService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [jobStatisticsAgents, setJobStatisticsAgents] = useState([]);
    const [jobStatisticsAgentsResponse, setJobStatisticsAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Job Statistics Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadJobStatisticsAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadJobStatisticsAgents();
    }

    async function loadJobStatisticsAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await jobStatisticsService.enumerateJobStatisticsAgents();
            console.log("loadJobStatisticsAgents - " + JSON.stringify(response));
            setJobStatisticsAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setJobStatisticsAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate JobStatisticsAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedJobStatisticsAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="job-statistics-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">Job Statistics Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Job Statistics Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {jobStatisticsAgents.map((jobStatisticsAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={jobStatisticsAgent} hover onClick={(event) => handleRowClicked(event, jobStatisticsAgent)} selected={jobStatisticsAgent === props.selectedJobStatisticsAgent}>
                                            <TableCell component="th" scope="jobStatisticsAgent">
                                                {jobStatisticsAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Job Statistics Agents API Response" open={state.showApiResponse} apiResponse={jobStatisticsAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function JobStatisticsAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const jobStatisticsService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const [selectedJobStatisticsAgent, setSelectedJobStatisticsAgent] = useState('');

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
                    <JobStatisticsAgents service={jobStatisticsService} loadEnabled={state.loadEnabled} postAlert={postAlert} selectedJobStatisticsAgent={selectedJobStatisticsAgent} setSelectedJobStatisticsAgent={setSelectedJobStatisticsAgent} />
                </Grid>
                <Grid item xs={12}>
                    <JobStatisticsAgentTabs service={jobStatisticsService} loadEnabled={state.loadEnabled} postAlert={postAlert} agentId={selectedJobStatisticsAgent} />
                </Grid>
            </Grid>
        </div>
    );
}

export {
    JobStatisticsAgentsTabContent
};
