import { Card, CardActions, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import List from '@mui/material/List';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyItem } from '../../common/ResponseTypes';
import { NestedObject } from '../../common/NestedObject';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { DeviceContext } from '../../common/DeviceContext';
import SDKButton from '../../common/SDKButton';

export default function ScanJob(props) {
    const deviceContext = useContext(DeviceContext);
    const scanJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentScanJob, setCurrentScanJob] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadScanJob(props.agentID, props.scanJobID);
    }, [props.scanJobID]);

    useEffect(() => {
        resetScanJob();
    }, [props.agentID]);

    async function resetScanJob() {
        setCurrentScanJob(null);
    }

    async function handleLoadClicked() {
        loadScanJob(props.agentID, props.scanJobID);
    }

    async function loadScanJob(agentID, scanJobID) {
        let response;

        if (!scanJobID || scanJobID.length === 0) {
            setCurrentScanJob(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await scanJobService.getScanJob(agentID, scanJobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentScanJob(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve scan job - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function cancelScanJob(agentID, scanJobID) {
        let response;

        if (!scanJobID || scanJobID.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await scanJobService.cancelScanJob(agentID, scanJobID);
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Cancel request successful');
                loadScanJob(agentID, scanJobID)
                setState({ ...state, showButtons: false });
            }
        } catch (error) {
            props.postAlert('error', 'Unable to cancel scan job - ' + error.cause.message);
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
        loadScanJob(props.agentID, props.scanJobID);
    }

    async function handleColapseAll() {
        setAllExpanded(false);
        loadScanJob(props.agentID, props.scanJobID);
    }

    async function handleCancelScanJob() {
        cancelScanJob(props.agentID, props.scanJobID);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Scan Job</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentScanJob && <ScanJobCardContent scanJob={currentScanJob} allExpanded={allExpanded}/>)
                }
                <ApiResponseDialog title="Scan Job API Response" open={state.showApiResponse} apiResponse={currentScanJob} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
            <SDKButton
                    disabled={!currentScanJob}
                    buttonlabel="Expand All"
                    primaryToolTip="Expand All Dropdowns"
                    secondaryToolTip="ScanJob Not Loaded"
                    secondaryToolTipCondition={currentScanJob !== null}
                    onClick={handleExpandAll}
                />
                <SDKButton
                    disabled={!currentScanJob}
                    buttonlabel="Collapse All"
                    primaryToolTip="Collapse All Dropdowns"
                    secondaryToolTip="ScanJob Not Loaded"
                    secondaryToolTipCondition={currentScanJob !== null}
                    onClick={handleColapseAll}
                />
                <SDKButton 
                    style={currentScanJob ? { borderColor: '#F50057', color: '#F50057' } : {}}
                    disabled={!currentScanJob}
                    buttonlabel="Cancel Job"
                    primaryToolTip="Cancel Selected Scan Job"
                    secondaryToolTip="ScanJob Not Loaded"
                    secondaryToolTipCondition={currentScanJob !== null}
                    onClick={handleCancelScanJob}
                />
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={currentScanJob === null} location="ScanJob" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function ScanJobCardContent({ scanJob, allExpanded }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="scanJobId" secondary={scanJob.scanJobId || ""} expanded={allExpanded}/>           
                <NestedObject resource={scanJob.scanJobStatus} name="scanJobStatus" expanded={allExpanded}/>
                <NestedObject resource={scanJob.scanTicket} name="scanTicket" expanded={allExpanded}/>
                <NestedObject resource={scanJob.solutionContext} name="solutionContext" expanded={allExpanded}/>
            </List>
        </List>
    );
}
