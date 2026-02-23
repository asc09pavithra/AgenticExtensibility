import { Card, CardActions, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import { useStyles } from '../../common/commonStyles';
import RemoveStoredJobDialog from './RemoveStoredJobDialog';
import ReleaseStoredJobDialog from './ReleaseStoredJobDialog';

export default function StoredJob(props) {
    const deviceContext = useContext(DeviceContext);
    const copyJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentStoredJob, setCurrentStoredJob] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false,
        showRemoveDialog: false,
        showReleaseDialog: false
    });

    useEffect(() => {
        loadStoredJob(props.agentID, props.storedJobID);
    }, [props.storedJobID]);

    useEffect(() => {
        resetStoredJob();
    }, [props.agentID]);

    async function resetStoredJob() {
        setCurrentStoredJob(null);
    }

    async function handleLoadClicked() {
        loadStoredJob(props.agentID, props.storedJobID);
    }

    async function loadStoredJob(agentID, storedJobID) {
        let response;

        if (!storedJobID || storedJobID.length === 0) {
            setCurrentStoredJob(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.getStoredJob(agentID, storedJobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentStoredJob(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve stored job - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleShowRemoveDialog() {
        setState({ ...state, showRemoveDialog: true });
    }

    async function handleRemoveDialogClose() {
        setState({ ...state, showRemoveDialog: false });
    }

    async function handleRemoveSuccess() {
        await loadStoredJob(props.agentID, props.storedJobID);
        setState({ ...state, showRemoveDialog: false });
    }

    async function handleShowReleaseDialog() {
        setState({ ...state, showReleaseDialog: true });
    }

    async function handleReleaseDialogClose() {
        setState({ ...state, showReleaseDialog: false });
    }

    async function handleReleaseSuccess(response) {
        props.postAlert('success', 'Stored Job released successfully. Copy Job ID: ' + response.copyJob.copyJobId);
        setState({ ...state, showReleaseDialog: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Stored Job</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentStoredJob && <StoredJobCardContent storedJob={currentStoredJob} />)
                }
                <ApiResponseDialog title="Stored Job API Response" open={state.showApiResponse} apiResponse={currentStoredJob} handleClose={handleDialogClose} />
                <RemoveStoredJobDialog 
                    open={state.showRemoveDialog} 
                    onClose={handleRemoveDialogClose} 
                    onRemoveSuccess={handleRemoveSuccess}
                    service={copyJobService}
                    agentId={props.agentID}
                    storedJobId={props.storedJobID}
                    postAlert={props.postAlert}
                />
                <ReleaseStoredJobDialog 
                    open={state.showReleaseDialog} 
                    onClose={handleReleaseDialogClose} 
                    onReleaseSuccess={handleReleaseSuccess}
                    service={copyJobService}
                    agentId={props.agentID}
                    storedJobId={props.storedJobID}
                    postAlert={props.postAlert}
                />
            </CardContent>
            <CardActions>
                <SDKButton
                    disabled={!currentStoredJob}
                    buttonlabel="Release"
                    primaryToolTip="Release Selected Stored Job as a Copy Job"
                    secondaryToolTip="Stored Job Not Loaded"
                    secondaryToolTipCondition={currentStoredJob !== null}
                    onClick={handleShowReleaseDialog}
                />
                <SDKButton 
                    color="secondary"
                    disabled={!currentStoredJob}
                    buttonlabel="Remove"
                    primaryToolTip="Remove Selected Stored Job"
                    secondaryToolTip="Stored Job Not Loaded"
                    secondaryToolTipCondition={currentStoredJob !== null}
                    onClick={handleShowRemoveDialog}
                />
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={currentStoredJob === null} location="Stored Job" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function StoredJobCardContent({ storedJob }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="folderName" secondary={storedJob.folderName || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="jobId" secondary={storedJob.jobId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="jobName" secondary={storedJob.jobName || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="jobPasswordType" secondary={storedJob.jobPasswordType || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="jobTimestamp" secondary={storedJob.jobTimestamp || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="jobUserName" secondary={storedJob.jobUserName || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="totalPages" secondary={storedJob.totalPages?.toString() || ""} />
            </List>
        </List>
    );
}
