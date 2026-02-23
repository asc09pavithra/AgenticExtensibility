import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Divider from '@mui/material/Divider';
import Loading from '../../common/Loading';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function PrintJobAgentDetails({ printJobAgent }) {
    if (printJobAgent) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={printJobAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={printJobAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={printJobAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={printJobAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={printJobAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function PrintJobAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const printJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentPrintJobAgent, setCurrentPrintJobAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadPrintJobAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadPrintJobAgent(props.agentId);
    }

    async function loadPrintJobAgent(agentId) {
        let response;

        console.log("loadPrintJobAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await printJobService.getPrintJobAgent(agentId);
            console.log("getPrintJobAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentPrintJobAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve PrintJobAgent ' + agentId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Print Job Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentPrintJobAgent && <PrintJobAgentDetails printJobAgent={currentPrintJobAgent} />)
                }
                <ApiResponseDialog title="Print Job Agent API Response" open={state.showApiResponse} apiResponse={currentPrintJobAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading || !currentPrintJobAgent} location="Print Job Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    PrintJobAgent
}
