import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors';
import React, { useContext, useEffect, useState } from 'react';
import { HashRouter as Router, Link, Routes, Route, useLocation } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AppsIcon from '@mui/icons-material/Apps';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LockIcon from '@mui/icons-material/Lock';
import PrintIcon from '@mui/icons-material/Print';
import ScannerIcon from '@mui/icons-material/Scanner';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsApplicationIcon from '@mui/icons-material/SettingsApplications';
import UsbIcon from '@mui/icons-material/Usb';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import { DeviceContext } from './common/DeviceContext';
import DeviceStatusDetails from './common/DeviceStatusDetails';
import TokenStatusDetails from './common/TokenStatusDetails';
import DeviceManagementService from './services/DeviceManagementService';
import ApplicationServiceView from './views/application/ApplicationServiceView';
import AuthenticationServiceView from './views/authentication/AuthenticationServiceView';
import CopyServiceView from './views/copy/CopyView';
import DeviceView from './views/device/DeviceView';
import DeviceManagementView from './views/deviceManagement/DeviceManagementView';
import DeviceUsageServiceView from './views/deviceUsage/DeviceUsageServiceView';
import HomeView from './views/home/HomeView';
import JobStatisticsServiceView from "./views/jobStatistics/JobStatisticsServiceView";
import PrintJobServiceView from './views/printJob/PrintJobServiceView';
import ScanJobServiceView from './views/scanJob/ScanJobServiceView';
import SecurityServiceView from './views/security/SecurityServiceView';
import SolutionDiagnosticsView from './views/solutionDiagnostics/solutionDiagnosticsServiceView';
import SolutionManagementView from './views/solutionManagement/SolutionManagementView';
import SuppliesServiceView from './views/supplies/SuppliesServiceView';
import UsbAccessoriesView from './views/usbAccessories/UsbAccessoriesView';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3F51B5',
        },
        secondary: grey,
    },
});

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    headerTitle: {
        flexGrow: 1
    },
    deviceStatus: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(0.5)
        }
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    red: {
        color: '#fff',
        backgroundColor: red[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
    neutral: {
        color: '#fff',
        backgroundColor: grey[700]
    },
    activeRoute: {
        backgroundColor: '#e1e2eb'
    }
}), { defaultTheme: theme });

function DeviceStatus(props) {
    const classes = useStyles();
    const deviceContext = useContext(DeviceContext);
    const [state, setState] = useState({ showTokenStatus: false, showDeviceStatus: false });

    var avatarClass = classes.neutral;
    var showKey = true;
    var keyAvatarClass = classes.neutral;

    const currentDevice = deviceContext.currentDevice;

    if (null !== currentDevice) {
        avatarClass = (currentDevice.bindStatus === 'bound' ? classes.green : classes.red);
        if ('adminAccessTokenStatus' in currentDevice) {
            if (currentDevice.adminAccessTokenStatus !== 'None') {
                showKey = true;
            }
            keyAvatarClass = (currentDevice.adminAccessTokenStatus === 'Granted' || currentDevice.solutionAccessTokenStatus === 'Granted' || currentDevice.uiContextAccessTokenStatus === 'Granted' ? classes.green : classes.neutral);
        }
    }

    function handleClick(e) {
        if (e.currentTarget.name === 'tokenStatusAvatar') {
            if (!state.showTokenStatus) {
                setState({ ...state, showTokenStatus: true });
            }
        }
        else if (e.currentTarget.name === 'deviceStatusAvatar') {
            if (!state.showDeviceStatus) {
                setState({ ...state, showDeviceStatus: true });
            }
        }
    }

    const handleTokenStatusClose = () => {
        setState({ ...state, showTokenStatus: false });
    }

    const handleDeviceStatusClose = () => {
        setState({ ...state, showDeviceStatus: false });
    }

    return (
        <div className={classes.deviceStatus}>
            <DeviceStatusDetails data-testid='device-status' open={state.showDeviceStatus} onClose={handleDeviceStatusClose} />
            <TokenStatusDetails data-testid='token-status' open={state.showTokenStatus} onClose={handleTokenStatusClose} />
            <Avatar data-testid='device-status-avatar' component={Link} onClick={handleClick} name="deviceStatusAvatar" className={avatarClass}>
                <PrintIcon />
            </Avatar>
            {
                showKey &&
                <Avatar data-testid='token-status-avatar' component={Link} onClick={handleClick} name="tokenStatusAvatar" className={keyAvatarClass}>
                    <VpnKeyIcon />
                </Avatar>
            }
        </div>
    );
}

function Header(props) {
    const classes = useStyles();

    return (
        <AppBar data-testid="app-header" position="fixed" className={classes.appBar} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap className={classes.headerTitle}>
                    {props.title}
                </Typography>
                <DeviceStatus></DeviceStatus>
            </Toolbar>
        </AppBar>
    );
}

function Sidebar(props) {
    const classes = useStyles();
    const location = useLocation();

    return (
        <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
            <Toolbar />
            <div data-testid='sidebar-list' className={classes.drawerContainer}>
                <List>
                    <ListItem data-testid='home-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/home' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/home"
                        >
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={'Introduction'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='device-management-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/deviceManagement' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/deviceManagement"
                        >
                            <ListItemIcon><PrintIcon /></ListItemIcon>
                            <ListItemText primary={'Device Management'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='solution-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/solutions' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/solutions"
                        >
                            <ListItemIcon>
                                <SettingsApplicationIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Solution Management'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='application-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/applications' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/applications"
                        >
                            <ListItemIcon>
                                <AppsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Application Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='authentication-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/authentication' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/authentication"
                        >
                            <ListItemIcon>
                                <LockIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Authentication Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='copy-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/copy' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/copy"
                        >
                            <ListItemIcon>
                                <FileCopyIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Copy Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='device-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/device' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/device"
                        >
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Device Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='device-usage-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/deviceUsage' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/deviceUsage"
                        >
                            <ListItemIcon>
                                <AllInboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Device Usage Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='job-statistics-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/jobStatistics' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/jobStatistics"
                        >
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Job Statistics Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='print-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/printJob' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/printJob"
                        >
                            <ListItemIcon>
                                <FileIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Print Job Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='scan-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/scanJob' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/scanJob"
                        >
                            <ListItemIcon>
                                <ScannerIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Scan Job Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/security' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/security"
                        >
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Security Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='solution-diagnostics-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/solutionDiagnostics' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/solutionDiagnostics"
                        >
                            <ListItemIcon>
                                <BuildIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Solution Diagnostics Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='supplies-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/supplies' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/supplies"
                        >
                            <ListItemIcon>
                                <AttachFileIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Supplies Service'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem data-testid='usb-button' disablePadding>
                        <ListItemButton 
                            className={location.pathname === '/usbAccessories' ? classes.activeRoute : ''} 
                            component={Link} 
                            to="/usbAccessories"
                        >
                            <ListItemIcon>
                                <UsbIcon />
                            </ListItemIcon>
                            <ListItemText primary={'USB Accessories Service'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}

function Copyright(props) {
    return (
        <Typography variant="body2" color="textSecondary" align="center" {...props}>
            {'Copyright © '}
            {'HP Inc. '}
            {new Date().getFullYear()}
        </Typography>
    );
}

function Footer(props) {
    return (
        <div data-testid="app-footer">
            <p />
            <Copyright />
        </div>
    )
}

function App(props) {

    const classes = useStyles();
    const [currentDevice, setCurrentDevice] = useState(null);
    const [currentAccessToken, setCurrentAccessToken] = useState(null);

    useEffect(() => {
        // Create a scoped async function in the hook
        async function asyncOperation() {
            const deviceManagementService = new DeviceManagementService('http://localhost:5000/oxpd2-examples/api');

            try {
                var result = await deviceManagementService.getCurrentDevice();

                if (result) {
                    setCurrentDevice(result);
                }
            }
            catch {
                console.log('caught error fetching current device');
            }
        }
        // Execute the created function directly
        asyncOperation();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <DeviceContext.Provider value={{ currentDevice: currentDevice, setCurrentDevice: setCurrentDevice, currentAccessToken: currentAccessToken, setCurrentAccessToken: setCurrentAccessToken, HIDAccessories: new Map() }}>
                    <Router>
                        <Header title={'OXPd2 Examples'} />
                        <Sidebar classes={classes} />
                        <Paper className={classes.content}>
                            <Toolbar />
                            <Routes>
                                <Route path="/home" element={<HomeView />} />
                                <Route path="/deviceManagement" element={<DeviceManagementView />} />
                                <Route path="/solutions" element={<SolutionManagementView />} />
                                <Route path="/applications" element={<ApplicationServiceView />} />
                                <Route path="/jobStatistics" element={<JobStatisticsServiceView />} />
                                <Route path="/printJob" element={<PrintJobServiceView />} />
                                <Route path="/copy" element={<CopyServiceView />} />
                                <Route path="/device" element={<DeviceView />} />
                                <Route path="/deviceUsage" element={<DeviceUsageServiceView />} />
                                <Route path="/scanJob" element={<ScanJobServiceView />} />
                                <Route path="/security" element={<SecurityServiceView />} />
                                <Route path="/solutionDiagnostics" element={<SolutionDiagnosticsView />} />
                                <Route path="/supplies" element={<SuppliesServiceView />} />
                                <Route path="/usbAccessories" element={<UsbAccessoriesView />} />
                                <Route path="/authentication" element={<AuthenticationServiceView />} />
                                <Route path="/" element={<HomeView />} />
                            </Routes>
                            <Footer />
                        </Paper>
                    </Router>
                </DeviceContext.Provider>
            </div>
        </ThemeProvider>
    );
}

export default App;
