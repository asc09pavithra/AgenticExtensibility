import React, { useEffect, useState, useRef } from 'react';
import { CardHeader, TextField, Dialog, DialogTitle, DialogActions, Snackbar, DialogContent, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import SDKButton from '../../common/SDKButton';
import Loading from '../../common/Loading';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import BindableSolutionContext from '../../common/BindableSolutionContext';
import AppAlert from '../../common/AppAlert';

export default function CreateScanJobDialog(props) {
    const [value, setValue] = useState(0);
    const [defaultOptions, setDefaultOptions] = useState({});
    const [profile, setProfile] = useState({});
    const scanJobService = props.service;
    const usedOptions = useRef(
        {
            "destinationType": "http",
            "host": "12.27.27.12:5000",
            "path": "/oxpd2-examples/api/scanjobagent/scanJobReceiver",
            "scheme": "http",
            "networkOptions": {
                "credential": {
                    "domain": {
                        "expression": {
                            "expressionPattern": ""
                        }
                    },
                    "password": {
                        "expression": {
                            "expressionPattern": ""
                        }
                    },
                    "userName": {
                        "expression": {
                            "expressionPattern": ""
                        }
                    }
                },
                "credentialSource": "cstSecurityContext",
                "protocol": "nfpSmb",
                "protocolOptions": {
                    "smbOptions": {
                        "uncPath": {
                            "expression": {
                                "expressionPattern": ""
                            }
                        }
                    },
                    "ftpOptions": {
                        "path": {
                            "expression": {
                                "expressionPattern": ""
                            }
                        },
                        "port": {
                            "expression": {
                                "expressionPattern": ""
                            }
                        },
                        "server": {
                            "expression": {
                                "expressionPattern": ""
                            }
                        },
                        "transferMode": {
                            "expression": {
                                "expressionPattern": ""
                            }
                        }
                    }
                }
            },
            "jobStorageOptions": {
                "folderName": "",
                "jobName": "Stored Job Name",
                "jobPassword": "",
                "jobPasswordType": "sjptNone"
            },
            "includeMetadata": false,
            "metadataOptions": {
                "fileContent": {},
                "fileContentType": {"expression" : {"expressionPattern" : ""}},
                "fileName": {}
            }
        }
    );

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postScanTicketAlert(severity, message) {
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

    useEffect(() => {
        if (props.state.showCreateScanJob) {
            loadDefaultOptionsAndProfile();
        }
    }, [props.state.showCreateScanJob]);

    async function loadDefaultOptionsAndProfile() {
        let defaultOptions;
        let scanProfile;

        // These options are bools in the scan profile
        const booleanOptions = [
            "autoDeskew",
            "autoExposure",
            "backgroundColorRemoval",
            "backgroundNoiseRemoval",
            "blackBackground",
            "descreen",
            "edgeToEdgeScan",
            "invertColors",
            "longPlotScan",
            "misfeedDetection",
            "misfeedDetectionAutoRetry",
            "outputFileCompression",
            "outputFileEncryption"
        ]

        const stringOptions = [
            "encryptionPassword"
        ]

        try {
            defaultOptions = await scanJobService.getDefaultOptions();
            scanProfile = await scanJobService.getScanProfile();
            if (defaultOptions !== null) {
                setDefaultOptions(defaultOptions.http);
                Object.entries(defaultOptions.http).map(([key, value]) => {
                    if (typeof value != "object" || key === "fileName") {
                        usedOptions.current[key] = value;
                    } else {
                        usedOptions.current[key] = ""
                    }

                })
            }

            if (scanProfile !== null) {

                scanProfile.base.definitions.forEach(item => {
                    if (booleanOptions.includes(item.optionName)) {
                        item.rules.push({ "isBool": true })
                    }
                    else if(stringOptions.includes(item.optionName)) {
                        item.rules.push({ "isString": true })
                    }
                });

                // Profile does not return fileName
                scanProfile.base.definitions.push({
                    "optionName": "fileName",
                    "isAvailable": true,
                    "rules": [
                        {
                            "possibleValues": {
                                "optionValues": ["Default"]
                            }
                        }
                    ]
                })
                // Sorting scan profile for easier viewing.
                scanProfile.base.definitions.sort(function (a, b) {
                    var textA = a.optionName.toUpperCase();
                    var textB = b.optionName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                setProfile(scanProfile.base.definitions);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve default options and/or profile - ' + error.cause.message);
        }
    }

    async function handleSetallDefault() {
        loadDefaultOptionsAndProfile();
    }

    function createTicket() {
        const nonScanOptions = [
            "host",
            "path",
            "scheme",
            "includeMetadata",
            "metadataOptions",
            "destinationType",
            "networkOptions",
            "jobStorageOptions"
        ]
        
        let ticket =
            {
                scanTicket: {
                    destinationOptions: {},
                    scanOptions: {}
                },
            };

        if (usedOptions.current.context !== undefined) {
            ticket.solutionContext = usedOptions.current.context;
        }

        if (usedOptions.current.includeMetadata) {
            ticket.scanTicket.metadataOptions = usedOptions.current.metadataOptions;
        }

        if (usedOptions.current.destinationType === "http") {
            ticket.scanTicket.destinationOptions.http = {
                destination: {
                    host: {
                        explicit: {
                            explicitValue: usedOptions.current.host
                        }
                    },
                    path: {
                        explicit: {
                            explicitValue: usedOptions.current.path
                        }
                    },
                    scheme: usedOptions.current.scheme
                }
            };
        } else if (usedOptions.current.destinationType === "networkFolder") {
            ticket.scanTicket.destinationOptions.networkFolder = {
                credentialSource: usedOptions.current.networkOptions.credentialSource,
                protocol: usedOptions.current.networkOptions.protocol,
                protocolOptions: {}
            }

            if (ticket.scanTicket.destinationOptions.networkFolder.protocol === "nfpSmb") {
                ticket.scanTicket.destinationOptions.networkFolder.protocolOptions.smbOptions = usedOptions.current.networkOptions.protocolOptions.smbOptions;
            } else if (ticket.scanTicket.destinationOptions.networkFolder.protocol === "nfpFtp") {
                ticket.scanTicket.destinationOptions.networkFolder.protocolOptions.ftpOptions = usedOptions.current.networkOptions.protocolOptions.ftpOptions;
            }

            if (ticket.scanTicket.destinationOptions.networkFolder.credentialSource === "cstProvided") {
                ticket.scanTicket.destinationOptions.networkFolder.credential = {}
                if (usedOptions.current.networkOptions.credential.domain.expression.expressionPattern !== "") {
                    ticket.scanTicket.destinationOptions.networkFolder.credential.domain = usedOptions.current.networkOptions.credential.domain;
                }
                ticket.scanTicket.destinationOptions.networkFolder.credential.password = usedOptions.current.networkOptions.credential.password;
                ticket.scanTicket.destinationOptions.networkFolder.credential.userName = usedOptions.current.networkOptions.credential.userName;
            }
        } else if (usedOptions.current.destinationType === "jobStorage") {
            ticket.scanTicket.destinationOptions.jobStorage = {
                jobName: {
                    explicit: {
                        explicitValue: usedOptions.current.jobStorageOptions.jobName
                    }
                },
                jobPasswordType: {
                    explicit: {
                        explicitValue: usedOptions.current.jobStorageOptions.jobPasswordType
                    }
                }
            };

            if (usedOptions.current.jobStorageOptions.folderName && usedOptions.current.jobStorageOptions.folderName !== "") {
                ticket.scanTicket.destinationOptions.jobStorage.folderName = {
                    explicit: {
                        explicitValue: usedOptions.current.jobStorageOptions.folderName
                    }
                };
            }

            if (usedOptions.current.jobStorageOptions.jobPassword && usedOptions.current.jobStorageOptions.jobPassword !== "") {
                ticket.scanTicket.destinationOptions.jobStorage.jobPassword = {
                    explicit: {
                        explicitValue: usedOptions.current.jobStorageOptions.jobPassword
                    }
                };
            }
        }

        Object.entries(usedOptions.current).map(([key, value]) => {
            if (value !== null && value !== "" && usedOptions.current[key] !== undefined && !nonScanOptions.includes(key)) {
                ticket.scanTicket.scanOptions[key] = usedOptions.current[key]
            }
        })
    
        if (usedOptions.current.includeRetryOptions) {
            ticket.scanTicket.retryOptions = {
                maxRetryAttempts: usedOptions.current.maxRetryAttempts,
                retryInterval: usedOptions.current.retryInterval
            };
        }
    
        return ticket
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    async function handleValidateTicket() {
        // ToDo Implement the ticket validator after its been added to the example project
        let response
        let ticket = createTicket()
        try {
            console.log(ticket.scanTicket.scanOptions)
            response = await scanJobService.postScanJobTicketHelper(ticket.scanTicket.scanOptions)
            console.log("Ticket helper response: " + JSON.stringify(response))

            if (response.length === 0) {
                props.postAlert('success', 'Scan ticket is valid');
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
                postScanTicketAlert('error', parsedResult)
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to verify scan job ticket - ' + error.cause.message);
        }
    }

    async function handleStartJob() {
        setAlertState({ ...alertState, open: false });

        let ticket = createTicket()

        try {
            let response = await scanJobService.createScanJob(props.agentId, ticket)
            console.log("create ScanJob response- " + JSON.stringify(response));

            if (null != response) {
                props.setSelectedScanJob(response.scanJobId);
                props.postAlert('success', 'Created Scan Job');

                usedOptions.current = {
                    "destinationType": "http",
                    "host": "12.27.27.12:5000",
                    "path": "/oxpd2-examples/api/scanjobagent/scanJobReceiver",
                    "scheme": "http",
                    "networkOptions": {
                        "credential": {
                            "domain": {
                                "expression": {
                                    "expressionPattern": ""
                                }
                            },
                            "password": {
                                "expression": {
                                    "expressionPattern": ""
                                }
                            },
                            "userName": {
                                "expression": {
                                    "expressionPattern": ""
                                }
                            }
                        },
                        "credentialSource": "cstSecurityContext",
                        "protocol": "nfpSmb",
                        "protocolOptions": {
                            "smbOptions": {
                                "uncPath": {
                                    "expression": {
                                        "expressionPattern": ""
                                    }
                                }
                            },
                            "ftpOptions": {
                                "path": {
                                    "expression": {
                                        "expressionPattern": ""
                                    }
                                },
                                "port": {
                                    "expression": {
                                        "expressionPattern": ""
                                    }
                                },
                                "server": {
                                    "expression": {
                                        "expressionPattern": ""
                                    }
                                },
                                "transferMode": {
                                    "expression": {
                                        "expressionPattern": ""
                                    }
                                }
                            }
                        }
                    },
                    "jobStorageOptions": {
                        "folderName": "",
                        "jobName": "Stored Job Name",
                        "jobPassword": "",
                        "jobPasswordType": "sjptNone"
                    },
                    "includeRetryOptions": false,
                    "includeMetadata": false,
                    "metadataOptions": {
                        "fileContent": {},
                        "fileContentType": {"expression" : {"expressionPattern" : ""}},
                        "fileName": {}
                    }
                }
            }

            if (null !== props.onStartScanClose) {
                props.onStartScanClose();
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to create Scan Job  - ' + error.cause.message);
        }
        
    }

    function handleCancelButtonPushed() {
        if (null !== props.onClose) {
            props.onClose();
        }
    }

    return (
        <React.Fragment>
            <ScanTicketAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            { Object.entries(defaultOptions).length === 0 || Object.entries(profile).length === 0 ? 
                <AppAlert open={props.open} handleClose={props.onClose} severity={'error'} message={'Unable to create Scan Job Ticket. Please verify a solution is installed with an active solution token.'} />
            :
            <Dialog fullWidth maxWidth="lg" open={props.open} onClose={props.onClose}>
                <DialogTitle>{"Create New Scan Job"}</DialogTitle>
                <Grid style={{ marginTop: 10 }} container>
                    <Grid item xs={12}>
                        <Paper elevation={2}>
                            <AppBar position="static" color="inherit">
                                <Tabs value={value} onChange={handleChange} aria-label="scan job agents" {...baseTabStyles}>
                                    <Tab label="Destination" {...a11yProps(0)} />
                                    <Tab label="Basic Scan Options" {...a11yProps(1)} />
                                    <Tab label="Advanced Scan Options" {...a11yProps(2)} />
                                    <Tab label="Solution Context" {...a11yProps(3)} />
                                    <Tab label="Metadata Options" {...a11yProps(4)} />
                                    <Tab label="Retry Options" {...a11yProps(5)} />
                                </Tabs>
                            </AppBar>
                            <ViewTabPanel value={value} index={0}>
                                <Destination usedOptions={usedOptions} />
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
                            <ViewTabPanel value={value} index={4}>
                                <MetadataOptions usedOptions={usedOptions} />
                            </ViewTabPanel>
                            <ViewTabPanel value={value} index={5}>
                                <RetryOptions usedOptions={usedOptions} />
                            </ViewTabPanel>
                        </Paper>
                    </Grid>
                </Grid>
                <DialogActions>
                    <SDKButton
                        disabled={false}
                        buttonlabel="Cancel"
                        primaryToolTip="Exit Create Scan Job"
                        secondaryToolTip="Unable to Exit Create Scan Job"
                        secondaryToolTipCondition={true}
                        onClick={handleCancelButtonPushed}
                    />
                    <SDKButton
                        disabled={false}
                        buttonlabel="Get Default Options"
                        primaryToolTip="Gets all the default options from the device"
                        secondaryToolTip="Gets all the default options from the device"
                        secondaryToolTipCondition={false}
                        onClick={handleSetallDefault}
                    />
                    <SDKButton
                        disabled={false}
                        buttonlabel="Validate Ticket"
                        primaryToolTip="Get the default options for scan jobs"
                        secondaryToolTip="Get the default options for scan job"
                        secondaryToolTipCondition={false}
                        onClick={handleValidateTicket}
                    />
                    <SDKButton
                        disabled={false}
                        buttonlabel="Start Job"
                        primaryToolTip="Start a new Scan Job"
                        secondaryToolTip="Missing Fields"
                        secondaryToolTipCondition={true}
                        onClick={handleStartJob}
                    />
                </DialogActions>
            </Dialog>
            }
        </React.Fragment>
    );
}


function ScanTicketAlert(props) {
    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={props.open} autoHideDuration={25000} onClose={props.handleClose}>
            <Alert elevation={6} severity={props.severity} variant="filled" onClose={props.handleClose}>
                Invalid Scan Ticket
                <br/>
                {props.message.map((item) => (
                    <React.Fragment>
                    <br/>
                    <div key={item}>{item}</div>
                    </React.Fragment>
                ))}
            </Alert>
        </Snackbar>
    );
}

function Destination({ usedOptions }) {
    let classes = useStyles();
    const [destinationType, setDestinationType] = useState(usedOptions.current.destinationType);
    const [host, setHost] = useState(usedOptions.current.host);
    const [path, setPath] = useState(usedOptions.current.path);
    const [scheme, setScheme] = useState(usedOptions.current.scheme);
    const [credentialSource, setCredentialSource] = useState(usedOptions.current.networkOptions.credentialSource);
    const [protocol, setProtocol] = useState(usedOptions.current.networkOptions.protocol);
    const [domain, setDomain] = useState(usedOptions.current.networkOptions.credential.domain.expression.expressionPattern);
    const [username, setUsername] = useState(usedOptions.current.networkOptions.credential.userName.expression.expressionPattern);
    const [password, setPassword] = useState(usedOptions.current.networkOptions.credential.password.expression.expressionPattern);
    const [uncPath, setUncPath] = useState(usedOptions.current.networkOptions.protocolOptions.smbOptions.uncPath.expression.expressionPattern);
    const [ftpPath, setFtpPath] = useState(usedOptions.current.networkOptions.protocolOptions.ftpOptions.path.expression.expressionPattern);
    const [ftpPort, setFtpPort] = useState(usedOptions.current.networkOptions.protocolOptions.ftpOptions.port.expression.expressionPattern);
    const [server, setServer] = useState(usedOptions.current.networkOptions.protocolOptions.ftpOptions.server.expression.expressionPattern);
    const [transferMode, setTransferMode] = useState(usedOptions.current.networkOptions.protocolOptions.ftpOptions.transferMode.expression.expressionPattern);
    const [folderName, setFolderName] = useState(usedOptions.current.jobStorageOptions.folderName);
    const [jobName, setJobName] = useState(usedOptions.current.jobStorageOptions.jobName);
    const [jobPassword, setJobPassword] = useState(usedOptions.current.jobStorageOptions.jobPassword);
    const [jobPasswordType, setJobPasswordType] = useState(usedOptions.current.jobStorageOptions.jobPasswordType);

    const handleHost = (event) => {
        setHost(event.target.value);
        usedOptions.current.host = event.target.value;
    }

    const handlePath = (event) => {
        setPath(event.target.value);
        usedOptions.current.path = event.target.value;
    }

    const handleScheme = (event) => {
        setScheme(event.target.value);
        usedOptions.current.scheme = event.target.value;
    }

    const handleDestinationType = (event) => {
        setDestinationType(event.target.value);
        usedOptions.current.destinationType = event.target.value;
    }

    const handleCredentialSource = (event) => {
        setCredentialSource(event.target.value);
        usedOptions.current.networkOptions.credentialSource = event.target.value;
    }

    const handleProtocol = (event) => {
        setProtocol(event.target.value);
        usedOptions.current.networkOptions.protocol = event.target.value;
    }

    const handleDomain = (event) => {
        setDomain(event.target.value);
        usedOptions.current.networkOptions.credential.domain.expression.expressionPattern = event.target.value;
    }

    const handleUsername = (event) => {
        setUsername(event.target.value);
        usedOptions.current.networkOptions.credential.userName.expression.expressionPattern = event.target.value;
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
        usedOptions.current.networkOptions.credential.password.expression.expressionPattern = event.target.value;
    }

    const handleUncPath = (event) => {
        setUncPath(event.target.value);
        usedOptions.current.networkOptions.protocolOptions.smbOptions.uncPath.expression.expressionPattern = event.target.value;
    }

    const handleFtpPath = (event) => {
        setFtpPath(event.target.value);
        usedOptions.current.networkOptions.protocolOptions.ftpOptions.path.expression.expressionPattern = event.target.value;
    }

    const handleFtpPort = (event) => {
        setFtpPort(event.target.value);
        usedOptions.current.networkOptions.protocolOptions.ftpOptions.port.expression.expressionPattern = event.target.value;
    }

    const handleServer = (event) => {
        setServer(event.target.value);
        usedOptions.current.networkOptions.protocolOptions.ftpOptions.server.expression.expressionPattern = event.target.value;
    }

    const handleTransferMode = (event) => {
        setTransferMode(event.target.value);
        usedOptions.current.networkOptions.protocolOptions.ftpOptions.transferMode.expression.expressionPattern = event.target.value;
    }

    const handleFolderName = (event) => {
        setFolderName(event.target.value);
        usedOptions.current.jobStorageOptions.folderName = event.target.value;
    }

    const handleJobName = (event) => {
        setJobName(event.target.value);
        usedOptions.current.jobStorageOptions.jobName = event.target.value;
    }

    const handleJobPassword = (event) => {
        setJobPassword(event.target.value);
        usedOptions.current.jobStorageOptions.jobPassword = event.target.value;
    }

    const handleJobPasswordType = (event) => {
        setJobPasswordType(event.target.value);
        usedOptions.current.jobStorageOptions.jobPasswordType = event.target.value;
    }

    return (
        <React.Fragment>
            <DialogContent style={{ height: '450px' }}>
                <Grid container spacing={0} className={classes.textFieldGrid}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel variant="outlined" required shrink id="destination-type">Destination</InputLabel>
                            <Select variant="outlined"
                                labelId="destination-type"
                                id="destination-type"
                                value={destinationType}
                                label="Destination"
                                onChange={handleDestinationType}
                            >
                                <MenuItem value={"http"}>http</MenuItem>
                                <MenuItem value={"networkFolder"}>networkFolder</MenuItem>
                                <MenuItem value={"jobStorage"}>jobStorage</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {destinationType === "http" ?
                        <Grid item xs={12}>
                            <TextField className={classes.dialogTextField} variant="outlined" required fullWidth
                                id="host"
                                label="Solution Host Address:Port"
                                type="text"
                                value={host}
                                onInput={handleHost}
                            />
                            <TextField className={classes.dialogTextField} variant="outlined" required fullWidth
                                id="path"
                                label="Path"
                                type="text"
                                value={path}
                                onInput={handlePath}
                            />
                            <FormControl fullWidth>
                                <InputLabel className={classes.dialogTextField} variant="outlined" required shrink id={"scheme"}>Scheme</InputLabel>
                                <Select variant="outlined"
                                    className={classes.dialogTextField}
                                    fullWidth
                                    labelId="Scheme"
                                    id="scheme"
                                    value={scheme}
                                    label={"Scheme"}
                                    onChange={handleScheme}
                                >
                                    <MenuItem value={"http"}>http</MenuItem>
                                    <MenuItem value={"https"}>https</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        : destinationType === "networkFolder" ?
                        <Grid item xs={12}>
                            <FormControl style={{ marginTop: "10px" }} fullWidth>
                                <InputLabel variant="outlined" required shrink id="credential-source">Credential Source</InputLabel>
                                <Select variant="outlined"
                                    labelId="credential-source"
                                    id="CredentialSource"
                                    value={credentialSource}
                                    label="Credential Source"
                                    onChange={handleCredentialSource}
                                >
                                    <MenuItem value={"cstSecurityContext"}>cstSecurityContext</MenuItem>
                                    <MenuItem value={"cstProvided"}>cstProvided</MenuItem>
                                </Select>
                            </FormControl>
                            {credentialSource === "cstProvided" ?
                                <>
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" fullWidth
                                        id="domain"
                                        label="Domain"
                                        type="text"
                                        value={domain}
                                        onInput={handleDomain}
                                    />
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="userName"
                                        label="Username"
                                        type="username"
                                        value={username}
                                        onInput={handleUsername}
                                    />
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="password"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onInput={handlePassword}
                                    />
                                </>
                            : <></>}
                            <FormControl style={{ marginTop: "10px" }} fullWidth>
                                <InputLabel variant="outlined" required shrink id="protocol">Protocol</InputLabel>
                                <Select variant="outlined"
                                    labelId="protocol"
                                    id="Protocol"
                                    value={protocol}
                                    label="Protocol"
                                    onChange={handleProtocol}
                                >
                                    <MenuItem value={"nfpSmb"}>nfpSmb</MenuItem>
                                    <MenuItem value={"nfpFtp"}>nfpFtp</MenuItem>
                                </Select>
                            </FormControl>
                            {protocol === "nfpSmb" ?
                                <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                    id="uncPath"
                                    label="uncPath"
                                    type="text"
                                    value={uncPath}
                                    onInput={handleUncPath}
                                />
                            :
                                <>
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="server"
                                        label="Server"
                                        type="text"
                                        value={server}
                                        onInput={handleServer}
                                    />
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="ftpPort"
                                        label="Port"
                                        type="text"
                                        value={ftpPort}
                                        onInput={handleFtpPort}
                                    />
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="ftpPath"
                                        label="Path"
                                        type="text"
                                        value={ftpPath}
                                        onInput={handleFtpPath}
                                    />
                                    <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                        id="transferMode"
                                        label="transferMode"
                                        type="text"
                                        value={transferMode}
                                        onInput={handleTransferMode}
                                    />
                                </>
                            }
                        </Grid>
                        : // jobStorage
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField style={{ marginTop: "10px" }} variant="outlined" fullWidth
                                    id="folderName"
                                    label="Folder Name"
                                    type="text"
                                    value={folderName}
                                    onInput={handleFolderName}
                                />
                                <TextField style={{ marginTop: "10px" }} variant="outlined" required fullWidth
                                    id="jobName"
                                    label="Job Name"
                                    type="text"
                                    value={jobName}
                                    onInput={handleJobName}
                                />
                                <TextField style={{ marginTop: "10px" }} variant="outlined" fullWidth
                                    id="jobPassword"
                                    label="Job Password"
                                    type="text"
                                    value={jobPassword}
                                    onInput={handleJobPassword}
                                />
                            </FormControl>
                            <FormControl style={{ marginTop: "10px" }} fullWidth>
                                <InputLabel variant="outlined" required shrink id="jobPasswordType">Job Password Type</InputLabel>
                                <Select variant="outlined"
                                    labelId="jobPasswordType"
                                    id="JobPasswordType"
                                    value={jobPasswordType}
                                    label="Job Password Type"
                                    onChange={handleJobPasswordType}
                                >
                                    <MenuItem value={"sjptNone"}>sjptNone</MenuItem>
                                    <MenuItem value={"sjptNumericPIN"}>sjptNumericPIN</MenuItem>
                                    <MenuItem value={"sjptAlphanumericPIN"}>sjptAlphanumericPIN</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    }
                </Grid>
                <br />

            </DialogContent>
        </React.Fragment>
    )
}

function Option({ value, usedOptions }) {
    const [currentValue, setCurrentValue] = useState();
    const [waitingUseEffect, setWaitingUseEffect] = useState(true);
    var rulesIndex = 0;
    let classes = useStyles();

    getRulesIndex();

    useEffect(() => {
        if (value.rules.length === 0 || value.isAvailable === false)
            return

        if (value.optionName === "fileName" || value.rules[rulesIndex].isString === true) {
            if (usedOptions.current[value.optionName]) {
                setCurrentValue(usedOptions.current[value.optionName])
            }
            else {
                setCurrentValue("");
            }
        }
        else if (value.rules[rulesIndex].possibleValues != null && value.rules[rulesIndex].possibleValues.optionValues.length > 0) {
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
        else if (value.rules[rulesIndex].isBool === true) {
            if (usedOptions.current[value.optionName] !== null && usedOptions.current[value.optionName] !== undefined) {
                setCurrentValue(usedOptions.current[value.optionName])
            }
            else {
                setCurrentValue(false)
            }
        }
        setWaitingUseEffect(false)
    }, [value]);

    useEffect(() => {
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
            else if (value.rules[i].isString != null) {
                rulesIndex = i;
            }
        }
    }

    if (value.rules.length === 0 || value.isAvailable === false || rulesIndex === null)
        return null

    else if (value.optionName === "fileName") {
        return (
            waitingUseEffect ? <Loading message="Loading resource..." /> :
                <Grid container spacing={0} className={classes.dialogTextField}>
                    <Grid item xs={10}>
                        <TextField variant="outlined" required fullWidth
                            id="fileName"
                            label="fileName"
                            type="text"
                            value={currentValue.explicit ? currentValue.explicit.explicitValue || "" : currentValue.expression && currentValue.expression.expressedValue || ""}
                            onInput={e => setCurrentValue(
                                currentValue.explicit ? 
                                {"explicit":{
                                    "explicitValue": e.target.value
                                }}
                                :
                                {"expression":{
                                    "expressedValue": e.target.value
                                }}
                            )}
                        />
                    </Grid>
                </Grid>
        )
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
    else if (value.rules[rulesIndex].isBool === true) {
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
    else if (value.rules[rulesIndex].isString === true) {
        return (
            waitingUseEffect ? <Loading message="Loading resource..." /> :
            <Grid container spacing={0} className={classes.dialogTextField}>
            <Grid item xs={10}>
                <TextField variant="outlined" required fullWidth
                    id={value.optionName}
                    label={value.optionName}
                    type="string"
                    value={currentValue}
                    onInput={e => setCurrentValue(e.target.value)}
                />
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
        "exposureLevel",
        "fileName",
        "mediaSize",
        "mediaSource",
        "mediaType"
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
        "exposureLevel",
        "fileName",
        "mediaSize",
        "mediaSource",
        "mediaType"
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

function MetadataOptions ({usedOptions}) {
    const [includeMetadata, setIncludeMetadata] = useState(usedOptions.current.includeMetadata);

    function handleIncludeMetadataChanged(value) {
        usedOptions.current.includeMetadata = value;
        setIncludeMetadata(value);
    }

    return (
        <React.Fragment>
            <DialogContent>
                <Box
                    mb={2}
                    display="inline"
                    flexDirection="column"
                    height="800px"
                    paddingLeft="10px"
                    paddingRight="10px"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll"
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="includeMetadata"
                                value={includeMetadata}
                                onChange={e => handleIncludeMetadataChanged(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Include Metadata Options"
                    />
                    {includeMetadata ? 
                        <>
                            <MetadataField usedOptions={usedOptions} name="fileContentType" isRequired={true} />
                            <MetadataField usedOptions={usedOptions} name="fileName" isRequired={true} />
                            <MetadataField usedOptions={usedOptions} name="fileContent" isRequired={true} />
                        </>
                        :
                        <></>
                    }
                    
                </Box>
            </DialogContent>
        </React.Fragment>
    )
}

function MetadataField({ usedOptions, name, isRequired, isMultiline }) {
    const [expressionPattern, setExpressionPattern] = useState("");

    const handleExpressionValueChanged = (event) => {
        setExpressionPattern(event.target.value);
        usedOptions.current.metadataOptions[name] = {
            "expression":{
                "expressionPattern": event.target.value
            }
        }
    }

    return (
        <React.Fragment>
            <DialogTitle style={{ marginLeft: '10px', marginBottom: '-20px' }}>{name}</DialogTitle>
            <DialogContent>
                <Grid container spacing={1} alignContent="flex-start" alignItems="center">
                    <Grid container item xs={12} spacing={1}>
                        <TextField variant="outlined" required={isRequired} fullWidth
                            id="expressionPattern"
                            label="expressionPattern"
                            style={{ marginLeft: '10px', marginRight: '10px', marginTop: '10px' }}
                            type="string"
                            value={expressionPattern}
                            onInput={handleExpressionValueChanged}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </React.Fragment>
    );
}
function RetryOptions({ usedOptions }) {
    const [includeRetryOptions, setIncludeRetryOptions] = useState(usedOptions.current.includeRetryOptions);
    const [maxRetryAttempts, setMaxRetryAttempts] = useState(usedOptions.current.maxRetryAttempts || "");
    const [retryInterval, setRetryInterval] = useState(usedOptions.current.retryInterval || "");

    function handleRetryOptionsChanged(value) {
        usedOptions.current.includeRetryOptions = value;
        setIncludeRetryOptions(value);
    }

    const handlemMaxRetryChange = (event) => {
        if (event.target.value === "" || (event.target.value >= 1 && event.target.value <= 5)) {
            const value = parseInt(event.target.value);
            setMaxRetryAttempts(value);
            usedOptions.current.maxRetryAttempts = value;
        }
    }

    const handleretryIntervalChange = (event) => {
        if (event.target.value === "" || (event.target.value >= 1 && event.target.value <= 300)) {
            const value = parseInt(event.target.value);
            setRetryInterval(value);
            usedOptions.current.retryInterval = value;
        }
    }

    return (
        <React.Fragment>
            <DialogContent>
                <Box
                    mb={2}
                    display="inline"
                    flexDirection="column"
                    height="800px"
                    paddingLeft="10px"
                    paddingRight="10px"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll"
                    }}
                >
                    <FormControlLabel
                        control={<Checkbox id="includeRetryOptions" checked={includeRetryOptions} onChange={e => handleRetryOptionsChanged(e.target.checked)} color="primary" />}
                        label="Include Retry Options"
                    />
                    {includeRetryOptions ? 
                        <Grid container spacing={2}>
                            <Grid item xs={12} style={{ marginTop: '16px' }}>
                                <TextField variant="outlined" required fullWidth
                                    id={"maxRetryAttempts"}
                                    label={"maxRetryAttempts (1 - 5)"}
                                    type="number"
                                    value={maxRetryAttempts}
                                    onInput={handlemMaxRetryChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField variant="outlined" required fullWidth
                                    id={"retryInterval"}
                                    label={"retryInterval (1 - 300)"}
                                    type="number"
                                    value={retryInterval}
                                    onInput={handleretryIntervalChange}
                                />
                            </Grid>
                        </Grid>
                        :
                        <></>
                    }
                </Box>
            </DialogContent>
        </React.Fragment>
    );
}
