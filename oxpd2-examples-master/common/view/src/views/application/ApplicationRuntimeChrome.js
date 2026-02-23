import React, { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Loading from '../../common/Loading';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { PropertyHeader, PropertyItemWithDivider } from '../../common/ResponseTypes';
import List from '@mui/material/List';
import ApiResponseButton from '../../common/ApiResponseButton';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';

export default function ApplicationRuntimeChrome(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;

    const [context, setContext] = useState(null);
    const [runtimeChrome, setRuntimeChrome] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [state, setState] = useState({
        showModifyDialog: false,
        dialogModifyButtonEnabled: false,
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadApplicationRuntimeChrome();
    }, []);

    async function handleLoadClicked() {
        loadApplicationRuntimeChrome();
    }

    async function handleModifyClicked() {
        setState({ ...state, dialogModifyButtonEnabled: false, showModifyDialog: true });
    }

    async function handleModifyDialogCancel() {
        setState({ ...state, dialogModifyButtonEnabled: false, showModifyDialog: false });
    }

    async function handleModifyDialogExecute() {
        {
            let response;
            try {
                response = await applicationService.modifyApplicationRuntimeCurrentContextRuntimeChrome(JSON.parse(runtimeChrome));
                console.log(JSON.stringify(response));
                if (null !== response) {
                    setContext(response);
                    props.postAlert('success', 'Modify runtime chrome request successful!');
                    setState({ ...state, showButtons: true });
                }
            }
            catch (error) {
                props.postAlert('error', 'Failed to modify runtime chrome - ' + error.cause.message);
            }
        }

        setState({ ...state, showModifyDialog: false });
    }

    async function handleReplaceDialogExecute() {
        {
            let response;
            try {
                response = await applicationService.replaceApplicationRuntimeCurrentContextRuntimeChrome(JSON.parse(runtimeChrome));
                console.log(JSON.stringify(response));
                if (null !== response) {
                    setContext(response);
                    props.postAlert('success', 'Replace runtime chrome request successful!');
                    setState({ ...state, showButtons: true });
                }
            }
            catch (error) {
                props.postAlert('error', 'Failed to replace runtime chrome operation - ' + error.cause.message);
            }
        }

        setState({ ...state, showModifyDialog: false });
    }

    function handleRuntimeChromeChanged(context) {
        if (null !== context) {
            setRuntimeChrome(context);
            setState({ ...state, dialogModifyButtonEnabled: true });
        }
    }

    async function loadApplicationRuntimeChrome() {

        let response;

        setIsLoading(true);

        try {
            response = await applicationService.getApplicationRuntimeCurrentContextRuntimeChrome();
            console.log(JSON.stringify(response));

            if (null !== response) {
                setContext(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            setContext(null);
            props.postAlert('error', 'Unable to retrieve runtime chrome. ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <div>
            <Card>
                <CardContent>
                    {
                        isLoading ? <Loading message="Loading resource..." /> :
                            (context && <RuntimeChromeDetails context={context} />)
                    }
                    <ApiResponseDialog title="Application Runtime Chrome API Response" open={state.showApiResponse} apiResponse={context} handleClose={handleDialogClose} />
                    <Dialog fullWidth={true} maxWidth="lg" open={state.showModifyDialog} onClose={handleModifyDialogCancel}>
                        <DialogTitle>Modify or Replace Context</DialogTitle>
                        <DialogContent style={{ height: '450px' }}>
                            <RuntimeChromeDialogContent_TextField context={context} onContextInputChanged={handleRuntimeChromeChanged} />
                        </DialogContent>
                        <DialogActions>
                            <SDKButton
                                disabled={false}
                                buttonlabel="Cancel"
                                primaryToolTip="Exit This Window"
                                secondaryToolTip="Unable to Exit"
                                secondaryToolTipCondition={true}
                                onClick={handleModifyDialogCancel}
                            />
                            <SDKButton
                                disabled={!state.dialogModifyButtonEnabled}
                                buttonlabel="Modify Context"
                                primaryToolTip="Modify Runtime Chrome Context"
                                secondaryToolTip="Must Edit Text to Continue"
                                secondaryToolTipCondition={state.dialogModifyButtonEnabled}
                                onClick={handleModifyDialogExecute}
                            />
                            <SDKButton
                                disabled={!state.dialogModifyButtonEnabled}
                                buttonlabel="Replace Context"
                                primaryToolTip="Replace Runtime Chrome Context"
                                secondaryToolTip="Must Edit Text to Continue"
                                secondaryToolTipCondition={state.dialogModifyButtonEnabled}
                                onClick={handleReplaceDialogExecute}
                            />
                        </DialogActions>
                    </Dialog>
                </CardContent>
                <CardActions>
                    <LoadRefreshButton data-testid='application-runtimechrome-loadrefresh' onClick={handleLoadClicked} isLoading={isLoading} location="Application Runtime Chrome" />
                    <SDKButton
                        data-testid='application-runtimechrome-modifyreplace'
                        disabled={!props.loadEnabled || !(deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound")}
                        buttonlabel="Modify/Replace"
                        primaryToolTip="Modify or Replace the Current Chrome Context"
                        secondaryToolTip="Modify/Replace Unavailable"
                        secondaryToolTipCondition={!(!props.loadEnabled || !(deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound"))}
                        onClick={handleModifyClicked}
                    />
                    <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                </CardActions>
            </Card>
        </div>
    );
}

function RuntimeChromeDialogContent_TextField(props) {
    // Deep copy the context
    var context = JSON.parse(JSON.stringify(props.context));

    if (context !== undefined && context !== null) {
        // Remove the Links & OpMeta because they aren't part of a modify or replace request
        delete context.links;
        delete context.$opMeta;
    }
    const [value, setValue] = useState(JSON.stringify(context, undefined, 2));

    function handleContextInputChanged(event) {
        setValue(event.target.value);
        props.onContextInputChanged(event.target.value);
    }

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        rows={20}
                        onChange={handleContextInputChanged}
                        label="Edit Runtime Chrome"
                        variant="outlined"
                        size="large"
                        fullWidth
                        value={value} />
                </Grid>
            </Grid>
        </Grid>
    );
}

function RuntimeChromeDetails(props) {

    if (!props.context.applicationChrome || (!props.context.applicationChrome.webApplicationRuntimeChrome
        && !props.context.applicationChrome.workpathApplicationRuntimeChrome)) {
        return (
            <React.Fragment>
                <PropertyItemWithDivider primary="applicationChrome" secondary="No Active Application" />
                <PropertyItemWithDivider primary="workpathApplicationRuntimeChrome" secondary="No Active Application" />
            </React.Fragment>
        );
    }
    else {
        if (props.context.applicationChrome.webApplicationRuntimeChrome) {
            var runtimeChrome = props.context.applicationChrome.webApplicationRuntimeChrome;
            return (
                <React.Fragment>
                    <PropertyHeader name="webApplicationRuntimeChrome" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        {runtimeChrome.dateTimeAvailable !== undefined && <PropertyItemWithDivider primary="dateTimeAvailable" secondary={runtimeChrome.dateTimeAvailable?.toString() || ""} />}
                        {runtimeChrome.footerBackgroundColor && <PropertyItemWithDivider primary="footerBackgroundColor" secondary={runtimeChrome.footerBackgroundColor || ""} />}
                        {runtimeChrome.footerVisible !== undefined && <PropertyItemWithDivider primary="footerVisible" secondary={runtimeChrome.footerVisible?.toString() || ""} />}
                        {runtimeChrome.headerBackgroundColor && <PropertyItemWithDivider primary="headerBackgroundColor" secondary={runtimeChrome.headerBackgroundColor || ""} />}
                        {runtimeChrome.headerForegroundColor && <PropertyItemWithDivider primary="headerForegroundColor" secondary={runtimeChrome.headerForegroundColor || ""} />}
                        {runtimeChrome.headerIcon && (
                            <>
                                <PropertyHeader name="headerIcon" />
                                {runtimeChrome.headerIcon.inlineImage && (
                                    <>
                                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                            <PropertyHeader name="inlineImage" />
                                        </List>
                                        <List style={{ paddingLeft: "80px" }} component="div" disablePadding >
                                            <PropertyItemWithDivider primary="mimeType" secondary={runtimeChrome.headerIcon.inlineImage.mimeType || ""} />
                                            <PropertyItemWithDivider primary="value" secondary={runtimeChrome.headerIcon.inlineImage.value ? `${runtimeChrome.headerIcon.inlineImage.value.substring(0, 50)}...` : ""} />
                                        </List>
                                    </>
                                )}
                                {runtimeChrome.headerIcon.localImage && (
                                    <>
                                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                            <PropertyHeader name="localImage" />
                                        </List>
                                        <List style={{ paddingLeft: "80px" }} component="div" disablePadding >
                                            <PropertyItemWithDivider primary="fileType" secondary={runtimeChrome.headerIcon.localImage.fileType || ""} />
                                            <PropertyItemWithDivider primary="path" secondary={runtimeChrome.headerIcon.localImage.path || ""} />
                                        </List>
                                    </>
                                )}
                            </>
                        )}
                        {runtimeChrome.headerTitle && <PropertyItemWithDivider primary="headerTitle" secondary={runtimeChrome.headerTitle || ""} />}
                        {runtimeChrome.helpButtonAvailable !== undefined && <PropertyItemWithDivider primary="helpButtonAvailable" secondary={runtimeChrome.helpButtonAvailable?.toString() || ""} />}
                        {runtimeChrome.homeButtonAvailable !== undefined && <PropertyItemWithDivider primary="homeButtonAvailable" secondary={runtimeChrome.homeButtonAvailable?.toString() || ""} />}
                        {runtimeChrome.infoButtonEnabled !== undefined && <PropertyItemWithDivider primary="infoButtonEnabled" secondary={runtimeChrome.infoButtonEnabled?.toString() || ""} />}
                        {runtimeChrome.resetButtonEnabled !== undefined && <PropertyItemWithDivider primary="resetButtonEnabled" secondary={runtimeChrome.resetButtonEnabled?.toString() || ""} />}
                        {runtimeChrome.signInAvailable !== undefined && <PropertyItemWithDivider primary="signInAvailable" secondary={runtimeChrome.signInAvailable?.toString() || ""} />}
                        {runtimeChrome.softKeyboardIsAvailable !== undefined && <PropertyItemWithDivider primary="softKeyboardIsAvailable" secondary={runtimeChrome.softKeyboardIsAvailable?.toString() || ""} />}
                        {runtimeChrome.startButtonEnabled !== undefined && <PropertyItemWithDivider primary="startButtonEnabled" secondary={runtimeChrome.startButtonEnabled?.toString() || ""} />}
                        {runtimeChrome.startButtonVisible !== undefined && <PropertyItemWithDivider primary="startButtonVisible" secondary={runtimeChrome.startButtonVisible?.toString() || ""} />}
                    </List>
                </React.Fragment>
            )
        }
        else if (props.context.applicationChrome.workpathApplicationRuntimeChrome) {
            return (
                <React.Fragment>
                    <PropertyHeader name="workpathApplicationRuntimeChrome" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <PropertyItemWithDivider primary="workpathApplicationRuntimeChrome" secondary={Object.keys(props.context.applicationChrome.workpathApplicationRuntimeChrome) || ""} />
                    </List>
                </React.Fragment>
            )
        };
    }
}
