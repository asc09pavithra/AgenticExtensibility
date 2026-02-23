import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { BuildLocalizedStringList, PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';

// Removed Chrome & Target : git sha aeece610a648b37ef0f0a5bdfb0c518dd4cd5d1a
// Removed Category, Platform & LocalizedTitle : 35243e645aa693feaa0fcca641422c4ef9a5acd5

function BuildIconList({ icon }) {
    if (icon && icon.inlineImage) {
        return (
            <BuildIconInlineImage inlineImage={icon.inlineImage} />
        )
    }
    else if (icon && icon.localImage) {
        return buildIconLocalImage(icon.localImage);
    }
    return null;
}

function BuildIconInlineImage({ inlineImage }) {
    const classes = useStyles();
    if (inlineImage) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                <PropertyHeader name="inlineImage"></PropertyHeader>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="mimeType" secondary={inlineImage.mimeType || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyHeader name="value"></PropertyHeader>
                    <Box className={classes.largeScrollingBox} style={{ marginLeft: "40px" }} m={1}><pre className={classes.fit}>{inlineImage.value || ""}</pre></Box>
                </List>
            </List>
        );
    }
    return null;
}

function buildIconLocalImage(localImage) {
    if (localImage) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                <PropertyHeader name="localImage" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="path" secondary={localImage.path || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="fileType" secondary={localImage.fileType || ""} />
                </List>
            </List>
        );
    }
    return null;
}

function BuildGeneralApplicationAgentDisplay({ applicationAgent }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="agentId" secondary={applicationAgent.agentId || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="solutionId" secondary={applicationAgent.solutionId || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="name" secondary={applicationAgent.name || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                {/* Add in the icon, if it exists in the response */}
                {applicationAgent.icon &&
                    <React.Fragment>
                        <PropertyHeader name="icon" />
                        <BuildIconList name="icon" icon={applicationAgent.icon || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }
                <BuildLocalizedStringList name="localizedDescription" localizedString={applicationAgent.localizedDescription} />
                <Divider style={{ marginLeft: "40px" }} />
                <BuildLocalizedStringList name="localizedName" localizedString={applicationAgent.localizedName} />
            </List>
        </List>
    );
}

function ApplicationDetails(props) {
    const applicationAgent = props.applicationAgent || {};

    return (
        <BuildGeneralApplicationAgentDisplay applicationAgent={applicationAgent || {}} />
    );
}

function ApplicationAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentApplicationAgent, setCurrentApplicationAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadApplicationAgent(props.applicationId);
    }, [props.applicationId]);

    async function handleLoadClicked() {
        loadApplicationAgent(props.applicationId);
    }

    async function loadApplicationAgent(applicationId) {
        if (applicationId && applicationId.length !== 0) {
            console.log("loadApplicationAgent.applicationId: " + applicationId);
            setIsLoading(true);
            try {
                let response = await applicationService.getApplicationAgent(applicationId);
                console.log("getApplicationAgent response:" + JSON.stringify(response));

                if (null !== response) {
                    setCurrentApplicationAgent(response);
                    setState({ ...state, showButtons: true });
                }
            }
            catch (error) {
                props.postAlert('error', 'Unable to retrieve ApplicationAgent with id ' + applicationId + ' - ' + error.cause.message);
            }
            setIsLoading(false);
        }
    }

    async function handleRefreshDialogExecute() {
        try {
            let response = await applicationService.refreshApplicationAgent(currentApplicationAgent.agentId);
            console.log("refreshApplicationAgent response:" + JSON.stringify(response));

            if (response) {
                props.postAlert('success', 'Refresh request successful!');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to refrsh ApplicationAgent with id ' + currentApplicationAgent.agentId + ' - ' + error.cause.message);
        }
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
                <Typography variant="h5" component="h2">Application Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentApplicationAgent && <ApplicationDetails applicationAgent={currentApplicationAgent} />)
                }
                <ApiResponseDialog title="Application Agent API Response" open={state.showApiResponse} apiResponse={currentApplicationAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!state.showButtons} location="Application Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                <SDKButton
                    disabled={!state.showButtons}
                    buttonlabel="Send Refresh Request"
                    primaryToolTip="Send a refresh request for the registration/appearance on the homescreen"
                    secondaryToolTip="Application Agent Not Currently Selected"
                    secondaryToolTipCondition={state.showButtons}
                    onClick={handleRefreshDialogExecute}
                />
            </CardActions>
        </Card>
    );
}

export {
    ApplicationAgent
};
