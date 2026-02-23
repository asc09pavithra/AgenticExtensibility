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
import { CopyAgentTabs } from './CopyAgent';
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


function CopyAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const copyJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [copyAgents, setCopyAgents] = useState([]);
    const [copyAgentsResponse, setCopyAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Copy Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadCopyAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadCopyAgents();
    }

    async function loadCopyAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await copyJobService.enumerateCopyAgents();
            console.log("loadCopyAgents - " + JSON.stringify(response));
            setCopyAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setCopyAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate CopyAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedCopyAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="copy-job-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">Copy Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Copy Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {copyAgents.map((copyAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={copyAgent} hover onClick={(event) => handleRowClicked(event, copyAgent)} selected={copyAgent === props.selectedCopyAgent}>
                                            <TableCell component="th" scope="copyAgent">
                                                {copyAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Copy Agents API Response" open={state.showApiResponse} apiResponse={copyAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function CopyAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const copyJobService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const [selectedCopyAgent, setSelectedCopyAgent] = useState('');

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
                    <CopyAgents service={copyJobService} loadEnabled={state.loadEnabled} postAlert={postAlert} selectedCopyAgent={selectedCopyAgent} setSelectedCopyAgent={setSelectedCopyAgent} />
                </Grid>
                <Grid item xs={12}>
                    <CopyAgentTabs service={copyJobService} loadEnabled={state.loadEnabled} postAlert={postAlert} agentId={selectedCopyAgent} />
                </Grid>
            </Grid>
        </div>
    );
}

export {
    CopyAgentsTabContent
};
