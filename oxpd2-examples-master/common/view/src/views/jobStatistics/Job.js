import { Card, CardActions, CardContent } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { NestedObject } from '../../common/NestedObject';
import { PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import { useStyles } from '../../common/commonStyles';

export default function Job(props) {
    const deviceContext = useContext(DeviceContext);
    const jobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadJob(props.agentID, props.jobID);
    }, [props.jobID]);

    useEffect(() => {
        resetJob();
    }, [props.agentID]);

    async function resetJob() {
        setCurrentJob(null);
    }

    async function handleLoadClicked() {
        loadJob(props.agentID, props.jobID);
    }

    async function loadJob(agentID, jobID) {
        let response;

        if (!jobID || jobID.length === 0) {
            setCurrentJob(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await jobService.getJob(agentID, jobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentJob(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve job - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function cancelJob(agentID, jobID) {
        let response;

        if (!jobID || jobID.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await jobService.cancelJob(agentID, jobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Cancel request successful');
                loadJob(agentID, jobID)
                setState({ ...state, showButtons: false });
            }
        } catch (error) {
            props.postAlert('error', 'Unable to cancel job - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleExpandAll() {
        setAllExpanded(true);
        loadJob(props.agentID, props.jobID);
    }

    async function handleCollapseAll() {
        setAllExpanded(false);
        loadJob(props.agentID, props.jobID);
    }

    async function handleCancelJob() {
        cancelJob(props.agentID, props.jobID);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Job</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentJob && <JobCardContent job={currentJob} allExpanded={allExpanded}/>)
                }
                <ApiResponseDialog title="Job API Response" open={state.showApiResponse} apiResponse={currentJob} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <SDKButton
                    disabled={!currentJob}
                    buttonlabel="Expand All"
                    primaryToolTip="Expand All Dropdowns"
                    secondaryToolTip="Job Not Loaded"
                    secondaryToolTipCondition={currentJob !== null}
                    onClick={handleExpandAll}
                />
                <SDKButton
                    disabled={!currentJob}
                    buttonlabel="Collapse All"
                    primaryToolTip="Collapse All Dropdowns"
                    secondaryToolTip="Job Not Loaded"
                    secondaryToolTipCondition={currentJob !== null}
                    onClick={handleCollapseAll}
                />
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={currentJob === null} location="Job" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function JobCardContent({ job, allExpanded }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="sequenceNumber" secondary={job.sequenceNumber || ""} expanded={allExpanded}/> 
                <PropertyItem primary="jobId" secondary={job.jobId || ""} expanded={allExpanded}/>           
                { job.aFaxInInfo ? <NestedObject resource={job.aFaxInInfo} name="aFaxInInfo" expanded={allExpanded}/> : <></>}
                { job.aFaxOutInfo ? <NestedObject resource={job.aFaxOutInfo} name="aFaxOutInfo" expanded={allExpanded}/> : <></>}
                { job.driverInfo ? <NestedObject resource={job.driverInfo} name="driverInfo" expanded={allExpanded}/> : <></>}
                { job.emailInfo ? <NestedObject resource={job.emailInfo} name="emailInfo" expanded={allExpanded}/> : <></>}
                { job.folderInfo ? <NestedObject resource={job.folderInfo} name="folderInfo" expanded={allExpanded}/> : <></>}
                { job.ftpInfo ? <NestedObject resource={job.ftpInfo} name="ftpInfo" expanded={allExpanded}/> : <></>}
                { job.httpInfo ? <NestedObject resource={job.httpInfo} name="httpInfo" expanded={allExpanded}/> : <></>}
                { job.ipFaxInInfo ? <NestedObject resource={job.ipFaxInInfo} name="ipFaxInInfo" expanded={allExpanded}/> : <></>}
                { job.ipFaxOutInfo ? <NestedObject resource={job.ipFaxOutInfo} name="ipFaxOutInfo" expanded={allExpanded}/> : <></>}
                { job.jobInfo ? <NestedObject resource={job.jobInfo} name="jobInfo" expanded={allExpanded}/> : <></>}
                { job.printInfo ? <NestedObject resource={job.printInfo} name="printInfo" expanded={allExpanded}/> : <></>}
                { job.scanInfo ? <NestedObject resource={job.scanInfo} name="scanInfo" expanded={allExpanded}/> : <></>}
                { job.userInfo ? <NestedObject resource={job.userInfo} name="userInfo" expanded={allExpanded}/> : <></>}
            </List>
        </List>
    );
}
