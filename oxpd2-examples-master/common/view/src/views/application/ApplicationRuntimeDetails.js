
import React, { useState, useEffect } from 'react';
import { PropertyHeader, PropertyItem, PropertyItemWithDivider } from '../../common/ResponseTypes';
import { Card, CardActions, CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useStyles } from '../../common/commonStyles';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';

function ApplicationRuntimeDetailContent(props) {
    if (props.context && props.context.activeApplication) {
        return (
            <React.Fragment>
                <PropertyHeader name="activeApplication" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItemWithDivider primary="solutionId" secondary={props.context.activeApplication.solutionId || ""} />
                    <PropertyItemWithDivider primary="applicationId" secondary={props.context.activeApplication.applicationId || ""} />
                    <PropertyItemWithDivider primary="name" secondary={props.context.activeApplication.name || ""} />
                </List>
                <PropertyItem primary="identifier" secondary={props.context.identifier || ""} />
                <Divider style={{ marginLeft: "40px" }} />
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment>
                <PropertyItem primary="activeApplication" secondary="no current active application" />
            </React.Fragment>
        )
    }
}

function ExecApplicationInput(props) {
    const [startIntentInputFile, setStartIntentInputFile] = useState({ name: '' });
    const [applicationId, setApplicationId] = useState('');

    function handleStartIntentChange(e) {
        if (e.target.files.length > 0) {
            setStartIntentInputFile(e.target.files[0]);
            if (null !== props.onStartIntentFileChanged) {
                props.onStartIntentFileChanged(e.target.files[0]);
            }
        }
    }

    function handleApplicationIdChange(e) {
        setApplicationId(e.target.value);
        if (null !== props.onApplicationIdChanged) {
            props.onApplicationIdChanged(e.target.value);
        }
    }

    return (
        <Grid container spacing={2} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12}>
                    <TextField 
                        label="Application ID" 
                        variant="outlined" 
                        size="small" 
                        fullWidth 
                        required
                        value={applicationId}
                        onChange={handleApplicationIdChange}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center">
                        <input
                            accept="*/*"
                            style={{ display: 'none' }}
                            id="exec-startIntent-select"
                            type="file"
                            onChange={handleStartIntentChange}
                        />
                        <Grid item xs>
                            <TextField label="StartIntent (optional)" variant="outlined" size="small" fullWidth value={startIntentInputFile.name} />
                        </Grid>
                        <Grid item>
                            <label htmlFor="exec-startIntent-select">
                                <Button color="inherit" variant="outlined" size="medium" component="span" style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}>Select...</Button>
                            </label>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

function ApplicationRuntimeDetails(props) {
    const applicationService = props.service;
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [runtimeDetails, setRuntimeDetails] = useState();
    const [startIntentFile, setStartIntentFile] = useState(null);
    const [execApplicationId, setExecApplicationId] = useState('');
    const [state, setState] = useState({
        showExecDialog: false
    });

    async function onLoadClicked() {
        loadCurrentContext();
    }

    useEffect(() => {
        if(props.isLoaded){
            loadCurrentContext();
        }
    }, []);

    async function onExitButtonClicked() {
        let response;
        try {
            response = await applicationService.exitApplicationRuntimeCurrentContext();
            console.log(JSON.stringify(response));

            if (response) {
                props.postAlert('success', 'Exit request successful!');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to exit current context  - ' + error.message);
        }
    }

    async function onExecButtonClicked() {
        setStartIntentFile(null);
        setExecApplicationId('');
        setState({ ...state, showExecDialog: true });
    }

    async function handleExecDialogCancel() {
        setState({ ...state, showExecDialog: false });
    }

    async function handleExecDialogExecute() {
        let response;
        try {
            response = await applicationService.execApplicationRuntimeCurrentContext(execApplicationId, startIntentFile);
            console.log(JSON.stringify(response));

            if (response) {
                props.postAlert('success', 'Exec request successful!');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to execute application  - ' + error.message);
        }
        setState({ ...state, showExecDialog: false });
    }

    function handleStartIntentInputChanged(file) {
        if (null !== file) {
            setStartIntentFile(file);
        }
    }

    function handleApplicationIdInputChanged(value) {
        setExecApplicationId(value);
    }

    async function onResetInactivityTimerButtonClicked() {
        let response;
        try {
            response = await applicationService.resetInactivityTimerApplicationRuntimeCurrentContext();
            console.log(JSON.stringify(response));

            if (response) {
                props.postAlert('success', 'Reset Inactivity Timer request successful!');
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to reset inactivity timer  - ' + error.message);
        }
    }

    async function loadCurrentContext() {
        let response;

        setIsLoading(true);
        try {
            response = await applicationService.getApplicationRuntimeCurrentContext();
            console.log(JSON.stringify(response));

            if (response) {
                setRuntimeDetails(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Current Context  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Application Runtime</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (runtimeDetails && <ApplicationRuntimeDetailContent context={runtimeDetails} postAlert={props.postAlert} />)}
                <Dialog fullWidth={true} maxWidth="sm" open={state.showExecDialog} onClose={handleExecDialogCancel}>
                    <DialogTitle>Exec Application</DialogTitle>
                    <DialogContent style={{ height: '150px' }}>
                        Only an application in kiosk mode with an active UiContext session can call the exec method.
                        <ExecApplicationInput 
                            onStartIntentFileChanged={handleStartIntentInputChanged}
                            onApplicationIdChanged={handleApplicationIdInputChanged}
                        />
                    </DialogContent>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit This Window"
                            secondaryToolTip="Unable To Exit This Window"
                            secondaryToolTipCondition={true}
                            onClick={handleExecDialogCancel}
                        />
                        <SDKButton
                            disabled={!execApplicationId || execApplicationId.trim() === ''}
                            buttonlabel="Exec"
                            primaryToolTip="Launch The Application"
                            secondaryToolTip="Application ID is required"
                            secondaryToolTipCondition={!(!execApplicationId || execApplicationId.trim() === '')}
                            onClick={handleExecDialogExecute}
                        />
                    </DialogActions>
                </Dialog>
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={onLoadClicked} isLoading={isLoading} location="Application Runtime Details" />
                <SDKButton
                    disabled={runtimeDetails === null}
                    buttonlabel="Exit"
                    primaryToolTip="Send Exit Request"
                    secondaryToolTip="Unable to Exit"
                    secondaryToolTipCondition={runtimeDetails !== null}
                    onClick={onExitButtonClicked}
                />
                <SDKButton
                    disabled={runtimeDetails === null}
                    buttonlabel="Exec"
                    primaryToolTip="Send Exec Request"
                    secondaryToolTip="Unable to Exec"
                    secondaryToolTipCondition={runtimeDetails !== null}
                    onClick={onExecButtonClicked}
                />
                <SDKButton
                    className={classes.buttonmargin}
                    disabled={runtimeDetails === null}
                    buttonlabel="Reset Inactivity Timer"
                    primaryToolTip="Send Reset Inactivity Timer Request"
                    secondaryToolTip="Unable to Reset Inactivity Timer"
                    secondaryToolTipCondition={runtimeDetails !== null}
                    onClick={onResetInactivityTimerButtonClicked}
                />
            </CardActions>
        </Card>
    );
}

export {
    ApplicationRuntimeDetails
}
