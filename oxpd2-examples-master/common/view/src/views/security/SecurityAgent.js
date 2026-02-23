import { Card, CardActions, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { BuildLocalizedStringList, PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import ResolveSecurityExpressionDialog from './ResolveSecurityExpressionDialog';

function SecurityAgentDetails({ securityAgent }) {
    if (securityAgent) {
        return (
            <List data-testid="security-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    {securityAgent.corsEnabled !== undefined && securityAgent.corsEnabled !== null &&
                        <>
                            <PropertyItem primary="corsEnabled" secondary={securityAgent.corsEnabled+""} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </>
                    }

                    {securityAgent.declaredExpressionOperators && securityAgent.declaredExpressionOperators.length > 0 &&
                        <React.Fragment>
                            <PropertyHeader name={"declaredExpressionOperators"}></PropertyHeader>
                            <List style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }} component="div" disablePadding >
                                {securityAgent.declaredExpressionOperators.map(item => (
                                    <>
                                        <PropertyItem secondary={item || ""} />
                                        <Divider style={{ marginLeft: "40px" }} />
                                    </>
                                ))}
                            </List>
                        </React.Fragment>
                    }

                    <PropertyItem primary="agentId" secondary={securityAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={securityAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={securityAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={securityAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={securityAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function SecurityAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const securityService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSecurityAgent, setCurrentSecurityAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false,
        showResolveSecurityExpressionDialog: false
    });

    useEffect(() => {
        loadSecurityAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSecurityAgent(props.agentId);
    }

    async function loadSecurityAgent(agentId) {
        let response;

        console.log("loadSecurityAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await securityService.getSecurityAgent(agentId);
            console.log("getSecurityAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSecurityAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SecurityAgent ' + agentId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleResolveSecurityExpressionDialogClose() {
        setState({ ...state, showResolveSecurityExpressionDialog: false });
    }

    async function handleResolveSecurityExpressionDialogOpen() {
        setState({ ...state, showResolveSecurityExpressionDialog: true });
    }

    return (
        <Card data-testid="security-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Security Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentSecurityAgent && <SecurityAgentDetails securityAgent={currentSecurityAgent} />)
                }
                <ApiResponseDialog title="Security Agent API Response" open={state.showApiResponse} apiResponse={currentSecurityAgent} handleClose={handleDialogClose} />
                <ResolveSecurityExpressionDialog open={state.showResolveSecurityExpressionDialog} onClose={handleResolveSecurityExpressionDialogClose} service={securityService} agentId={props.agentId} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="security-agent-loadrefresh" onClick={handleLoadClicked} isLoading={isLoading || !currentSecurityAgent} location="Security Agent" />
                <ApiResponseButton data-testid="security-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons || currentSecurityAgent === null}
                    buttonlabel="Resolve Security Expression"
                    primaryToolTip="Open The Resolve Security Expression Dialog"
                    secondaryToolTip="Must Have A Selected Security Agent"
                    secondaryToolTipCondition={!(!state.showButtons || currentSecurityAgent === null)}
                    onClick={handleResolveSecurityExpressionDialogOpen}
                />
            </CardActions>
        </Card>
    );
}


export {
    SecurityAgent,
    SecurityAgentDetails
};

