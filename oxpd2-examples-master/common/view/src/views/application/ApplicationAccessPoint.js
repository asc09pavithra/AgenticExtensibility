import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid'
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import { useStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import { DeviceContext } from '../../common/DeviceContext';

function BuildIconDisplay({ icon }) {
    const classes = useStyles();
    if (icon) {
        return (
            <React.Fragment>
                <PropertyHeader name="icon"></PropertyHeader>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="mimeType" secondary={icon.mimeType || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyHeader name="value"></PropertyHeader>
                    <Box className={classes.largeScrollingBox} style={{ marginLeft: "40px" }} m={1}><pre className={classes.fit}>{icon.value || ""}</pre></Box>
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function BuildWebIntent({ webIntent, classes }) {
    if (webIntent) {
        return (
            <React.Fragment>
                <PropertyHeader name="webIntentDefinition"></PropertyHeader>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyHeader name="startSchema"></PropertyHeader>
                    <Box style={{ marginLeft: "40px", borderRadius: '2px', border: '1px solid #C8C8C8' }} m={1}><pre className={classes.fit}>{JSON.stringify(webIntent.startIntentSchema, undefined, 2)}</pre></Box>
                    <PropertyHeader name="resultSchema"></PropertyHeader>
                    <Box style={{ marginLeft: "40px", borderRadius: '2px', border: '1px solid #C8C8C8', maxHeight: '300px', maxWidth: '1200px', wordWrap: 'break-word', overflowY: 'auto', overflowX: 'auto' }} m={1}><pre className={classes.fit}>{JSON.stringify(webIntent.resultSchema, undefined, 2)}</pre></Box>
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function BuildIntentProfile({ intentProfile, classes }) {
    if (intentProfile) {
        return (
            <BuildWebIntent webIntent={intentProfile.webIntentDefinition} classes={classes} />
        );
    }
    return null;
}

function ApplicationAccessPointDetails(props) {
    const classes = useStyles();
    const applicationAccessPoint = props.applicationAccessPoint || {};

    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="title" secondary={applicationAccessPoint.title || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="accessPointId" secondary={applicationAccessPoint.accessPointId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <BuildIconDisplay icon={applicationAccessPoint.icon} />
                <BuildIntentProfile intentProfile={applicationAccessPoint.intentProfile} classes={classes} />
            </List>
        </List>
    );
}

function InitiateLaunchInput(props) {
    const [startIntentInputFile, setStartIntentInputFile] = useState({ name: '' });

    function handleStartIntentChange(e) {
        if (e.target.files.length > 0) {
            setStartIntentInputFile(e.target.files[0]);
            if (null !== props.onStartIntentFileChanged) {
                props.onStartIntentFileChanged(e.target.files[0]);
            }
        }
    };

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <>
                    {
                        <input
                            accept="*/*"
                            style={{ display: 'none' }}
                            id="reserve-startIntent-select"
                            type="file"
                            onChange={handleStartIntentChange}
                        />
                    }
                    <Grid item style={{ minWidth: '375px' }}>
                        <TextField label="StartIntent (optional)" variant="outlined" size="small" fullWidth value={startIntentInputFile.name} />
                    </Grid>
                    <Grid item>
                        <label htmlFor="reserve-startIntent-select">
                            <Button color="inherit" variant="outlined" size="medium" component="span" style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}>Select...</Button>
                        </label>
                    </Grid>
                </>
            </Grid>
        </Grid>
    );
}

function ApplicationAccessPoint(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationAccessPointService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [currentApplicationAccessPoint, setCurrentApplicationAccessPoint] = useState(null);
    const [startIntentFile, setStartIntentFile] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showInitiateLaunchDialog: false
    });

    useEffect(() => {
        loadApplicationAccessPoint(props.accessPointId);
    }, [props.accessPointId]);

    async function handleLoadClicked() {
        loadApplicationAccessPoint(props.accessPointId);
    }

    async function handleInitiateLaunchButtonClicked() {
        setStartIntentFile(null);
        setState({ ...state, showInitiateLaunchDialog: true });
    }

    async function handleInitiateLaunchDialogCancel() {
        setState({ ...state, showInitiateLaunchDialog: false });
    }

    async function handleInitiateLaunchExecute() {
        let response;
        try {
            response = await applicationAccessPointService.applicationAccessPointInitiateLaunch(currentApplicationAccessPoint.accessPointId, {}, startIntentFile);
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Initiate Launch request successful!');
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to initiate launch  - ' + error.cause.message);
        }
        setState({ ...state, showInitiateLaunchDialog: false });
    }

    function handleStartIntentInputChanged(file) {
        if (null !== file) {
            setStartIntentFile(file);
        }
    };

    async function loadApplicationAccessPoint(accessPointId) {
        let response;

        if (!accessPointId || accessPointId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await applicationAccessPointService.getApplicationAccessPoint(accessPointId);
            console.log("getApplicationAccessPoint response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentApplicationAccessPoint(response);
                setShowButtons(true);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve ApplicationAccessPoint ' + accessPointId + '  - ' + error.cause.message);
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
                <Typography variant="h5" component="h2">Application Access Point</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentApplicationAccessPoint && <ApplicationAccessPointDetails applicationAccessPoint={currentApplicationAccessPoint} />)
                }
                <Dialog fullWidth={true} maxWidth="sm" open={state.showInitiateLaunchDialog} onClose={handleInitiateLaunchDialogCancel}>
                    <DialogTitle>Initiate Launch</DialogTitle>
                    <DialogContent style={{ height: '200px' }}>
                        <DialogContentText>
                            Add an optional start intent file and launch:
                        </DialogContentText>
                        {
                            isLoading ? <Loading message="Loading resource..." /> :
                                <InitiateLaunchInput onStartIntentFileChanged={handleStartIntentInputChanged} />
                        }
                    </DialogContent>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit This Window"
                            secondaryToolTip="Unable To Exit This Window"
                            secondaryToolTipCondition={true}
                            onClick={handleInitiateLaunchDialogCancel}
                        />
                        <SDKButton
                            disabled={false}
                            buttonlabel="Initiate Launch"
                            primaryToolTip="Launch The Application"
                            secondaryToolTip="Initiate Launch is Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={handleInitiateLaunchExecute}
                        />
                    </DialogActions>
                </Dialog>
                <ApiResponseDialog title="Application Access Point API Response" open={state.showApiResponse} apiResponse={currentApplicationAccessPoint} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!showButtons} location="Application Access Point" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!showButtons} />
                <SDKButton
                    disabled={(!showButtons || !(deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound"))}
                    buttonlabel="Initiate Launch"
                    primaryToolTip="Launch The Application"
                    secondaryToolTip="Initiate Launch Unavailable"
                    secondaryToolTipCondition={(showButtons && deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound")}
                    onClick={handleInitiateLaunchButtonClicked}
                />
            </CardActions>
        </Card>
    );
}

export {
    ApplicationAccessPoint
}
