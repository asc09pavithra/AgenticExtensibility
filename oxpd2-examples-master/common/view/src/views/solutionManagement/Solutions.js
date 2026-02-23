import React, { useState, useEffect, useContext } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { Tabs, Tab } from '@mui/material';
import { Card, CardActions, CardContent } from '@mui/material';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import Loading from '../../common/Loading';
import SolutionContext from './SolutionContext';
import SolutionDetails from './SolutionDetails';
import { CATabContent } from './CertificateAuthorities';
import { ConfigurationTabContent } from './Configuration';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import { DeviceContext } from '../../common/DeviceContext';
import { RuntimeRegistrationsTabContent } from './SolutionRuntimeRegistrations';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';

function SolutionCardContent(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ marginTop: 10 }}>
            <AppBar position="static" color="inherit">
                <Tabs value={value} onChange={handleChange} aria-label="Solution Tabs" {...baseTabStyles}>
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Context" {...a11yProps(1)} />
                    <Tab label="Certificate Authorities" {...a11yProps(2)} />
                    <Tab label="Configuration" {...a11yProps(3)} />
                    <Tab label="Runtime Registrations" {...a11yProps(4)} />
                    <Tab label="Certificates" {...a11yProps(5)} />
                    <Tab label="Modifications" {...a11yProps(6)} />
                </Tabs>
            </AppBar>
            <ViewTabPanel value={value} index={0}>
                <SolutionDetails solution={props.solution} loadEnabled={true} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={1}>
                <SolutionContext solutionId={props.solution.solutionId} service={props.service} loadEnabled={true} postAlert={props.postAlert} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={2}>
                <CATabContent solutionId={props.solution.solutionId} service={props.service} loadEnabled={true} postAlert={props.postAlert} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={3}>
                <ConfigurationTabContent solutionId={props.solution.solutionId} service={props.service} loadEnabled={true} postAlert={props.postAlert} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={4}>
                <RuntimeRegistrationsTabContent solutionId={props.solution.solutionId} service={props.service} loadEnabled={true} postAlert={props.postAlert} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={5}>
                <p>Certificates - supported in a future release</p>
            </ViewTabPanel>
            <ViewTabPanel value={value} index={6}>
                <p>Modifications - supported in a future release</p>
            </ViewTabPanel>
        </div>
    );
}

function Solution(props) {
    const deviceContext = useContext(DeviceContext);
    const solutionManagerService = props.service;

    const [isLoading, setIsLoading] = useState(false);
    const [currentSolution, setCurrentSolution] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false
    });

    useEffect(() => {
        loadSolution(props.solutionId);
    }, [props.solutionId]);

    async function handleLoadClicked() {
        loadSolution(props.solutionId);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleReissueInstallCode() {
        let response;

        console.log(currentSolution.solutionId);

        if (!currentSolution.solutionId || currentSolution.solutionId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await solutionManagerService.postReissueInstallCode(currentSolution.solutionId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Install code reissued');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to reissue install code - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function loadSolution(solutionId) {
        let response;

        console.log(solutionId);

        if (!solutionId || solutionId.length === 0) {
            setCurrentSolution(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await solutionManagerService.getSolution(solutionId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentSolution(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve solution - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Solution</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentSolution && <SolutionCardContent solution={currentSolution} service={solutionManagerService} postAlert={props.postAlert} />)
                }
                <ApiResponseDialog title="Solution API Response" open={state.showApiResponse} apiResponse={currentSolution} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={currentSolution === null} location="Solution" />
                <SDKButton
                    disabled={currentSolution === null}
                    buttonlabel="Reissue Install Code"
                    primaryToolTip="Send Reissue Solution Install Code Request"
                    secondaryToolTip="No Solution Selected"
                    secondaryToolTipCondition={currentSolution !== null}
                    onClick={handleReissueInstallCode}
                />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={currentSolution === null} />
            </CardActions>
        </Card>
    );
}

function Solutions(props) {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [solutions, setSolutions] = useState([]);
    const solutionManagerService = props.service;

    useEffect(() => {
        loadSolutions();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadSolutions();
    }

    async function loadSolutions() {
        let response;
        setIsLoading(true);
        try {
            const contentFilter = '["members/(solutionId, description, installationDetails)", "memberIds", "offset", "selectedCount", "totalCount"]';
            // encoding the contentFilter, the java example will flag [ and " as invalid characters.
            response = await solutionManagerService.enumerateSolutions('includeMembers=true&contentFilter=' + encodeURIComponent(contentFilter));
            console.log(JSON.stringify(response));

            if (null !== response && 'members' in response && null !== response.members) {
                setSolutions(response.members);
            }
            else {
                setSolutions([]);
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Solutions - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, solutionId) {
        props.setSelectedSolution(solutionId);
    }

    async function handleUninstallClicked(e, solutionId) {
        let response;
        try {
            response = await solutionManagerService.uninstallSolution(solutionId);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Uninstall request successful!');
            props.setSelectedSolution('');
            handleLoadClicked();
        }
        catch (error) {
            props.postAlert('error', 'Failed to initiate uninstall operation - ' + error.cause.message);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Solutions</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Solutions Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Solution ID</TableCell>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Version</TableCell>
                                        <TableCell align="left">Vendor</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {solutions.map((solution) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={solution.solutionId} hover selected={solution.solutionId === props.selectedSolution}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, solution.solutionId)} >
                                                {solution.solutionId}
                                            </TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, solution.solutionId)} >{solution.description ? solution.description.name : ''}</TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, solution.solutionId)} >{solution.description ? solution.description.version : ''}</TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, solution.solutionId)} >{solution.description ? solution.description.vendor : ''}</TableCell>
                                            <TableCell>
                                                <SDKButton
                                                    size="small"
                                                    variant="contained"
                                                    disabled={false}
                                                    buttonlabel="Uninstall"
                                                    primaryToolTip="Uninstall The Solution"
                                                    secondaryToolTip="Uninstall Unavailable"
                                                    secondaryToolTipCondition={true}
                                                    onClick={(event) => handleUninstallClicked(event, solution.solutionId)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="solutions-refresh-button" onClick={handleLoadClicked} isLoading={!props.loadEnabled} location="Solutions" />
            </CardActions>
        </Card>
    );
}

function SolutionTabContent(props) {
    const [selectedSolution, setSelectedSolution] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Solutions service={props.service} loadEnabled={true} postAlert={props.postAlert} selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution} />
            </Grid>
            <Grid item xs={12}>
                <Solution service={props.service} loadEnabled={true} postAlert={props.postAlert} solutionId={selectedSolution} />
            </Grid>
        </Grid>
    )
}

export {
    SolutionTabContent
}
