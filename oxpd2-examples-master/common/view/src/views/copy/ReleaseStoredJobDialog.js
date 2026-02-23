import { Box, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../../common/Loading';
import SDKButton from '../../common/SDKButton';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import BindableSolutionContext from '../../common/BindableSolutionContext';

export default function ReleaseStoredJobDialog(props) {
    const [value, setValue] = useState(0);
    const [defaultOptions, setDefaultOptions] = useState({});
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [jobPassword, setJobPassword] = useState('');
    const copyJobService = props.service;
    const usedOptions = useRef({});

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postCopyTicketAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: []
    });

    useEffect(() => {
        loadDefaultOptionsAndProfile();
    }, []);

    async function loadDefaultOptionsAndProfile() {
        setIsLoading(true);
        try {
            let defaultOptions;
            let copyProfile;

            // These options are bools in the copy profile
            const booleanOptions = [
                "autoDeskew",
                "autoExposure",
                "autoPaperColorRemoval",
                "autoTone",
                "backgroundColorRemoval",
                "backgroundNoiseRemoval",
                "blackBackground",
                "descreen",
                "edgeToEdgePrint",
                "edgeToEdgeScan",
                "eraseEdgesEnabled",
                "foldSetSheetsFoldAndStitchAutomatic",
                "invertColors",
                "jobOffset",
                "longPlotScan",
                "misfeedDetection",
                "misfeedDetectionAutoRetry",
                "scaleToFitEnabled",
                "stampBottomCenter.whiteBackground",
                "stampBottomLeft.whiteBackground",
                "stampBottomRight.whiteBackground",
                "stampTopCenter.whiteBackground",
                "stampTopLeft.whiteBackground",
                "stampTopRight.whiteBackground",
                "watermark.firstPageOnly",
                "watermark.rotate45"
            ]

            defaultOptions = await copyJobService.getDefaultOptions();
            copyProfile = await copyJobService.getCopyProfile();
            if (defaultOptions !== null) {
                setDefaultOptions(defaultOptions);
                Object.entries(defaultOptions).map(([key, value]) => {
                    if (key !== "links" && key !== "$opMeta") {
                        if (typeof value != "object") {
                            usedOptions.current[key] = value;
                        } else {
                            usedOptions.current[key] = ""
                        }
                    }
                })
            }

            if (copyProfile !== null) {
                copyProfile.storedCopy.definitions.forEach(item => {
                    if (booleanOptions.includes(item.optionName)) {
                        item.rules.push({"isBool" : "true"})
                    };
                });

                // Sorting copy profile for easier viewing.
                copyProfile.storedCopy.definitions.sort(function (a, b) {
                    var textA = a.optionName.toUpperCase();
                    var textB = b.optionName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                setProfile(copyProfile.storedCopy.definitions);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve default options and/or profile - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleSetAllDefault() {
        setJobPassword('');
        loadDefaultOptionsAndProfile();
    }

    function createReleaseRequest() {
        let request = {
            copyOptions: {}
        };

        // Add copyOptions (excluding context and jobPassword)
        Object.entries(usedOptions.current).map(([key, value]) => {
            if (key !== 'context' && value !== null && value !== "" && usedOptions.current[key] != undefined) {
                if (key.includes('.')) { // Nested properties. Watermark, stamp options, etc.
                    const [parentKey, childKey] = key.split('.');
                    
                    if (!request.copyOptions[parentKey]) {
                        request.copyOptions[parentKey] = {};
                    }
                    
                    request.copyOptions[parentKey][childKey] = value;
                } else { // All other properties
                    request.copyOptions[key] = value;
                }
            }
        });

        // Add jobPassword if provided
        if (jobPassword && jobPassword.trim() !== '') {
            request.jobPassword = jobPassword;
        }

        // Add solutionContext if provided and has actual values
        if (usedOptions.current.context !== undefined && usedOptions.current.context !== null) {
            // Check if explicit has a value
            if (usedOptions.current.context.explicit && 
                usedOptions.current.context.explicit.explicitValue && 
                usedOptions.current.context.explicit.explicitValue.trim() !== '') {
                request.solutionContext = usedOptions.current.context;
            }
            // Check if expression has a value
            else if (usedOptions.current.context.expression && 
                     usedOptions.current.context.expression.expressionPattern && 
                     usedOptions.current.context.expression.expressionPattern.trim() !== '') {
                request.solutionContext = usedOptions.current.context;
            }
        }

        return request;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlePasswordChange = (event) => {
        setJobPassword(event.target.value);
    };

    async function handleValidateTicket() {
        let response;
        let copyOptions = {};

        // Build copyOptions (excluding context and jobPassword)
        Object.entries(usedOptions.current).map(([key, value]) => {
            if (key !== 'context' && value !== null && value !== "" && usedOptions.current[key] != undefined) {
                if (key.includes('.')) { // Nested properties. Watermark, stamp options, etc.
                    const [parentKey, childKey] = key.split('.');
                    
                    if (!copyOptions[parentKey]) {
                        copyOptions[parentKey] = {};
                    }
                    
                    copyOptions[parentKey][childKey] = value;
                } else { // All other properties
                    copyOptions[key] = value;
                }
            }
        });

        try {
            console.log(copyOptions);
            response = await copyJobService.postStoredCopyJobTicketHelper(copyOptions);
            console.log("Ticket helper response: " + JSON.stringify(response));

            if (response.length === 0) {
                props.postAlert('success', 'Copy ticket is valid');
            }
            else {
                var parsedResult = [];
                var temp;

                Object.entries(response).map(([key, value]) => {
                    temp = value.optionName + " has a conflict of type " + value.conflictType + "."

                    if (value.enforcedRule.validValues) {
                        if (value.enforcedRule.validValues.message) {
                            temp = temp.concat(" ", value.enforcedRule.validValues.message)
                        }
                        temp = temp.concat(" ", "Please choose one of the following options: ")
                        value.enforcedRule.validValues.optionValues.forEach(element => {
                            temp = temp.concat(" ", element)
                        })
                    }
                    else if (value.enforcedRule.possibleValues) {
                        temp = temp.concat(" ", "Please choose one of the following options: ")
                        value.enforcedRule.possibleValues.optionValues.forEach(element => {
                            temp = temp.concat(" ", element)
                        })
                    }
                    else if (value.enforcedRule.range) {
                        temp = temp.concat(" ", "Please choose a value from " + value.enforcedRule.range.lowerBoundary
                                                + " to " + value.enforcedRule.range.upperBoundary + " with a step of "
                                                + value.enforcedRule.range.step)
                    }
                    else if (value.enforcedRule.regularExpression) {
                        if (value.enforcedRule.regularExpression.message) {
                            temp = temp.concat(" ", value.enforcedRule.regularExpression.message)
                        }
                    }
                    else if (value.enforcedRule.stringLength) {
                        if (value.enforcedRule.stringLength.message) {
                            temp = temp.concat(" ", value.enforcedRule.stringLength.message)
                        }
                    }
                    parsedResult.push(temp)
                })
                postCopyTicketAlert('error', parsedResult)
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to verify copy job ticket - ' + error.cause.message);
        }
    }

    async function handleReleaseJob() {
        setAlertState({ ...alertState, open: false });

        let request = createReleaseRequest();

        try {
            let response = await copyJobService.releaseStoredJob(props.agentId, props.storedJobId, request);
            console.log("Release Stored Job response: " + JSON.stringify(response));

            if (null != response) {
                props.postAlert('success', 'Released Stored Job - Copy Job ID: ' + response.copyJobId);
            }

            if (null !== props.onReleaseSuccess) {
                props.onReleaseSuccess(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to release stored job - ' + error.cause.message);
        }
    }

    function handleCancelButtonPushed() {
        setJobPassword('');
        if (null !== props.onClose) {
            props.onClose();
        }
    }

    return (
        <Dialog fullWidth maxWidth="md" open={props.open} onClose={props.onClose}>
            <DialogTitle>{"Release Stored Job"}</DialogTitle>
            <CopyTicketAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            {isLoading ? (
                <DialogContent>
                    <Loading message="Loading options..." />
                </DialogContent>
            ) : (
                <>
                    <Grid style={{ marginTop: 10 }} container>
                        <Grid item xs={12}>
                            <Paper elevation={2}>
                                <AppBar position="static" color="inherit">
                                    <Tabs value={value} onChange={handleChange} aria-label="release stored job tabs" {...baseTabStyles}>
                                        <Tab label="Job Password" {...a11yProps(0)} />
                                        <Tab label="Basic Copy Options" {...a11yProps(1)} />
                                        <Tab label="Advanced Copy Options" {...a11yProps(2)} />
                                        <Tab label="Solution Context" {...a11yProps(3)} />
                                    </Tabs>
                                </AppBar>
                                <ViewTabPanel value={value} index={0}>
                                    <JobPasswordTab jobPassword={jobPassword} handlePasswordChange={handlePasswordChange} />
                                </ViewTabPanel>
                                <ViewTabPanel value={value} index={1}>
                                    <BasicOptions usedOptions={usedOptions} profile={profile} />
                                </ViewTabPanel>
                                <ViewTabPanel value={value} index={2}>
                                    <AdvancedOptions usedOptions={usedOptions} profile={profile} />
                                </ViewTabPanel>
                                <ViewTabPanel value={value} index={3}>
                                    <BindableSolutionContext usedOptions={usedOptions} />
                                </ViewTabPanel>
                            </Paper>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit Release Stored Job"
                            secondaryToolTip="Unable to Exit Release Stored Job"
                            secondaryToolTipCondition={true}
                            onClick={handleCancelButtonPushed}
                        />
                        <SDKButton
                            disabled={false}
                            buttonlabel="Get Default Options"
                            primaryToolTip="Gets all the default options from the device"
                            secondaryToolTip="Gets all the default options from the device"
                            secondaryToolTipCondition={false}
                            onClick={handleSetAllDefault}
                        />
                        <SDKButton
                            disabled={false}
                            buttonlabel="Validate Ticket"
                            primaryToolTip="Validate the current copy job ticket"
                            secondaryToolTip="Validate the current copy job ticket"
                            secondaryToolTipCondition={false}
                            onClick={handleValidateTicket}
                        />
                        <SDKButton
                            disabled={false}
                            buttonlabel="Release Job"
                            primaryToolTip="Release the stored job"
                            secondaryToolTip="Release the stored job"
                            secondaryToolTipCondition={true}
                            onClick={handleReleaseJob}
                        />
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}

function JobPasswordTab({ jobPassword, handlePasswordChange }) {
    let classes = useStyles();

    return (
        <React.Fragment>
            <DialogContent>
                <Box
                    mb={2}
                    display="flex"
                    flexDirection="column"
                    height="600px"
                    paddingLeft="10px"
                    paddingRight="10px"
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <Grid container spacing={0} className={classes.textFieldGrid}>
                        <Grid item xs={10}>
                            <CardHeader titleTypographyProps={{ variant: 'h6' }} style={{ marginLeft: "-14px" }}
                                title="Job Password"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} className={classes.dialogTextField}>
                        <Grid item xs={10}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="jobPassword"
                                label="Job Password (Optional)"
                                type="password"
                                value={jobPassword}
                                onChange={handlePasswordChange}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </React.Fragment>
    );
}

function Option({ value, usedOptions }) {
    const [currentValue, setCurrentValue] = useState();
    const [waitingUseEffect, setWaitingUseEffect] = useState(true);
    var rulesIndex = 0;
    let classes = useStyles();

    getRulesIndex();

    useEffect(() => {
        setWaitingUseEffect(true);
        if (value.rules.length === 0 || value.isAvailable === false)
            return null

        if (value.rules[rulesIndex].possibleValues != null && value.rules[rulesIndex].possibleValues.optionValues.length > 0) {
            if (usedOptions.current[value.optionName]) {
                setCurrentValue(usedOptions.current[value.optionName])
            }
            else {
                setCurrentValue(value.rules[rulesIndex].possibleValues.optionValues[0]);
            }
        } 
        else if (value.rules[rulesIndex].range != null) {
            if (usedOptions.current[value.optionName]) {
                setCurrentValue(usedOptions.current[value.optionName])
            }
            else {
                setCurrentValue(value.rules[rulesIndex].range.lowerBoundary)
            }

        }
        else if (value.rules[rulesIndex].isBool != null) {
            if (usedOptions.current[value.optionName] === false || usedOptions.current[value.optionName] === true) {
                setCurrentValue(usedOptions.current[value.optionName])
            }
            else {
                setCurrentValue(true)
            }

        }
        usedOptions.current[value.optionName] = currentValue;
        setWaitingUseEffect(false);
    }, [value]);

    useEffect(() => {
        if(currentValue !== null || currentValue !== undefined)
            usedOptions.current[value.optionName] = currentValue;
    }, [currentValue])

    const handleNumberValue = (event) => {
        if (event.target.value === "" || (event.target.value >= value.rules[rulesIndex].range.lowerBoundary &&
            event.target.value <= value.rules[rulesIndex].range.upperBoundary)) {
            setCurrentValue(parseInt(event.target.value));
        }
    }

    const handleOnBlur = (event) => {
        if (event.target.value === "") {
            setCurrentValue(value.rules[rulesIndex].range.lowerBoundary);
        }
    }

    function getRulesIndex() {
        for (let i = 0; i < value.rules.length; i++) {
            if (value.rules[i].possibleValues != null) {
                rulesIndex = i;
            }
            else if (value.rules[i].range != null) {
                rulesIndex = i;
            }
            else if (value.rules[i].isBool != null) {
                rulesIndex = i;
            }
        }
    }

    if (value.rules.length === 0 || value.isAvailable === false || rulesIndex === null) {
        return null
    }
    else if (value.rules[rulesIndex].possibleValues != null) {
        return (
            waitingUseEffect ? <Loading message="Loading resource..." /> :
                <Grid container spacing={0} className={classes.dialogTextField}>
                    <Grid item xs={10}>
                        <FormControl fullWidth>
                            <InputLabel variant="outlined" required shrink id={value.optionName + "label"}>{value.optionName}</InputLabel>
                            <Select variant="outlined"
                                fullWidth
                                labelId={value.optionName + "labelID"}
                                id={value.optionName}
                                value={currentValue}
                                label={value.optionName + "label"}
                                onChange={e => setCurrentValue(e.target.value)}
                            >
                                {Object.entries(value.rules[rulesIndex].possibleValues.optionValues).map(([key, value]) => (
                                    <MenuItem key={key} value={value}>{value}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
        );
    }
    else if (value.rules[rulesIndex].range != null) {
        return (
            waitingUseEffect ? <Loading message="Loading resource..." /> :
                <Grid container spacing={0} className={classes.dialogTextField}>
                    <Grid item xs={10}>
                        <TextField variant="outlined" required fullWidth
                            id={value.optionName}
                            label={value.optionName + " (" + value.rules[rulesIndex].range.lowerBoundary + " - " + value.rules[rulesIndex].range.upperBoundary + ")"}
                            type="number"
                            value={currentValue}
                            onInput={handleNumberValue}
                            onBlur={handleOnBlur}
                        />
                    </Grid>
                </Grid>
        )
    }
    else if (value.rules[rulesIndex].isBool != null) {
        return (
            waitingUseEffect ? <Loading message="Loading resource..." /> :
            <Grid container spacing={0} className={classes.dialogTextField}>
            <Grid item xs={10}>
                <FormControl fullWidth>
                    <InputLabel variant="outlined" required shrink id={value.optionName + "label"}>{value.optionName}</InputLabel>
                    <Select variant="outlined"
                        fullWidth
                        labelId={value.optionName + "labelID"}
                        id={value.optionName}
                        value={currentValue}
                        label={value.optionName + "label"}
                        onChange={e => setCurrentValue(e.target.value)}
                    >
                        <MenuItem key={true} value={true}>{"true"}</MenuItem>
                        <MenuItem key={false} value={false}>{"false"}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        )
    }
    else {
        return null
    }
}

function BasicOptions({ usedOptions, profile }) {
    let classes = useStyles();
    const commonOptions = [
        "colorMode",
        "contrast",
        "exposureLevel"
    ]

    return (
        <React.Fragment>
            <DialogContent>
                <Box
                    mb={2}
                    display="flex"
                    flexDirection="column"
                    height="600px"
                    paddingLeft="10px"
                    paddingRight="10px"
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <Grid container spacing={0} className={classes.textFieldGrid}>
                        <Grid item xs={10}>
                            <CardHeader titleTypographyProps={{ variant: 'h6' }} style={{ marginLeft: "-14px" }}
                                title="Basic Options"
                            />
                        </Grid>
                    </Grid>
                    {Object.entries(profile).map(([key, value]) => (
                        commonOptions.includes(value.optionName) &&
                        <React.Fragment key={key}>
                            <Option value={value} usedOptions={usedOptions} />
                        </React.Fragment>
                    ))
                    }
                </Box>
            </DialogContent>
        </React.Fragment>
    );
}

function AdvancedOptions({ usedOptions, profile }) {
    let classes = useStyles();
    const commonOptions = [
        "colorMode",
        "contrast",
        "exposureLevel"
    ]

    return (
        <React.Fragment>
            <DialogContent>
                <Box
                    mb={2}
                    display="flex"
                    flexDirection="column"
                    height="600px"
                    paddingLeft="10px"
                    paddingRight="10px"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll"
                    }}
                >
                    <Grid container spacing={0} className={classes.textFieldGrid}>
                        <Grid item xs={10}>
                            <CardHeader titleTypographyProps={{ variant: 'h6' }} style={{ marginLeft: "-14px" }}
                                title="Advanced Options"
                            />
                        </Grid>
                    </Grid>
                    {Object.entries(profile).map(([key, value]) => (
                        !commonOptions.includes(value.optionName) &&
                        <React.Fragment key={key}>
                            <Option value={value} usedOptions={usedOptions} />
                        </React.Fragment>
                    ))
                    }
                </Box>
            </DialogContent>
        </React.Fragment>
    );
}

function CopyTicketAlert(props) {
    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={props.open} autoHideDuration={25000} onClose={props.handleClose}>
            <Alert elevation={6} severity={props.severity} variant="filled" onClose={props.handleClose}>
                Invalid Copy Ticket
                <br/>
                {props.message.map((item) => (
                    <React.Fragment key={item}>
                        <br/>
                        <div>{item}</div>
                    </React.Fragment>
                ))}
            </Alert>
        </Snackbar>
    );
}
