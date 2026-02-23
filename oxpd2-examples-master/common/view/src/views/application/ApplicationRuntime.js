import { Card, CardActions, CardContent, Grid, Tab, Tabs } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Chip from '@mui/material/Chip';
import { green, grey } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState, useContext } from 'react';
import LabelledOutline from '../../common/LabelledOutline';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import ApplicationRuntimeChrome from './ApplicationRuntimeChrome';
import { ApplicationRuntimeDetails } from './ApplicationRuntimeDetails';
import ApplicationRuntimeStartIntent from './ApplicationRuntimeStartIntent';
import { DeviceContext } from '../../common/DeviceContext';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    },
    loading: {
        marginTop: 10,
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
    table: {
        minWidth: 450,
    },
    buttonmargin: {
        margin: theme.spacing(.5)
    },
    hoverx: {
        "&:hover": {
            backgroundColor: grey[50] + "!important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
    json: {
        borderRadius: '5px',
        border: '1px solid #0a0a0f',
        background: '#f0f0f5',
        padding: '5px',
        fontFamily: 'Monospace',
        fontSize: '10pt',
        overflowY: 'auto',
        overflowX: 'auto',
        minHeight: '200px',
        maxHeight: '200px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    },
    statusChipGood: {
        marginBottom: '0px',
        marginLeft: '0px',
        color: '#fff',
        backgroundColor: green[500]
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
    scrollable: {
        maxHeight: '150px'
    }
}), { defaultTheme: theme });

function ApplicationRuntimeCard(props) {
    const applicationService = props.service;
    const deviceContext = useContext(DeviceContext);

    const [isLoading, setIsLoading] = useState(false);
    const [applicationRuntime, setApplicationRuntime] = useState(null);

    useEffect(() => {
        loadApplicationRuntime();
    }, []);

    async function loadApplicationRuntime() {
        let response;

        setIsLoading(true);
        try {
            response = await applicationService.getApplicationRuntime();
            console.log(JSON.stringify(response));

            if (null !== response) {
                setApplicationRuntime(response);
                props.setIsLoaded(true);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve ApplicationRuntime - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    // Card Buttons
    async function handleLoadClicked() {
        loadApplicationRuntime();
    }

    async function handleResetButtonClicked() {
        let response;
        try {
            response = await applicationService.resetApplicationRuntime();
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Reset request successful!');
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to reset  - ' + error.cause.message);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Application Runtime</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (applicationRuntime && <ApplicationRuntimeCardContent loadEnabled={props.loadEnabled} applicationRuntime={applicationRuntime} />)
                }
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Application Runtime" />
                <SDKButton
                    disabled={!props.loadEnabled || !(deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound")}
                    buttonlabel="Reset"
                    primaryToolTip="Reset Runtime Context"
                    secondaryToolTip="Reset Context Unavailable"
                    secondaryToolTipCondition={!(!props.loadEnabled || !(deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound"))}
                    onClick={handleResetButtonClicked}
                />
            </CardActions>
        </Card>
    );
}

function ApplicationRuntimeCardContent(props) {

    return (
        <>
            <p></p>
            <Grid container wrap="nowrap" spacing={0}>
                <ActivityState value={props.applicationRuntime.activityState} />
                <Grid item style={{ minWidth: '200px', marginLeft: '-180px' }}>
                    <StringProperty name="currentLanguage" value={props.applicationRuntime.currentLanguage || ""} />
                </Grid>
            </Grid>
        </>
    );
}

function StringProperty(props) {
    return (
        <LabelledOutline label={props.name}>{props.value}</LabelledOutline>
    );
}

function ActivityState(props) {
    var classes = useStyles();

    var asAsleep = props.value === "asAsleep" ? classes.statusChipGood : classes.statusChipNeutral;
    var asInactive = props.value === "asInactive" ? classes.statusChipGood : classes.statusChipNeutral;
    var asAwakeIdle = props.value === "asAwakeIdle" ? classes.statusChipGood : classes.statusChipNeutral;
    var asAwakeActive = props.value === "asAwakeActive" ? classes.statusChipGood : classes.statusChipNeutral;

    return (
        <Grid item xs={2}>
            <LabelledOutline label="activityState">
                <Grid container direction="column" spacing={1}>
                    <Grid item><Chip className={asAsleep} label="asAsleep" /></Grid>
                    <Grid item><Chip className={asInactive} label="asInactive" /></Grid>
                    <Grid item><Chip className={asAwakeIdle} label="asAwakeIdle" /></Grid>
                    <Grid item><Chip className={asAwakeActive} label="asAwakeActive" /></Grid>
                </Grid>
            </LabelledOutline>
        </Grid>
    );
}

function ApplicationRuntimeTabContent(props) {
    const [selectedSolution, setSelectedSolution] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ApplicationRuntimeCard service={props.service} loadEnabled={true} postAlert={props.postAlert} selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution} setIsLoaded={setIsLoaded} />
            </Grid>
            <Grid item xs={12}>
                <CurrentContextCard service={props.service} postAlert={props.postAlert} selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution} isLoaded={isLoaded} />
            </Grid>
        </Grid>
    )
}

function CurrentContextCard(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Current Context</Typography>
                <div style={{ marginTop: 10 }}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="Current Context Tabs" {...baseTabStyles}>
                            <Tab label="Details" {...a11yProps(0)} />
                            <Tab data-testid='application-runtimechrome-tab' label="Runtime Chrome" {...a11yProps(1)} />
                            <Tab label="Start Intent" {...a11yProps(2)} />
                            <Tab label="Result Intent" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <ApplicationRuntimeDetails service={props.service} postAlert={props.postAlert} isLoaded={props.isLoaded} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <ApplicationRuntimeChrome service={props.service} loadEnabled={true} postAlert={props.postAlert} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={2}>
                        <ApplicationRuntimeStartIntent service={props.service} postAlert={props.postAlert} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={3}>
                        <p>Result Intent - planned for future release</p>
                    </ViewTabPanel>
                </div>
            </CardContent>
        </Card>
    );
}

export {
    ApplicationRuntimeTabContent
};

