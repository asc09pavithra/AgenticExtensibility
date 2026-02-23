import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import Typography from '@mui/material/Typography';
import { PropertyItem } from '../../common/ResponseTypes';
import { useStyles } from '../../common/commonStyles';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';

function AuthenticationAccessPointDetails(props) {
    const classes = useStyles();
    const authenticationAccessPoint = props.authenticationAccessPoint || {};

    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>

                <PropertyItem primary="accessPointId" secondary={authenticationAccessPoint.accessPointId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="kind" secondary={authenticationAccessPoint.kind || ""} />
                {authenticationAccessPoint.kind === 'akCustom' ? <><Divider style={{ marginLeft: "40px" }} /><PropertyItem primary="customName" secondary={authenticationAccessPoint.customName || ""} /></> : null}
            </List>
        </List>
    );
}

function AuthenticationAccessPoint(props) {
    const deviceContext = useContext(DeviceContext);
    const authenticationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentAuthenticationAccessPoint, setCurrentAuthenticationAccessPoint] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadAuthenticationAccessPoint(props.accessPointId);
    }, [props.accessPointId]);

    async function handleLoadClicked() {
        loadAuthenticationAccessPoint(props.accessPointId);
    }

    async function loadAuthenticationAccessPoint(accessPointId) {
        let response;

        console.log("loadAuthenticationAccessPoint.accessPointId: " + accessPointId);

        if (!accessPointId || accessPointId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await authenticationService.getAuthenticationAccessPoint(accessPointId);
            console.log("getAuthenticationAccessPoint response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentAuthenticationAccessPoint(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve AuthenticationAccessPoint ' + accessPointId + '  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleInitiateLoginClicked() {
        try {
            let response = await authenticationService.postInitiateLogin(currentAuthenticationAccessPoint.accessPointId);
            console.log("login response- " + JSON.stringify(response));

            if (null != response) {
                props.postAlert('success', 'Login initiated');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to initiate login  - ' + error.cause.message);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Authentication Access Point</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentAuthenticationAccessPoint && <AuthenticationAccessPointDetails authenticationAccessPoint={currentAuthenticationAccessPoint} />)
                }
                <ApiResponseDialog title="Authentication Access Point API Response" open={state.showApiResponse} apiResponse={currentAuthenticationAccessPoint} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!state.showButtons} location="Authentication Access Point" />
                <ApiResponseButton data-testid="authentication-access-point-api-response" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    data-testid="authentication-access-point-initiate-login"
                    disabled={!state.showButtons}
                    buttonlabel="Initiate Login"
                    primaryToolTip="Send A Initiate Login Request"
                    secondaryToolTip="An Authentication Access Point Must Be Selected"
                    secondaryToolTipCondition={state.showButtons}
                    onClick={handleInitiateLoginClicked}
                />
            </CardActions>
        </Card>
    );
}

export {
    AuthenticationAccessPoint
}
