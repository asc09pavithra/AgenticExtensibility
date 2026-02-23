import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeviceManagementService from '../../services/DeviceManagementService';
import { DeviceContext } from '../../common/DeviceContext';
import Box from '@mui/material/Box';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { red, green, grey } from '@mui/material/colors';
import { Link, LinkOff, VpnKey } from '@mui/icons-material';
import AppAlert from '../../common/AppAlert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Loading from '../../common/Loading';
import SDKButton from '../../common/SDKButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {

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
    deviceInfo: {
        minHeight: '200px',
        maxHeight: '200px'
    },
    statusChipGood: {
        marginBottom: '20px',
        marginLeft: '10px',
        color: '#fff',
        backgroundColor: green[500]
    },
    statusChipBad: {
        marginBottom: '20px',
        marginLeft: '10px',
        color: '#fff',
        backgroundColor: red[500]
    },
    statusChipNeutral: {
        marginBottom: '20px',
        marginLeft: '10px',
        color: '#fff',
        backgroundColor: grey[700]
    },
    statusChipIcon: {
        color: '#fff !important',
    },
    servicesDiscovery: {
        minHeight: '300px',
        maxHeight: '300px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function DeviceServicesDiscovery(props) {
    const deviceContext = useContext(DeviceContext);
    const [servicesDiscovery, setServicesDiscovery] = useState('');
    const classes = useStyles();

    //TODO - Cleanup handling of services (construction, api-root, etc.)
    let deviceManagementService = new DeviceManagementService('http://localhost:5000/oxpd2-examples/api');

    async function handleRefreshClicked() {
        var result = await deviceManagementService.getDeviceServicesDiscovery();
        setServicesDiscovery(JSON.stringify(result, undefined, 2));
    }

    function disabled() {
        return !(deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === 'bound');
    }

    function secondaryToolTipCondition() {
        return (deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === 'bound');
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Device Services Catalog</Typography>
                <Box className={classes.json + ' ' + classes.servicesDiscovery} m={1}><pre className={classes.fit}>{servicesDiscovery}</pre></Box>
            </CardContent>
            <CardActions>
                <LoadRefreshButton
                    data-testid="device-services"
                    onClick={handleRefreshClicked}
                    isLoading={disabled}
                    location="Device Services Catalog"
                />
                <CopyToClipboard text={servicesDiscovery}>
                    <SDKButton
                        data-testid="copy-services"
                        disabled={disabled}
                        buttonlabel="Copy to clipboard"
                        primaryToolTip="Copy device services catalog api response to clipboard"
                        secondaryToolTip="Device must be bound"
                        secondaryToolTipCondition={secondaryToolTipCondition}
                    />
                </CopyToClipboard>
            </CardActions>
        </Card>
    )
}

function DeviceInformation(props) {
    const deviceContext = useContext(DeviceContext);
    const [deviceInfo, setDeviceInfo] = useState('');
    const classes = useStyles();

    //TODO - Cleanup handling of services (construction, api-root, etc.)
    let deviceManagementService = new DeviceManagementService('http://localhost:5000/oxpd2-examples/api');

    async function handleRefreshClicked() {
        var result = await deviceManagementService.getDeviceInfo();
        setDeviceInfo(JSON.stringify(result, undefined, 2));
    }

    function disabled() {
        return !(deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === 'bound');
    }

    function secondaryToolTipCondition() {
        return (deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === 'bound');
    }

    return (
        <Card data-testid='device-info-card'>
            <CardContent>
                <Typography variant="h5" component="h2">Device Information</Typography>
                <Box className={classes.json + ' ' + classes.deviceInfo} m={1}><pre className={classes.fit}>{deviceInfo}</pre></Box>
            </CardContent>
            <CardActions>
                <LoadRefreshButton
                    data-testid="device-information"
                    onClick={handleRefreshClicked}
                    isLoading={disabled}
                    location="Device Information"
                />
                <CopyToClipboard text={deviceInfo}>
                    <SDKButton
                        data-testid='copy-device-info'
                        disabled={disabled}
                        buttonlabel="Copy to clipboard"
                        primaryToolTip="Copy device information api response to clipboard"
                        secondaryToolTip="Device must be bound"
                        secondaryToolTipCondition={secondaryToolTipCondition}
                    />
                </CopyToClipboard>
            </CardActions>
        </Card>
    )
}

function TargetDevice(props) {
    const classes = useStyles();
    const deviceContext = useContext(DeviceContext);
    const [state, setState] = useState({
        bindNetworkAddress: deviceContext.currentDevice ? deviceContext.currentDevice.networkAddress : '',
        bindEnabled: deviceContext.currentDevice ? true : false,
        unbindEnabled: deviceContext.currentDevice ? true : false,
        getTokenEnabled: deviceContext.currentDevice ? true : false,
        refreshEnabled: deviceContext.currentDevice ? true : false,
        showPasswordGrantDialog: false,
        adminUsername: 'admin',
        adminPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setState({
            ...state,
            bindNetworkAddress: deviceContext.currentDevice ? deviceContext.currentDevice.networkAddress : '',
            bindEnabled: deviceContext.currentDevice ? true : false,
            unbindEnabled: deviceContext.currentDevice ? true : false,
            getTokenEnabled: deviceContext.currentDevice ? true : false,
            refreshEnabled: deviceContext.currentDevice ? true : false,
            showPasswordGrantDialog: false
        });
    }, [deviceContext]);

    //TODO - Cleanup handling of services (construction, api-root, etc.)
    let deviceManagementService = new DeviceManagementService('http://localhost:5000/oxpd2-examples/api');

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    async function handleBindClicked() {
        setIsLoading(true);
        try {
            var result = await deviceManagementService.bindDevice(state.bindNetworkAddress);
            deviceContext.setCurrentDevice(result);
            setState({ ...state, unbindEnabled: true, getTokenEnabled: true, refreshEnabled: true });
        }
        catch (error) {
            postAlert('error', 'Bind failed - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleUnbindClicked() {
        var result = await deviceManagementService.unbindDevice();
        console.log(JSON.stringify(result));
        //hack for now, just assume the server has dropped the device
        deviceContext.setCurrentDevice(null);
        deviceContext.setCurrentAccessToken(null);
        setState({ ...state, bindNetworkAddress: '', unbindEnabled: false, bindEnabled: false, getTokenEnabled: false, refreshEnabled: false });
    }

    async function handlePasswordGrantCancel() {
        setState({ ...state, adminPassword: '', adminUsername: 'admin', showPasswordGrantDialog: false });
    }

    async function handlePasswordGrantExecute() {
        setState({ ...state, showPasswordGrantDialog: false });
        setIsLoading(true);

        try {
            var result = await deviceManagementService.passwordGrant(state.adminUsername, state.adminPassword);

            if (null !== result && 'access_token' in result) {
                // Update the device-context to show token status
                var device = deviceContext.currentDevice;
                deviceContext.setCurrentDevice({ ...device, adminAccessTokenStatus: 'Granted', adminAccessToken: result });
                deviceContext.setCurrentAccessToken(result);
            }
            else {
                var device = deviceContext.currentDevice;
                deviceContext.setCurrentDevice({ ...device, adminAccessTokenStatus: 'Invalid' })
            }
        }
        catch (error) {
            postAlert('error', 'Password grant failed - ' + error.cause.message);
        }

        setIsLoading(false);
        setState({ ...state, showPasswordGrantDialog: false, adminPassword: '' });
    }

    async function handleGetTokenClicked() {
        setState({ ...state, showPasswordGrantDialog: true });
    }

    function handleCredentialFieldChanged(event) {
        if (event.target.name === 'username') {
            setState({ ...state, adminUsername: event.target.value });
        }
        else if (event.target.name === 'password') {
            setState({ ...state, adminPassword: event.target.value });
        }
    }

    function handleNetworkAddressChanged(event) {
        if (event.target.value.length) {
            setState({ ...state, bindNetworkAddress: event.target.value, bindEnabled: true });
        }
        else {
            setState({ ...state, bindNetworkAddress: event.target.value, bindEnabled: false });
        }
    }

    async function handleRefreshTokenStatus() {
        var deviceTokenInfo = await deviceManagementService.getTokens();
        var device = await deviceManagementService.getCurrentDevice();
        if (null === deviceTokenInfo) {
            return;
        }
        var adminTokenInfo = deviceTokenInfo.find(tokens => {
            return tokens.type.toLowerCase() === 'admin'
        });
        var solutionTokenInfo = deviceTokenInfo.find(tokens => {
            return tokens.type.toLowerCase() === 'solution'
        });
        var uiContextTokenInfo = deviceTokenInfo.find(tokens => {
            return tokens.type.toLowerCase() === 'ui_context' || tokens.type.toLowerCase() ==='uicontext'
        });
        setState({
            ...state,
            bindNetworkAddress: device ? device.networkAddress : '',
            bindEnabled: device ? true : false,
            unbindEnabled: device ? true : false,
            getTokenEnabled: device ? true : false,
            refreshEnabled: device ? true : false,
            showPasswordGrantDialog: false
        });
        deviceContext.setCurrentAccessToken(adminTokenInfo.token);
        deviceContext.setCurrentDevice({
            ...device, adminAccessTokenStatus: adminTokenInfo.status, solutionAccessTokenStatus: solutionTokenInfo.status, uiContextAccessTokenStatus: uiContextTokenInfo.status,
            adminAccessToken: adminTokenInfo.token, solutionAccessToken: solutionTokenInfo.token, uiContextAccessToken: uiContextTokenInfo.token, bindStatus: device ? device.bindStatus : 'unbound', networkAddress: device ? device.networkAddress : ''
        });
    }

    let bindChip = null;
    if (deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === 'bound') {
        bindChip = <Chip className={classes.statusChipGood} icon={<Link className={classes.statusChipIcon} />} label='Device Bound' />
    }
    else {
        bindChip = <Chip className={classes.statusChipNeutral} icon={<LinkOff className={classes.statusChipIcon} />} label='No Device Bound' />
    }

    let adminChip = null;
    if (null === deviceContext.currentDevice || deviceContext.currentDevice.adminAccessTokenStatus === 'None') {
        adminChip = <Chip className={classes.statusChipNeutral} icon={<VpnKey className={classes.statusChipIcon} />} label='No Admin Token' />
    }
    else if (deviceContext.currentDevice.adminAccessTokenStatus === 'Granted') {
        adminChip = <Chip className={classes.statusChipGood} icon={<VpnKey className={classes.statusChipIcon} />} label='Valid Admin Token' />
    }
    else {
        adminChip = <Chip className={classes.statusChipBad} icon={<VpnKey className={classes.statusChipIcon} />} label='Invalid Admin Token' />
    }

    let solutionChip = null;
    if (null === deviceContext.currentDevice || deviceContext.currentDevice.solutionAccessTokenStatus === 'None') {
        solutionChip = <Chip className={classes.statusChipNeutral} icon={<VpnKey className={classes.statusChipIcon} />} label='No Solution Token' />
    }
    else if (deviceContext.currentDevice.solutionAccessTokenStatus === 'Granted') {
        solutionChip = <Chip className={classes.statusChipGood} icon={<VpnKey className={classes.statusChipIcon} />} label='Valid Solution Token' />
    }
    else {
        solutionChip = <Chip className={classes.statusChipBad} icon={<VpnKey className={classes.statusChipIcon} />} label='Invalid Solution Token' />
    }

    let uiContextChip = null;
    if (null === deviceContext.currentDevice || deviceContext.currentDevice.uiContextAccessTokenStatus === 'None') {
        uiContextChip = <Chip className={classes.statusChipNeutral} icon={<VpnKey className={classes.statusChipIcon} />} label='No UI Context Token' />
    }
    else if (deviceContext.currentDevice.uiContextAccessTokenStatus === 'Granted') {
        uiContextChip = <Chip className={classes.statusChipGood} icon={<VpnKey className={classes.statusChipIcon} />} label='Valid UI Context Token' />
    }
    else {
        uiContextChip = <Chip className={classes.statusChipBad} icon={<VpnKey className={classes.statusChipIcon} />} label='Invalid UI Context Token' />
    }

    return (
        <Card data-testid='target-device-card'>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <CardContent>
                <Typography variant="h5" component="h2" paragraph={true}>Target Device</Typography>
                {bindChip}
                {adminChip}
                {solutionChip}
                {uiContextChip}
                <div>
                    <TextField onChange={handleNetworkAddressChanged} value={state.bindNetworkAddress} id="networkAddress" name="networkAddress" variant="outlined" size="small" fullWidth={true} label="Device Network Address" />
                </div>
                {isLoading ? <Loading message="Processing request..." /> : ""}
                <Dialog data-testid='password-grant' open={state.showPasswordGrantDialog} onClose={handlePasswordGrantCancel} aria-labelledby="form-dialog-title">
                    <DialogTitle>Password Grant</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the device administrator credentials to perform an OAUTH2 password grant on the device.
                            If the credentials are authenticated, the resulting access token will grant access to resources
                            that require administrator scope.
                        </DialogContentText>
                        <TextField margin="dense" onChange={handleCredentialFieldChanged} value={state.adminUsername} name="username" variant="outlined" size="small" fullWidth label="Administrator Username" />
                        <TextField autoFocus margin="dense" onChange={handleCredentialFieldChanged} name="password" variant="outlined" size="small" fullWidth type="password" label="Administrator Password" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlePasswordGrantCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordGrantExecute} color="primary">
                            Grant
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
            <CardActions>
                <Button data-testid='bind' color="primary" variant="contained" size="medium" disabled={!state.bindEnabled} onClick={handleBindClicked}>Bind</Button>
                <Button data-testid='unbind' color="inherit" variant="contained" size="medium" disabled={!state.unbindEnabled} onClick={handleUnbindClicked}>Unbind</Button>
                <Button data-testid='admin-token' color="inherit" variant="contained" size="medium" disabled={!state.getTokenEnabled} onClick={handleGetTokenClicked}>Get/Refresh Admin Token</Button>
                <LoadRefreshButton data-testid='device-refresh' color="inherit" variant="contained" deviceContext={deviceContext} isLoading={!state.refreshEnabled} onClick={handleRefreshTokenStatus} location="Target Device" />
            </CardActions>
        </Card>
    );
}

export default function DeviceManagementView() {
    const classes = useStyles();

    return (
        <div data-testid='device-view' className={classes.root}>
            <Typography variant="h4">
                Device Management
            </Typography>
            <p />
            <Typography paragraph={true}>
                Target and connect to an OXPd2 device so that it can be used with the examples.
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TargetDevice />
                </Grid>
                <Grid item xs={12}>
                    <DeviceInformation />
                </Grid>
                <Grid item xs={12}>
                    <DeviceServicesDiscovery />
                </Grid>

            </Grid>
            <p />
        </div>
    );
}
