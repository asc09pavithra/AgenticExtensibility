import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Divider from '@mui/material/Divider';
import Loading from '../../common/Loading';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardActions } from '@mui/material';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import { makeStyles } from '@mui/styles';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

export const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    json: {
        borderRadius: '5px',
        border: '1px solid #0a0a0f',
        background: '#f0f0f5',
        padding: '5px',
        fontFamily: 'Monospace',
        fontSize: '10pt',
        overflowY: 'auto',
        overflowX: 'auto'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    identity: {
        minHeight: '300px',
        maxHeight: '300px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function BuildMakeAndModelInfo({ info }) {
    if (info) {
        return (
            <React.Fragment>
                <PropertyHeader name="makeAndModelInfo" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="base" secondary={info.base || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="family" secondary={info.family || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="model" secondary={info.model || ""} />
                </List>
            </React.Fragment>
        );
    }
    else {
        return (
            <PropertyItem primary="makeAndModelInfo" secondary="" />
        )
    }
}

function IdentityDetails({ identity }) {
    if (identity) {
        return (
            <List component="nav">
                <List component="div" disablePadding>
                    <PropertyItem primary="deviceUuid" secondary={identity.deviceUuid || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="firmwareVersion" secondary={identity.firmwareVersion || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="formatterSerialNumber" secondary={identity.formatterSerialNumber || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildMakeAndModelInfo info={identity.makeAndModelInfo || {}} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="productNumber" secondary={identity.productNumber || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="serialNumber" secondary={identity.serialNumber || ""} />
                </List>
            </List>
        );
    }
}

function Identity(props) {
    const deviceContext = useContext(DeviceContext);
    const deviceService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentIdentity, setCurrentIdentity] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadIdentity(props.identity);
    }, [props.identity]);

    async function handleLoadClicked() {
        loadIdentity(props.identity);
    }

    async function loadIdentity(identity) {
        let response;

        console.log("loadIdentity");

        setIsLoading(true);
        try {
            response = await deviceService.getIdentity();
            console.log("getIdentity response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentIdentity(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Identity - ' + error.cause.message);
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
        <Card data-testid='identity-details'>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.name ? props.name : "Identity"}
                </Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentIdentity && <IdentityDetails identity={currentIdentity} />)
                }
                <ApiResponseDialog title="Identity API Response" open={state.showApiResponse} apiResponse={currentIdentity} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Identity" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    Identity
}
