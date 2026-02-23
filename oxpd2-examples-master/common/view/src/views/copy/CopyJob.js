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

export default function CopyJob(props) {
    const deviceContext = useContext(DeviceContext);
    const copyJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentCopyJob, setCurrentCopyJob] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadCopyJob(props.agentID, props.copyJobID);
    }, [props.copyJobID]);

    useEffect(() => {
        resetCopyJob();
    }, [props.agentID]);

    async function resetCopyJob() {
        setCurrentCopyJob(null);
    }

    async function handleLoadClicked() {
        loadCopyJob(props.agentID, props.copyJobID);
    }

    async function loadCopyJob(agentID, copyJobID) {
        let response;

        if (!copyJobID || copyJobID.length === 0) {
            setCurrentCopyJob(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.getCopyJob(agentID, copyJobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentCopyJob(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve copy job - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function cancelCopyJob(agentID, copyJobID) {
        let response;

        if (!copyJobID || copyJobID.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.cancelCopyJob(agentID, copyJobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Cancel request successful');
                loadCopyJob(agentID, copyJobID)
                setState({ ...state, showButtons: false });
            }
        } catch (error) {
            props.postAlert('error', 'Unable to cancel copy job - ' + error.cause.message);
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
        loadCopyJob(props.agentID, props.copyJobID);
    }

    async function handleCollapseAll() {
        setAllExpanded(false);
        loadCopyJob(props.agentID, props.copyJobID);
    }

    async function handleCancelCopyJob() {
        cancelCopyJob(props.agentID, props.copyJobID);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Copy Job</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentCopyJob && <CopyJobCardContent copyJob={currentCopyJob} allExpanded={allExpanded}/>)
                }
                <ApiResponseDialog title="Copy Job API Response" open={state.showApiResponse} apiResponse={currentCopyJob} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
            <SDKButton
                    disabled={!currentCopyJob}
                    buttonlabel="Expand All"
                    primaryToolTip="Expand All Dropdowns"
                    secondaryToolTip="CopyJob Not Loaded"
                    secondaryToolTipCondition={currentCopyJob !== null}
                    onClick={handleExpandAll}
                />
                <SDKButton
                    disabled={!currentCopyJob}
                    buttonlabel="Collapse All"
                    primaryToolTip="Collapse All Dropdowns"
                    secondaryToolTip="CopyJob Not Loaded"
                    secondaryToolTipCondition={currentCopyJob !== null}
                    onClick={handleCollapseAll}
                />
                <SDKButton 
                    style={currentCopyJob ? { borderColor: '#F50057', color: '#F50057' } : {}}
                    disabled={!currentCopyJob}
                    buttonlabel="Cancel Job"
                    primaryToolTip="Cancel Selected Copy Job"
                    secondaryToolTip="CopyJob Not Loaded"
                    secondaryToolTipCondition={currentCopyJob !== null}
                    onClick={handleCancelCopyJob}
                />
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={currentCopyJob === null} location="CopyJob" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function CopyJobCardContent({ copyJob, allExpanded }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="copyJobId" secondary={copyJob.copyJobId || ""} expanded={allExpanded}/>           
                <NestedObject resource={copyJob.copyJobStatus} name="copyJobStatus" expanded={allExpanded}/>
                <NestedObject resource={copyJob.ticket} name="ticket" expanded={allExpanded}/>
                <NestedObject resource={copyJob.solutionContext} name="solutionContext" expanded={allExpanded}/>
            </List>
        </List>
    );
}
