import { Card, CardActions, CardContent, Divider, Grid, List, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
import Job from './Job';
import ModifyJobsDialog from './ModifyJobsDialog';
import { PropertyItem } from '../../common/ResponseTypes';

function Jobs(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState({});
    const [apiResponse, setApiResponse] = useState(null)
    const jobService = props.service;
    const agentId = props.agentId;
    const [state, setState] = useState({
        showApiResponse: false,
        showModifyJob: false,
        showButtons: false
    });

    useEffect(() => {
        loadJobs();
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadJobs();
    }

    async function loadJobs() {
        let response;

        if (!agentId || agentId.length === 0) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            response = await jobService.enumerateJobs(agentId)
            console.log(JSON.stringify(response));

            if (null !== response && 'memberIds' in response) {
                setJobs(response);
                setApiResponse(response);
                setState({ ...state, showButtons: true });
            }
            else {
                setJobs({});
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Jobs - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, sequenceNumber) {
        console.log("handleRowClicked: " + sequenceNumber);
        props.setSelectedJob(sequenceNumber);
    }

    async function handleApiDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleModifyJobDialogClose() {
        setState({ ...state, showModifyJob: false });
    }

    async function handleStartModifyClose() {
        await loadJobs();
        setState({ ...state, showModifyJob: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleShowModifyJob() {
        setState({ ...state, showModifyJob: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Jobs</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                    Object.keys(jobs).length === 0 ? <></> :
                    <>
                        <List component="div" disablePadding style={{ marginLeft: "-30px" }}>
                            <PropertyItem primary="availableJobEntries" style={{marginLeft: "-40px"}} secondary={(jobs.availableJobEntries !== undefined && jobs.availableJobEntries !== null && jobs.availableJobEntries.toString()) || ""} />
                            <Divider style={{ marginLeft: "40px" }}/>
                            <PropertyItem primary="highestSequenceNumberCompleted" secondary={(jobs.highestSequenceNumberCompleted !== undefined && jobs.highestSequenceNumberCompleted !== null && jobs.highestSequenceNumberCompleted.toString()) || ""} />
                            <Divider style={{ marginLeft: "40px" }}/>
                            <PropertyItem primary="jobSubmissionLocked" secondary={(jobs.jobSubmissionLocked !== undefined && jobs.jobSubmissionLocked !== null && jobs.jobSubmissionLocked.toString()) || ""} />
                            <Divider style={{ marginLeft: "40px" }}/>
                            <PropertyItem primary="lastSequenceNumberNotified" secondary={(jobs.lastSequenceNumberNotified !== undefined && jobs.lastSequenceNumberNotified !== null && jobs.lastSequenceNumberNotified.toString()) || ""} />
                            <Divider style={{ marginLeft: "40px" }}/>
                            <PropertyItem primary="lastSequenceNumberProcessed" secondary={(jobs.lastSequenceNumberProcessed !== undefined && jobs.lastSequenceNumberProcessed !== null && jobs.lastSequenceNumberProcessed.toString()) || ""} />
                            <Divider style={{ marginLeft: "40px" }}/>
                            <PropertyItem primary="totalJobEntries" secondary={(jobs.totalJobEntries !== undefined && jobs.totalJobEntries !== null && jobs.totalJobEntries.toString()) || ""} />
                        </List>
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Jobs Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sequence Number</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {jobs.memberIds ? jobs.memberIds.map((job) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={job} hover selected={job === props.selectJob}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, job)} >
                                                {job}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    :<></>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                }
                <ApiResponseDialog title="Jobs API Response" open={state.showApiResponse} apiResponse={apiResponse} handleClose={handleApiDialogClose} />
                <ModifyJobsDialog open={state.showModifyJob} onClose={handleModifyJobDialogClose} onStartModifyClose={handleStartModifyClose} state={state} setState={setState} jobs={jobs} service={props.service} agentId={agentId} postAlert={props.postAlert}/>
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={jobs === null} location="Job Statistics Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons}
                    buttonlabel="Modify Jobs"
                    primaryToolTip="Job not selected"
                    secondaryToolTip="Modify Jobs"
                    secondaryToolTipCondition={!state.showButtons}
                    onClick={handleShowModifyJob}
                />
            </CardActions>
        </Card>
    );
}

function JobsTabContent(props) {
    const agentId = props.agentId;
    const [selectJob, setSelectedJob] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Jobs agentId={agentId} service={props.service} loadEnabled={true} postAlert={props.postAlert} selectJob={selectJob} setSelectedJob={setSelectedJob} />
            </Grid>
            <Grid item xs={12}>
                <Job service={props.service} loadEnabled={true} postAlert={props.postAlert} agentID={agentId} jobID={selectJob} />
            </Grid>
        </Grid>
    )
}

export {
    JobsTabContent
};
