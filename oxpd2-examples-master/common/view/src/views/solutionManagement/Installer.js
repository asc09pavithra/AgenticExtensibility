import { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { red, green, orange, grey } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Loading from '../../common/Loading';
import { InstallerOperations, InstallerOperation } from './InstallerOperations'
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import { AppBar, Tab, Tabs, Paper } from '@mui/material';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    },
    table: {
        minWidth: 450,
    },
    statusChipGood: {
        marginBottom: '0px',
        marginLeft: '0px',
        color: '#fff',
        backgroundColor: green[500]
    },
    statusChipBad: {
        marginBottom: '0px',
        marginLeft: '0px',
        color: '#fff',
        backgroundColor: red[500]
    },
    statusChipWarning: {
        marginBottom: '0px',
        marginLeft: '0px',
        color: '#fff',
        backgroundColor: orange[800]
    },
    statusChipNeutral: {
        marginBottom: '0px',
        marginLeft: '0px',
        color: '#fff',
        backgroundColor: grey[700]
    },
    statusChipIcon: {
        color: '#fff',
    },
}), { defaultTheme: theme });

function InstallerStatusChip(props) {
    const classes = useStyles();

    let chipClass = null;
    let statusLabel = '';

    if (props.status === 'isIdle') {
        chipClass = classes.statusChipGood;
        statusLabel = "Installer is idle";
    }
    else if (props.status === 'isInstalling' || props.status === 'isUninstalling') {
        chipClass = classes.statusChipWarning;
        statusLabel = "Installer is active";
    }
    else {
        chipClass = classes.statusChipNeutral;
        statusLabel = "Installer status unknown";
    }

    return (
        <Chip className={chipClass} label={statusLabel} />
    )
}

function BundleUploadInput(props) {
    const classes = useStyles();
    const [solutionBundleFile, setSolutionBundleFile] = useState({ name: '' });
    const [solutionContextFile, setSolutionContextFile] = useState({ name: '' });

    function handleBundleInputChanged(e) {
        if (e.target.files.length > 0) {
            setSolutionBundleFile(e.target.files[0]);
            if (null !== props.onSolutionBundleFileChanged) {
                props.onSolutionBundleFileChanged(e.target.files[0]);
            }
        }
    };

    function handleContextInputChanged(e) {
        if (e.target.files.length > 0) {
            setSolutionContextFile(e.target.files[0]);
            if (null !== props.onSolutionContextFileChanged) {
                props.onSolutionContextFileChanged(e.target.files[0]);
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
                        id="solution-bundle-select"
                        type="file"
                        onChange={handleBundleInputChanged}
                    />
                    <Grid item style={{ minWidth: '300px' }}>
                        <TextField label="Solution Bundle" variant="outlined" size="small" readOnly fullWidth value={solutionBundleFile.name} />
                    </Grid>
                    <Grid item>
                        <label htmlFor="solution-bundle-select">
                            <SDKButton
                                color="inherit"
                                component="span"
                                disabled={false}
                                buttonlabel="Select..."
                                primaryToolTip="Select A Solution .bdl Bundle"
                                secondaryToolTip="Unable To Select"
                                secondaryToolTipCondition={true}
                                className={classes.root}
                                style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}
                            />
                        </label>
                    </Grid>
                </>
            </Grid>
            <Grid container item xs={12} spacing={3}>
                <>
                    <input
                        accept="*/*"
                        className={classes.root}
                        style={{ display: 'none' }}
                        id="solution-context-select"
                        type="file"
                        onChange={handleContextInputChanged}
                    />
                    <Grid item style={{ minWidth: '300px' }}>
                        <TextField label="Solution Context (Optional)" variant="outlined" size="small" fullWidth value={solutionContextFile.name} />
                    </Grid>
                    <Grid item>
                        <label htmlFor="solution-context-select">
                            <SDKButton
                                color="inherit"
                                component="span"
                                disabled={false}
                                buttonlabel="Select..."
                                primaryToolTip="Select A Solution Context File"
                                secondaryToolTip="Unable To Select"
                                secondaryToolTipCondition={true}
                                className={classes.root}
                                style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}
                            />
                        </label>
                    </Grid>
                </>
            </Grid>
        </Grid>
    );
}

function RemoteSolutionInput(props) {
    const classes = useStyles();

    const [solutionHostAddress, setSolutionHostAddress] = useState('12.27.27.12:5000');
    const [solutionArchivePath, setSolutionArchivePath] = useState('/oxpd2-examples/solution/solution.bdl');
    const [solutionContextPath, setSolutionContextPath] = useState('/oxpd2-examples/solution/context.json');

    const handleSolutionHostAddress = (event) => {
        setSolutionHostAddress(event.target.value);
        if (null !== props.onSolutionHostAddressChanged) {
            props.onSolutionHostAddressChanged(event.target.value);
        }
    }

    const handleSolutionArchivePath = (event) => {
        setSolutionArchivePath(event.target.value);
        if (null !== props.onArchivePathChanged) {
            props.onArchivePathChanged(event.target.value);
        }
    }

    const handleSolutionContextPath = (event) => {
        setSolutionContextPath(event.target.value);
        if (null !== props.onContextPathChanged) {
            props.onContextPathChanged(event.target.value);
        }
    }

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container spacing={0} className={classes.textFieldGrid}>
                <Grid item xs={12}>
                    <TextField className={classes.dialogTextField} style={{ marginTop:"3px", marginBottom:"10px" }} variant="outlined" required fullWidth
                        id="host"
                        label="Solution Host Address:Port"
                        type="text"
                        value={solutionHostAddress}
                        onInput={handleSolutionHostAddress}
                    />
                    <TextField className={classes.dialogTextField} style={{ marginBottom:"10px" }} variant="outlined" required fullWidth
                        id="archivePath"
                        label="Archive Path"
                        type="text"
                        value={solutionArchivePath}
                        onInput={handleSolutionArchivePath}
                    />
                    <TextField className={classes.dialogTextField} style={{ marginBottom:"10px" }} variant="outlined" fullWidth
                        id="contextPath"
                        label="Context Path (optional)"
                        type="text"
                        value={solutionContextPath}
                        onInput={handleSolutionContextPath}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default function Installer(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const installerEnabled = (null !== currentDevice && currentDevice.adminAccessTokenStatus === 'Granted' && null !== currentAccessToken) ? true : false

    const [state, setState] = useState({
        installerStatus: '',
        installerEnabled: installerEnabled,
        installerAvailable: false,
        showInstallDialog: false,
        dialogInstallButtonEnabled: false,
        showUninstallDialog: false,
        dialogUninstallButtonEnabled: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [solutionBundleFile, setSolutionBundleFile] = useState(null);
    const [solutionContextFile, setSolutionContextFile] = useState(null);
    const [uninstallSolutionId, setUninstallSolutionId] = useState('');
    const [selectedOperation, setSelectedOperation] = useState('');
    const [value, setValue] = useState(0);
    const [solutionHostAddress, setSolutionHostAddress] = useState('12.27.27.12:5000');
    const [solutionArchivePath, setSolutionArchivePath] = useState('/oxpd2-examples/solution/solution.bdl');
    const [solutionContextPath, setSolutionContextPath] = useState('/oxpd2-examples/solution/context.json');
    const solutionManagerService = props.service;

    useEffect(() => {
        loadInstaller();
    }, [state.installerEnabled]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 1) {
            setState({ ...state, dialogInstallButtonEnabled: true});
        } else {
            setState({ ...state, dialogInstallButtonEnabled: false});
        }
        setSolutionHostAddress('12.27.27.12:5000');
        setSolutionArchivePath('/oxpd2-examples/solution/solution.bdl');
        setSolutionContextPath('/oxpd2-examples/solution/context.json');
        setSolutionBundleFile(null);
        setSolutionContextFile(null);
    };

    async function handleLoadClicked() {
        loadInstaller();
    }

    async function loadInstaller() {
        let response;
        let installerStatus = '';
        let installerAvailable = false;

        setIsLoading(true);

        try {
            response = await solutionManagerService.getInstaller();
            installerStatus = (response && 'status' in response) ? response.status : '';
            installerAvailable = (installerStatus === 'isIdle' ? true : false);
            setIsLoaded(true);
        }
        catch (error) {
            props.postAlert('error', 'Failed to retrieve installer resource - ' + error.cause.message);
        }

        setState({ ...state, installerStatus: installerStatus, installerAvailable: installerAvailable });
        setIsLoading(false);
    }

    async function handleInstallDialogCancel() {
        setState({ ...state, dialogInstallButtonEnabled: false, showInstallDialog: false });
        setValue(0);
    }

    async function handleInstallDialogExecute() {
        let response;
        try {
            if (value === 0) {
                response = await solutionManagerService.installPushSolution(solutionBundleFile, solutionContextFile);
                console.log(JSON.stringify(response));
                props.postAlert('success', 'Push Install request successful!');
            } else if (value === 1) {
                response = await solutionManagerService.installPullSolution(solutionHostAddress, solutionArchivePath, solutionContextPath);
                console.log(JSON.stringify(response));
                props.postAlert('success', 'Pull Install request successful!');
            }
        }
        catch (error) {
            props.postAlert('error', 'Failed to retrieve installer resource - ' + error.cause.message);
        }

        setState({ ...state, showInstallDialog: false });
    }

    async function handleInstallClicked() {
        setSolutionBundleFile(null);
        setSolutionContextFile(null);
        setState({ ...state, dialogInstallButtonEnabled: false, showInstallDialog: true });
    }

    function handleSolutionBundleFileChanged(file) {
        if (null !== file) {
            console.log('selected solution bundle: ' + file.name);
            setState({ ...state, dialogInstallButtonEnabled: true });
            setSolutionBundleFile(file);
        }
    }

    function handleSolutionContextFileChanged(file) {
        if (null !== file) {
            console.log('selected solution context: ' + file.name);
            setSolutionContextFile(file);
        }
    }

    async function handleUninstallClicked() {
        setState({ ...state, showUninstallDialog: true });
    }

    async function handleUninstallDialogCancel() {
        setState({ ...state, showUninstallDialog: false });
    }

    async function handleUninstallDialogExecute() {
        let response;
        try {
            response = await solutionManagerService.uninstallSolution(uninstallSolutionId);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Uninstall request successful!');
        }
        catch (error) {
            props.postAlert('error', 'Failed to initiate uninstall operation - ' + error.cause.message);
        }

        setState({ ...state, showUninstallDialog: false });
    }

    function handleUninstallSolutionIdChanged(e) {
        setUninstallSolutionId(e.target.value);
        setState({ ...state, dialogUninstallButtonEnabled: (e.target.value.length > 0) });
    }

    function handleSolutionHostAddressChanged(value) {
        setSolutionHostAddress(value);
        setState({ ...state, dialogInstallButtonEnabled: (value.length > 0 && solutionArchivePath.length > 0) });
    }

    function handleArchivePathChanged(value) {
        setSolutionArchivePath(value);
        setState({ ...state, dialogInstallButtonEnabled: (value.length > 0 && solutionHostAddress.length > 0) });
    }

    function handleContextPathChanged(value) {
        setSolutionContextPath(value);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2" paragraph={true}>Installer Resource</Typography>
                        {
                            isLoading ? <Loading message="Loading resource..." /> :
                                <InstallerStatusChip status={state.installerStatus} />
                        }
                        <Dialog fullWidth={true} maxWidth="sm" open={state.showInstallDialog} onClose={handleInstallDialogCancel}>
                            <DialogTitle>Install Solution</DialogTitle>
                            <DialogContent>
                                <Paper style={{ backgroundColor: grey[50] }}>
                                    <AppBar position="static" style={{ backgroundColor: grey[50] }}>
                                        <Tabs value={value} onChange={handleTabChange} aria-label="Solution Isntaller Tabs" {...baseTabStyles}>
                                            <Tab label="Push" {...a11yProps(0)} style={{ paddingLeft: '60px', paddingRight: '60px' }} />
                                            <Tab label="Pull" {...a11yProps(1)} style={{ paddingLeft: '60px', paddingRight: '60px' }} />
                                        </Tabs>
                                    </AppBar>
                                </Paper>
                                <ViewTabPanel value={value} index={0}>
                                    <Grid style={{ height: '150px' }}>
                                        <DialogContentText style={{ marginBottom: '10px' }}>
                                            Select a solution bundle to install:
                                        </DialogContentText>
                                        <BundleUploadInput onSolutionBundleFileChanged={handleSolutionBundleFileChanged} onSolutionContextFileChanged={handleSolutionContextFileChanged} />
                                    </Grid>
                                </ViewTabPanel>
                                <ViewTabPanel value={value} index={1}>
                                    <Grid style={{ height: '175px' }}>
                                        <RemoteSolutionInput onSolutionHostAddressChanged={handleSolutionHostAddressChanged} onArchivePathChanged={handleArchivePathChanged} onContextPathChanged={handleContextPathChanged}/>
                                    </Grid>
                                </ViewTabPanel>
                            </DialogContent>
                            <DialogActions>
                                <SDKButton
                                    disabled={false}
                                    buttonlabel="Cancel"
                                    primaryToolTip="Exit This View"
                                    secondaryToolTip="Unable To Exit"
                                    secondaryToolTipCondition={true}
                                    onClick={handleInstallDialogCancel}
                                />
                                <SDKButton
                                    disabled={!state.dialogInstallButtonEnabled}
                                    buttonlabel="Install"
                                    primaryToolTip="Install Solution"
                                    secondaryToolTip="Required Fields Missing"
                                    secondaryToolTipCondition={state.dialogInstallButtonEnabled}
                                    onClick={handleInstallDialogExecute}
                                />
                            </DialogActions>
                        </Dialog>
                        <Dialog fullWidth={true} maxWidth="sm" open={state.showUninstallDialog} onClose={handleUninstallDialogCancel}>
                            <DialogTitle>Uninstall Solution</DialogTitle>
                            <DialogContent style={{ height: '150px' }}>
                                <DialogContentText>
                                    Specify the solution to uninstall:
                                </DialogContentText>
                                <TextField margin="dense" onChange={handleUninstallSolutionIdChanged} value={state.uninstallSolutionId} name="solutionId" variant="outlined" size="small" fullWidth label="SolutionId" />
                            </DialogContent>
                            <DialogActions>
                                <SDKButton
                                    disabled={false}
                                    buttonlabel="Cancel"
                                    primaryToolTip="Exit This View"
                                    secondaryToolTip="Unable To Exit"
                                    secondaryToolTipCondition={true}
                                    onClick={handleUninstallDialogCancel}
                                />
                                <SDKButton
                                    disabled={!state.dialogUninstallButtonEnabled}
                                    buttonlabel="Uninstall"
                                    primaryToolTip="Uninstall Solution"
                                    secondaryToolTip="Solution Not Specified"
                                    secondaryToolTipCondition={state.dialogUninstallButtonEnabled}
                                    onClick={handleUninstallDialogExecute}
                                />
                            </DialogActions>
                        </Dialog>
                    </CardContent>
                    <CardActions>
                        <LoadRefreshButton data-testid="installer-refresh-button" onClick={handleLoadClicked} isLoading={isLoading} location="Solutions Installer" />
                        <SDKButton
                            data-testid="installer-install-solution-button"
                            color="inherit"
                            disabled={!state.installerAvailable}
                            buttonlabel="Install Solution"
                            primaryToolTip="Install A New Solution"
                            secondaryToolTip="Installer Is Unavailable"
                            secondaryToolTipCondition={state.installerAvailable}
                            onClick={handleInstallClicked}
                            sx={{ borderColor: grey[400] }}
                        />
                        <SDKButton
                            data-testid="installer-uninstall-solution-button"
                            color="inherit"
                            disabled={!state.installerAvailable}
                            buttonlabel="Uninstall Solution"
                            primaryToolTip="Uninstall A Solution"
                            secondaryToolTip="Installer Is Unavailable"
                            secondaryToolTipCondition={state.installerAvailable}
                            onClick={handleUninstallClicked}
                            sx={{ borderColor: grey[400] }}
                        />
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12}>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                    <InstallerOperations isLoaded={isLoaded} service={solutionManagerService} postAlert={props.postAlert} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />
                }
            </Grid>
            <Grid item xs={12}>
                <InstallerOperation service={solutionManagerService} postAlert={props.postAlert} operationId={selectedOperation} />
            </Grid>

        </Grid>
    );
}
