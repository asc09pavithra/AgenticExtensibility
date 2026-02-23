import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Grid from '@mui/material/Grid';
import Loading from '../../common/Loading';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AuthenticationAgent } from './AuthenticationAgent';
import { Card, CardActions, CardContent } from '@mui/material';
import { DeviceContext } from '../../common/DeviceContext';
import { indigo, grey } from '@mui/material/colors';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
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
    row: {
        cursor: "pointer",
    },
    selected: {
        backgroundColor: indigo[50] + '!important',
        color: "#fff !important",
        "&:hover": {
            backgroundColor: "transparent !important",
        },
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
}), { defaultTheme: theme });


function AuthenticationAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const authenticationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [authenticationAgents, setAuthenticationAgents] = useState([]);
    const [authenticationAgentsResponse, setAuthenticationAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Authentication Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadAuthenticationAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadAuthenticationAgents();
    }

    async function loadAuthenticationAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await authenticationService.enumerateAuthenticationAgents();
            console.log("loadAuthenticationAgents - " + JSON.stringify(response));
            setAuthenticationAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setAuthenticationAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate AuthenticationAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedAuthenticationAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Authentication Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Authentication Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {authenticationAgents.map((authenticationAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={authenticationAgent} hover onClick={(event) => handleRowClicked(event, authenticationAgent)} selected={authenticationAgent === props.selectedAuthenticationAgent}>
                                            <TableCell component="th" scope="authenticationAgent">
                                                {authenticationAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Authentication Agents API Response" open={state.showApiResponse} apiResponse={authenticationAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function AuthenticationAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const authenticationService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedAuthenticationAgent, setSelectedAuthenticationAgent] = useState('');

    return (
        <div data-testid='authentication-agents-view'>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AuthenticationAgents service={authenticationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedAuthenticationAgent={selectedAuthenticationAgent} setSelectedAuthenticationAgent={setSelectedAuthenticationAgent} />
                </Grid>
                <Grid item xs={12}>
                    <AuthenticationAgent service={authenticationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} agentId={selectedAuthenticationAgent} />
                </Grid>
            </Grid>
        </div>
    );
}

export {
    AuthenticationAgentsTabContent
}
