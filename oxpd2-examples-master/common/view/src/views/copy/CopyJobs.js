import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import SDKButton from '../../common/SDKButton';
import { useStyles } from '../../common/commonStyles';
import CopyJob from './CopyJob';
import CreateCopyJobDialog from './CreateCopyJobDialog';


function CopyJobs(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [copyJobs, setCopyJobs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null)
    const copyJobService = props.service;
    const agentId = props.agentId;
    const [state, setState] = useState({
        showApiResponse: false,
        showCreateCopyJob: false,
        showButtons: false
    });

    useEffect(() => {
        loadCopyJobs();
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadCopyJobs();
    }

    async function loadCopyJobs() {
        let response;

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.enumerateCopyJobs(agentId)
            console.log(JSON.stringify(response));

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setCopyJobs(response.memberIds);
                setApiResponse(response);
                setState({ ...state, showButtons: true });
            }
            else {
                setCopyJobs([]);
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Copy Jobs - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, copyJobId) {
        console.log("handleRowClicked: " + copyJobId);
        props.setSelectedCopyJob(copyJobId);
    }

    async function handleApiDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleCreateCopyJobDialogClose() {
        setState({ ...state, showCreateCopyJob: false });
    }

    async function handleStartCopyClose() {
        await loadCopyJobs();
        setState({ ...state, showCreateCopyJob: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleShowCreateCopyJob() {
        setState({ ...state, showCreateCopyJob: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Copy Jobs</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="CopyJobs Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Copy Job ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {copyJobs.map((copyJob) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={copyJob} hover selected={copyJob === props.selectCopyJob}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, copyJob)} >
                                                {copyJob}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <CreateCopyJobDialog open={state.showCreateCopyJob} onClose={handleCreateCopyJobDialogClose} onStartCopyClose={handleStartCopyClose} state={state} setState={setState} setSelectedCopyJob={props.setSelectedCopyJob} service={props.service} agentId={agentId} postAlert={props.postAlert}/>
                <ApiResponseDialog title="Copy Jobs API Response" open={state.showApiResponse} apiResponse={apiResponse} handleClose={handleApiDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={copyJobs === null} location="Copy Jobs Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons}
                    buttonlabel="Create Copy Job"
                    primaryToolTip="Copy Agent not selected"
                    secondaryToolTip="Create a new Copy"
                    secondaryToolTipCondition={!state.showButtons}
                    onClick={handleShowCreateCopyJob}
                />
            </CardActions>
        </Card>
    );
}

function CopyJobsTabContent(props) {
    const agentId = props.agentId;
    const [selectCopyJob, setSelectedCopyJob] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CopyJobs agentId={agentId} service={props.service} loadEnabled={true} postAlert={props.postAlert} selectCopyJob={selectCopyJob} setSelectedCopyJob={setSelectedCopyJob} />
            </Grid>
            <Grid item xs={12}>
                <CopyJob service={props.service} loadEnabled={true} postAlert={props.postAlert} agentID={agentId} copyJobID={selectCopyJob} />
            </Grid>
        </Grid>
    )
}

export {
    CopyJobsTabContent
};
