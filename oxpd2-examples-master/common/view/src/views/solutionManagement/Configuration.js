import { Card, CardActions, CardContent, Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import { DownloadToDownloadsFolder } from '../../common/Utilities';
import { PropertyItem } from '../../common/ResponseTypes';
import { Tabs, Tab } from '@mui/material';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import SDKButton from '../../common/SDKButton';

function Data(props) {
    const solutionManagerService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [configurationFile, setConfigurationFile] = useState(null);
    const [state, setState] = useState({
        showReplaceDialog: false,
        dialogReplaceButtonEnabled: false,
        contentType: props.configuration.mime ? props.configuration.mime : "application/octet-stream"
    });

    async function handleLoadClicked() {
        loadConfigurationData(props.solutionId);
    }

    async function loadConfigurationData(solutionId) {
        let response;
        console.log(solutionId);

        setIsLoading(true);
        try {
            response = await solutionManagerService.getConfigurationData(solutionId);
            console.log(JSON.stringify(response));
            let fileName = props.solutionId + "_ConfigurationData";
            DownloadToDownloadsFolder(response.item2, fileName);
            props.postAlert('success', 'Get request successful, Downloaded: ' + fileName);
        }
        catch (error) {
            props.postAlert('error', 'Failed to get configuration data - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleReplaceClicked() {
        setState({ ...state, showReplaceDialog: true });
    }

    async function handleReplaceDialogCancel() {
        setState({ ...state, showReplaceDialog: false, dialogReplaceButtonEnabled: false });
    }

    function handleConfigurationFileChanged(file) {
        if (null !== file) {
            console.log('selected configuration file: ' + file.name);
            setState({ ...state, dialogReplaceButtonEnabled: true });
            setConfigurationFile(file);
        }
    }

    async function handleReplaceDialogExecute() {
        let response;

        setIsLoading(true);
        try {
            response = await solutionManagerService.replaceConfigurationData(props.solutionId, configurationFile, state.contentType);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'replace request successful');
        }
        catch (error) {
            props.postAlert('error', 'Unable to replace configuration data- ' + error.cause.message);
        }
        setIsLoading(false);
        setState({ ...state, showReplaceDialog: false, dialogReplaceButtonEnabled: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">The associated data for this solution configuration, matching the configuration's defined mime type.</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> : ""
                }
                <Dialog fullWidth={true} maxWidth="sm" open={state.showReplaceDialog} onClose={handleReplaceDialogCancel}>
                    <DialogTitle>Replace Configuration Data</DialogTitle>
                    <DialogContent style={{ height: '150px' }}>
                        <DialogContentText>
                            Select a configuration data file:
                        </DialogContentText>
                        <ReplaceUploadInput onConfigFileChanged={handleConfigurationFileChanged} />
                    </DialogContent>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit This View"
                            secondaryToolTip="Unable To Exit"
                            secondaryToolTipCondition={true}
                            onClick={handleReplaceDialogCancel}
                        />
                        <SDKButton
                            disabled={!state.dialogReplaceButtonEnabled}
                            buttonlabel="Replace"
                            primaryToolTip="Replace Configuration Data"
                            secondaryToolTip="Data Must Be Changed"
                            secondaryToolTipCondition={state.dialogReplaceButtonEnabled}
                            onClick={handleReplaceDialogExecute}
                        />
                    </DialogActions>
                </Dialog>
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solutionsConfigData-get-button"
                    disabled={false}
                    buttonlabel="Get"
                    primaryToolTip="Get The Configuration Data"
                    secondaryToolTip="Unable To Get Configuration Data"
                    secondaryToolTipCondition={true}
                    onClick={handleLoadClicked}
                />
                <SDKButton
                    data-testid="solutionsConfigData-replace-button"
                    disabled={false}
                    buttonlabel="Replace"
                    primaryToolTip="Replace The Configuration Data"
                    secondaryToolTip="Unable To Replace Configuration Data"
                    secondaryToolTipCondition={true}
                    onClick={handleReplaceClicked}
                />
            </CardActions>
        </Card>
    );
}

function ReplaceUploadInput(props) {
    const classes = useStyles();
    const [configurationFile, setConfigurationFile] = useState({ name: '' });

    function handleConfigInputChanged(e) {
        if (e.target.files.length > 0) {
            setConfigurationFile(e.target.files[0]);
            if (null !== props.onConfigFileChanged) {
                props.onConfigFileChanged(e.target.files[0]);
            }
        }
    };

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <>
                    <input
                        accept="*/*"
                        className={classes.root}
                        style={{ display: 'none' }}
                        id="configuration-file-select"
                        type="file"
                        onChange={handleConfigInputChanged}
                    />
                    <Grid item style={{ minWidth: '300px' }}>
                        <TextField label="Configuration Data" variant="outlined" size="small" readOnly fullWidth value={configurationFile.name} />
                    </Grid>
                    <Grid item>
                        <label htmlFor="configuration-file-select">
                            <SDKButton
                                color="inherit"
                                className={classes.root}
                                variant="outlined"
                                component="span"
                                disabled={false}
                                buttonlabel="Select..."
                                primaryToolTip="Select A Configuration File"
                                secondaryToolTip="Unable To Select"
                                secondaryToolTipCondition={true}
                                style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}
                            />
                        </label>
                    </Grid>
                </>
            </Grid>
        </Grid>
    );
}

function Configuration(props) {
    const classes = useStyles();
    const solutionManagerService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [configuration, setConfiguration] = useState(null);
    const [description, setDescription] = useState('');
    const [mimeType, setMimeType] = useState('');
    const [dialogModifyButtonEnabled, setDialogModifyButtonEnabled] = useState(true);
    const [showModifyDialog, setShowModifyDialog] = useState(false);

    useEffect(() => {
        loadConfiguration(props.solutionId);
    }, []);

    async function handleLoadClicked() {
        loadConfiguration(props.solutionId);
    }

    async function loadConfiguration(solutionId) {
        let response;

        setIsLoading(true);
        try {
            response = await solutionManagerService.getConfiguration(solutionId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setConfiguration(response);
                setMimeType(response.mimeType);
                setDescription(response.description);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve configuration - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleModifyClicked() {
        setShowModifyDialog(true);
    }

    async function handleModifyDialogCancel() {
        setShowModifyDialog(false);
    }

    async function handleModifyDialogExecute() {
        let response;
        let modifyRequest = {
            mimeType: mimeType
        }

        if (description && description !== '') {
            modifyRequest.description = description;
        }

        try {
            response = await solutionManagerService.modifyConfiguration(props.solutionId, modifyRequest);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setConfiguration(response);
                setMimeType(response.mimeType);
                setDescription(response.description);
                setShowModifyDialog(false);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve configuration - ' + error.cause.message);
        }
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleMimeType = (event) => {
        setMimeType(event.target.value);
        if (event.target.value === '') {
            setDialogModifyButtonEnabled(false);
        } else {
            setDialogModifyButtonEnabled(true);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Configuration</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (configuration && <ConfigurationCardContent configuration={configuration} service={props.service} postAlert={props.postAlert} solutionId={props.solutionId} />)
                }
                <Dialog fullWidth={true} maxWidth="sm" open={showModifyDialog} onClose={handleModifyDialogCancel}>
                    <DialogTitle>Modify Configuration</DialogTitle>
                    <DialogContent style={{ height: '150px' }}>
                        <Grid item xs={12}>
                            <TextField className={classes.dialogTextField} variant="outlined" fullWidth
                                id="description"
                                label="description"
                                type="text"
                                value={description}
                                onInput={handleDescription}
                            />
                            <TextField className={classes.dialogTextField} variant="outlined" required fullWidth
                                id="mimeType"
                                label="mimeType"
                                type="text"
                                value={mimeType}
                                onInput={handleMimeType}
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit This View"
                            secondaryToolTip="Unable To Exit"
                            secondaryToolTipCondition={true}
                            onClick={handleModifyDialogCancel}
                        />
                        <SDKButton
                            disabled={!dialogModifyButtonEnabled}
                            buttonlabel="Modify"
                            primaryToolTip="Replace Configuration Data"
                            secondaryToolTip="Data Must Be Changed"
                            secondaryToolTipCondition={dialogModifyButtonEnabled}
                            onClick={handleModifyDialogExecute}
                        />
                    </DialogActions>
                </Dialog>
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solutionsConfig-refresh-button"
                    disabled={configuration === null}
                    buttonlabel="Load/Refresh"
                    primaryToolTip="Refresh The Configuration"
                    secondaryToolTip="Configuration Not Selected"
                    secondaryToolTipCondition={configuration !== null}
                    onClick={handleLoadClicked}
                />
                <SDKButton
                    data-testid="solutionsConfig-refresh-button"
                    disabled={configuration === null}
                    buttonlabel="Modify"
                    primaryToolTip="Modify The Configuration"
                    secondaryToolTip="Configuration Not Selected"
                    secondaryToolTipCondition={configuration !== null}
                    onClick={handleModifyClicked}
                />
            </CardActions>
        </Card>
    );
}

function ConfigurationCardContent(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ marginTop: 10 }}>
            <AppBar position="static" color="inherit">
                <Tabs value={value} onChange={handleChange} aria-label="Solution Tabs" {...baseTabStyles}>
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Data" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <ViewTabPanel value={value} index={0}>
                <List component="nav" className={classes.root}>
                    <List component="div" disablePadding>
                        <PropertyItem primary="description" secondary={props.configuration.description || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="mimeType" secondary={props.configuration.mimeType || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </List>
                </List>
            </ViewTabPanel>
            <ViewTabPanel value={value} index={1}>
                <Data service={props.service} postAlert={props.postAlert} solutionId={props.solutionId} configuration={props.configuration} />
            </ViewTabPanel>
        </div>
    );
}

function ConfigurationTabContent(props) {
    const solutionId = props.solutionId;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Configuration service={props.service} loadEnabled={true} postAlert={props.postAlert} solutionId={solutionId} />
            </Grid>
        </Grid>
    )
}

export {
    ConfigurationTabContent
};
