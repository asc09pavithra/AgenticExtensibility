import React from 'react';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Capabilities from '../../common/Capabilities';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SolutionDiagnosticsService from '../../services/SolutionDiagnosticsService';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { SolutionDiagnosticsAgentsTabContent } from './SolutionDiagnosticsAgents'
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    }
}), { defaultTheme: theme });

function SolutionDiagnosticsAgentsTabs(props) {
    let solutionDiagnosticsService = new SolutionDiagnosticsService('http://localhost:5000/oxpd2-examples/api');

    const [value, setValue] = React.useState(0);
    const [currentSolutionDiagnosticsCapabilities, setSolutionDiagnosticsCapabilities] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function setSolutionDiagnosticsViewCapabilities(capabilities) {
        setSolutionDiagnosticsCapabilities(capabilities);
    }

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" {...baseTabStyles}>
                            <Tab label="Capabilities" {...a11yProps(0)} />
                            <Tab label="Solution Diagnostics Agents" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <Capabilities name="Solution Diagnostics Service Capabilities" service={solutionDiagnosticsService} setParentCapabilities={setSolutionDiagnosticsViewCapabilities} capabilities={currentSolutionDiagnosticsCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <SolutionDiagnosticsAgentsTabContent service={solutionDiagnosticsService} />
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default function SolutionDiagnosticsServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='solution-diagnostics-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Solution Diagnostics Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Solution Diagnostics Service
            </Typography>
            <SolutionDiagnosticsAgentsTabs classes={classes} />
        </div>
    );
}
