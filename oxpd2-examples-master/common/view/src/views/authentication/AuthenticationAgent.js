import React, { useState, useEffect, useContext } from 'react';
import AgentDetails from '../../common/AgentDetails';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import AgentLoginDialog from './AgentLoginDialog';

function AuthenticationAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const authenticationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentAuthenticationAgent, setCurrentAuthenticationAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showLoginDialog: false,
        showButtons: false
    });

    useEffect(() => {
        loadAuthenticationAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadAuthenticationAgent(props.agentId);
    }

    async function loadAuthenticationAgent(agentId) {
        let response;
        console.log("loadAuthenticationAgent.agentId: " + agentId);
        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await authenticationService.getAuthenticationAgent(agentId);
            console.log("getAuthenticationAgent response:" + JSON.stringify(response));

            if (null != response) {
                setCurrentAuthenticationAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve AuthenticationAgent ' + agentId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleApiDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleLoginDialogClick() {
        setState({ ...state, showLoginDialog: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Authentication Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentAuthenticationAgent && <AgentDetails agent={currentAuthenticationAgent} />)
                }
                <ApiResponseDialog title="Authentication Agent API Response" open={state.showApiResponse} apiResponse={currentAuthenticationAgent} handleClose={handleApiDialogClose} />
            </CardContent>
            <AgentLoginDialog state={state} setState={setState} postAlert={props.postAlert} setIsLoading={setIsLoading} authenticationService={props.service} agentId={props.agentId} />
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!state.showButtons} location="Authentication Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons}
                    buttonlabel="Login"
                    primaryToolTip="Open Login Request Dialog"
                    secondaryToolTip="Login Unavailable"
                    secondaryToolTipCondition={state.showButtons}
                    onClick={handleLoginDialogClick}
                />
            </CardActions>
        </Card>
    );
}

export {
    AuthenticationAgent
}
