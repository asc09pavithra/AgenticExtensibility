import React, { useState, useContext, useEffect } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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
import { ApplicationAccessPoint } from './ApplicationAccessPoint';
import { DeviceContext } from '../../common/DeviceContext';
import { useStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function ApplicationAccessPoints(props) {
    const classes = useStyles();
    const deviceContext = useContext(DeviceContext);
    const applicationAccessPointService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [applicationAccessPoints, setApplicationAccessPoints] = useState([]);
    const [applicationAccessPointsResponse, setApplicationAccessPointsResponse] = useState(null);
    const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg'];

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Application Access Points" />
            <ApiResponseButton data-testid='application-access-points-api-response' onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadApplicationAccessPoints();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadApplicationAccessPoints();
    }

    async function loadApplicationAccessPoints() {
        let response;
        setIsLoading(true);
        try {
            const contentFilter = '["members/(accessPointId, title, icon)", "memberIds", "offset", "selectedCount", "totalCount"]';
             // encoding the contentFilter, the java example will flag [ and " as invalid characters.
            response = await applicationAccessPointService.enumerateApplicationAccessPoints('includeMembers=true&contentFilter=' + encodeURIComponent(contentFilter));
            console.log("loadApplicationAccessPoints - " + JSON.stringify(response));
            setApplicationAccessPointsResponse(response);

            if (null !== response && 'members' in response && null !== response.members) {
                setApplicationAccessPoints(response.members);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate ApplicationAccessPoints  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, accessPointId) {
        props.setSelectedApplicationAccessPoint(accessPointId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    function isValidBase64(str) {
        return typeof str === 'string' && /^[A-Za-z0-9+/=\s]+$/.test(str);
    }

    function isSafeIcon(icon) {
        return (
            icon &&
            ALLOWED_IMAGE_MIME_TYPES.includes(icon.mimeType) &&
            isValidBase64(icon.value)
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Application Access Points</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Application Access Points Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Access Point ID</TableCell>
                                        <TableCell align="left">Title</TableCell>
                                        <TableCell align="left">Icon</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {applicationAccessPoints.map((applicationAccessPoint) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={applicationAccessPoint.accessPointId} hover onClick={(event) => handleRowClicked(event, applicationAccessPoint.accessPointId)} selected={applicationAccessPoint.accessPointId === props.selectedApplicationAccessPoint}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="applicationAccessPoint">
                                                {applicationAccessPoint.accessPointId}
                                            </TableCell>
                                            <TableCell align="left">{applicationAccessPoint.title ? applicationAccessPoint.title : ''}</TableCell>
                                            <TableCell align="left">
                                                {
                                                    applicationAccessPoint.icon && isSafeIcon(applicationAccessPoint.icon) ?
                                                        <div style={{ width: 64 }}><img style={{ width: '100%', objectFit: 'contain' }} src={`data:${applicationAccessPoint.icon.mimeType};base64,${applicationAccessPoint.icon.value}`}></img></div> :
                                                        <Avatar className={classes.avatarLarge}>N/A</Avatar>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Application Access Points API Response" open={state.showApiResponse} apiResponse={applicationAccessPointsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function ApplicationAccessPointsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const applicationAccessPointsService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedApplicationAccessPoint, setSelectedApplicationAccessPoint] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ApplicationAccessPoints service={applicationAccessPointsService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedApplicationAccessPoint={selectedApplicationAccessPoint} setSelectedApplicationAccessPoint={setSelectedApplicationAccessPoint} />
            </Grid>
            <Grid item xs={12}>
                <ApplicationAccessPoint service={applicationAccessPointsService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} accessPointId={selectedApplicationAccessPoint} />
            </Grid>
        </Grid>
    );
}

export {
    ApplicationAccessPointsTabContent
}
