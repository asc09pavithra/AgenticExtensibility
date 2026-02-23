import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardActions, Divider, Collapse, ListItemText, ListItem, Grid } from '@mui/material';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

function NetworkInfo(props) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding style={{ paddingLeft: "40px"}}>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                            {"adapterName: " + props.networkInfo.adapterName}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List style={{ marginLeft: "40px" }}> 
                    <PropertyItem primary="adapterName" secondary={props.networkInfo.adapterName || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="hostName" secondary={props.networkInfo.hostName || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="ipV4" secondary={props.networkInfo.ipV4 || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="ipV6" />
                    <List style={{ marginLeft: "40px", marginTop: "-20px" }}>
                        {props.networkInfo.ipV6 && props.networkInfo.ipV6.map((address) => (
                            <PropertyItem secondary={address || ""} />
                        ))}
                    </List>
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="macAddress" secondary={props.networkInfo.macAddress || ""} />
                </List>
            </Collapse>
            <Divider style={{ marginLeft: "40px" }} />
        </List>
    )
}

function DeploymentInformationDetails({ deploymentInformation }) {
    if (deploymentInformation) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="networkInfo"/>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            {deploymentInformation.networkInfo && deploymentInformation.networkInfo.map((networkInfo) => (
                                <>
                                    <NetworkInfo networkInfo={networkInfo} />
                                </>
                            ))}
                        </Grid>
                    </Grid>
                    <PropertyHeader name="ownerInfo" />
                    <List style={{ marginLeft: "40px" }}> 
                        <PropertyItem primary="assetNumber" secondary={deploymentInformation.ownerInfo.assetNumber || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="companyName" secondary={deploymentInformation.ownerInfo.companyName || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="contactName" secondary={deploymentInformation.ownerInfo.contactName || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="deviceLocation" secondary={deploymentInformation.ownerInfo.deviceLocation || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="deviceName" secondary={deploymentInformation.ownerInfo.deviceName || ""} />
                    </List>
                </List>
            </List>
        );
    }
}

function DeploymentInformation(props) {
    const deviceContext = useContext(DeviceContext);
    const deviceService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentDeploymentInformation, setCurrentDeploymentInformation] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadDeploymentInformation(props.deploymentInformation);
    }, [props.deploymentInformation]);

    async function handleLoadClicked() {
        loadDeploymentInformation(props.deploymentInformation);
    }

    async function loadDeploymentInformation(deploymentInformation) {
        let response;

        console.log("loadDeploymentInformation");

        setIsLoading(true);
        try {
            response = await deviceService.getDeploymentInformation();
            console.log("getDeploymentInformation response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentDeploymentInformation(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve DeploymentInformation - ' + error.cause.message);
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
                <Typography variant="h5" component="h2">
                    {props.name ? props.name : "DeploymentInformation"}
                </Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentDeploymentInformation && <DeploymentInformationDetails deploymentInformation={currentDeploymentInformation} />)
                }
                <ApiResponseDialog title="DeploymentInformation API Response" open={state.showApiResponse} apiResponse={currentDeploymentInformation} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="DeploymentInformation" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    DeploymentInformation
}
