import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import SDKButton from '../../common/SDKButton';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { DeviceContext } from '../../common/DeviceContext';
import ScanJob from './ScanJob';
import CreateScanJobDialog from './CreateScanJobDialog'


function ScanJobs(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [scanJobs, setScanJobs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null)
    const scanJobService = props.service;
    const agentId = props.agentId;
    const [state, setState] = useState({
        showApiResponse: false,
        showCreateScanJob: false,
        showButtons: false
    });

    useEffect(() => {
        loadScanJobs();
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadScanJobs();
    }

    async function loadScanJobs() {
        let response;

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await scanJobService.enumerateScanJobs(agentId)
            console.log(JSON.stringify(response));

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setScanJobs(response.memberIds);
                setApiResponse(response);
                setState({ ...state, showButtons: true });
            }
            else {
                setScanJobs([]);
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Scan Jobs - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, scanJobId) {
        console.log("handleRowClicked: " + scanJobId);
        props.setSelectedScanJob(scanJobId);
    }

    async function handleApiDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleCreateScanJobDialogClose() {
        setState({ ...state, showCreateScanJob: false });
    }

    async function handleStartScanClose() {
        await loadScanJobs();
        setState({ ...state, showCreateScanJob: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleShowCreateScanJob() {
        setState({ ...state, showCreateScanJob: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Scan Jobs</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="ScanJobs Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Scan Job ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {scanJobs.map((scanJob) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={scanJob} hover selected={scanJob === props.selectScanJob}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, scanJob)} >
                                                {scanJob}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <CreateScanJobDialog open={state.showCreateScanJob} onClose={handleCreateScanJobDialogClose} onStartScanClose={handleStartScanClose} state={state} setState={setState} setSelectedScanJob={props.setSelectedScanJob} service={props.service} agentId={agentId} postAlert={props.postAlert}/>
                <ApiResponseDialog title="Scan Jobs API Response" open={state.showApiResponse} apiResponse={apiResponse} handleClose={handleApiDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={scanJobs === null} location="Scan Jobs Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons}
                    buttonlabel="Create Scan Job"
                    primaryToolTip="ScanJob Agent not selected"
                    secondaryToolTip="Create a new ScanJob"
                    secondaryToolTipCondition={!state.showButtons}
                    onClick={handleShowCreateScanJob}
                />
            </CardActions>
        </Card>
    );
}

function ScanJobsTabContent(props) {
    const agentId = props.agentId;
    const [selectScanJob, setSelectedScanJob] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ScanJobs agentId={agentId} service={props.service} loadEnabled={true} postAlert={props.postAlert} selectScanJob={selectScanJob} setSelectedScanJob={setSelectedScanJob} />
            </Grid>
            <Grid item xs={12}>
                <ScanJob service={props.service} loadEnabled={true} postAlert={props.postAlert} agentID={agentId} scanJobID={selectScanJob} />
            </Grid>
        </Grid>
    )
}

export {
    ScanJobsTabContent
};
