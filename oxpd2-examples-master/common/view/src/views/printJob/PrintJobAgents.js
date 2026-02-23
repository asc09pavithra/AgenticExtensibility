import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import { indigo, grey } from '@mui/material/colors';
import Loading from '../../common/Loading';
import Grid from '@mui/material/Grid';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { PrintJobAgent } from './PrintJobAgent';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
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


function PrintJobAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const printJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [printJobAgents, setPrintJobAgents] = useState([]);
    const [printJobAgentsResponse, setPrintJobAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Print Job Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadPrintJobAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadPrintJobAgents();
    }

    async function loadPrintJobAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await printJobService.enumeratePrintJobAgents();
            console.log("loadPrintJobAgents - " + JSON.stringify(response));
            setPrintJobAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setPrintJobAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate PrintJobAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedPrintJobAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Print Job Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Print Job Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {printJobAgents.map((printJobAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={printJobAgent} hover onClick={(event) => handleRowClicked(event, printJobAgent)} selected={printJobAgent === props.selectedPrintJobAgent}>
                                            <TableCell component="th" scope="printJobAgent">
                                                {printJobAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Print Job Agents API Response" open={state.showApiResponse} apiResponse={printJobAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function PrintJobAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const printJobService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedPrintJobAgent, setSelectedPrintJobAgent] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <PrintJobAgents service={printJobService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedPrintJobAgent={selectedPrintJobAgent} setSelectedPrintJobAgent={setSelectedPrintJobAgent} />
            </Grid>
            <Grid item xs={12}>
                <PrintJobAgent service={printJobService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} agentId={selectedPrintJobAgent} />
            </Grid>
        </Grid>
    );
}

export {
    PrintJobAgentsTabContent
}
