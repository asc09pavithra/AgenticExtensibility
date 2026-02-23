import React, { useState, useContext, useEffect } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Loading from '../../common/Loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { AuthenticationAccessPoint } from './AuthenticationAccessPoint';
import { DeviceContext } from '../../common/DeviceContext';
import { useStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { grey } from '@mui/material/colors';

function AccessPointKindChip(props) {
    const classes = useStyles();

    let label = 'Unknown';
    const chipStyle = { 
        minWidth: '80px', 
        backgroundColor: grey[300], 
        color: '#000' 
    };

    if (props.kind === 'akCustom') {
        label = 'Custom';
    }
    else if (props.kind === 'akOther') {
        label = 'Other'
    }
    else if (props.kind === 'akPIN') {
        label = 'Pin'
    }
    else if (props.kind === 'akDeviceUser') {
        label = 'Device user'
    }
    else if (props.kind === 'akdDeviceService') {
        label = 'DeviceService'
    }
    else if (props.kind === 'akdPushButton') {
        label = 'Push Button'
    }
    else if (props.kind === 'akLDAP') {
        label = 'LDAP'
    }
    else if (props.kind === 'akWindows') {
        label = 'Windows'
    }
    else if (props.kind === 'akWindowsSmartCard') {
        label = 'Windows SmartCard'
    }
    else if (props.kind === 'akOther') {
        label = 'Other'
    }
    return (
        <Chip style={chipStyle} label={label} />
    )
}

function AuthenticationAccessPoints(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const authenticationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [authenticationAccessPoints, setAuthenticationAccessPoints] = useState([]);
    const [authenticationAccessPointsResponse, setAuthenticationAccessPointsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton data-testid='authentication-access-points-load-refresh' onClick={handleLoadClicked} isLoading={isLoading} location="Authentication Access Points" />
            <ApiResponseButton data-testid='authentication-access-points-api-response' onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadAuthenticationAccessPoints();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadAuthenticationAccessPoints();
    }

    async function loadAuthenticationAccessPoints() {
        let response;
        setIsLoading(true);
        try {

            response = await authenticationService.enumerateAuthenticationAccessPoints('includeMembers=true');
            console.log("loadAuthenticationAccessPoints - " + JSON.stringify(response));
            setAuthenticationAccessPointsResponse(response);

            if (null !== response && 'members' in response && null !== response.members) {
                setAuthenticationAccessPoints(response.members);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate AuthenticationAccessPoints  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, accessPointId) {
        props.setSelectedAuthenticationAccessPoint(accessPointId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid='authentication-access-points-card'>
            <CardContent>
                <Typography variant="h5" component="h2">Authentication Access Points</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Authentication Access Points Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Access Point ID</TableCell>
                                        <TableCell align="left">Kind</TableCell>
                                        <TableCell align="left">Custom Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {authenticationAccessPoints.map((authenticationAccessPoint) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={authenticationAccessPoint.accessPointId} hover onClick={(event) => handleRowClicked(event, authenticationAccessPoint.accessPointId)} selected={authenticationAccessPoint.accessPointId === props.selectedAuthenticationAccessPoint}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="authenticationAccessPoint">
                                                {authenticationAccessPoint.accessPointId}
                                            </TableCell>
                                            <TableCell align="left"><AccessPointKindChip kind={authenticationAccessPoint.kind} /></TableCell>
                                            <TableCell align="left">{authenticationAccessPoint.customName ? authenticationAccessPoint.customName : ''}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Authentication Access Points API Response" open={state.showApiResponse} apiResponse={authenticationAccessPointsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function AuthenticationAccessPointsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const authenticationAccessPointsService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedAuthenticationAccessPoint, setSelectedAuthenticationAccessPoint] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <AuthenticationAccessPoints service={authenticationAccessPointsService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedAuthenticationAccessPoint={selectedAuthenticationAccessPoint} setSelectedAuthenticationAccessPoint={setSelectedAuthenticationAccessPoint} />
            </Grid>
            <Grid item xs={12}>
                <AuthenticationAccessPoint service={authenticationAccessPointsService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} accessPointId={selectedAuthenticationAccessPoint} />
            </Grid>
        </Grid>
    );
}

export {
    AuthenticationAccessPointsTabContent
}
