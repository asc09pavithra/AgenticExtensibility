import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { grey, indigo } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import { PropertyItem } from '../../common/ResponseTypes';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
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

function I18nAssetDetails(props) {
    const i18nAsset = props.i18nAsset || {};

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12}>
                <List component="nav" className={classes.root}>
                    <PropertyItem primary="solutionId" secondary={i18nAsset.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="assetId" secondary={i18nAsset.assetId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                </List>
            </Grid>
        </Grid>
    );
}

function I18nAsset(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [currentI18nAsset, setCurrentI18nAsset] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
    });

    useEffect(() => {
        loadI18nAsset(props.i18nAssetId);
    }, [props.i18nAssetId]);

    async function handleLoadClicked() {
        loadI18nAsset(props.i18nAssetId);
    }

    async function loadI18nAsset(i18nAssetId) {
        let response;

        console.log("loadI18nAsset.i18nAssetId: " + i18nAssetId);

        if (!i18nAssetId || i18nAssetId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await applicationService.getI18nAsset(i18nAssetId);
            console.log("getI18nAsset response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentI18nAsset(response);
                setShowButtons(true);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve I18nAsset with id ' + i18nAssetId + ' - ' + error.cause.message);
        }

        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">I18nAsset</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentI18nAsset && <I18nAssetDetails i18nAsset={currentI18nAsset} />)
                }
                <ApiResponseDialog title="I18nAsset API Response" open={state.showApiResponse} apiResponse={currentI18nAsset} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!showButtons} location="I18n Asset" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!showButtons} />
            </CardActions>
        </Card>
    );
}

function I18nAssets(props) {
    const classes = useStyles();
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [i18nAssets, setI18nAssets] = useState([]);
    const [i18nAssetsResponse, setI18nAssetsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="I18n Assets" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadI18nAssets();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadI18nAssets();
    }

    async function loadI18nAssets() {
        let response;
        setIsLoading(true);
        try {
            response = await applicationService.enumerateI18nAssets();
            console.log("loadI18nAssets - " + JSON.stringify(response));
            setI18nAssetsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setI18nAssets(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to list I18nAssets - ' + error.cause.message);
        }

        setIsLoading(false);
    }

    function handleRowClicked(e, i18nAssetId) {
        props.setSelectedI18nAsset(i18nAssetId);
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
                <Typography variant="h5" component="h2">I18nAssets</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="I18nAssets Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>I18nAsset ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {i18nAssets.map((i18nAsset) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={i18nAsset} hover onClick={(event) => handleRowClicked(event, i18nAsset)} selected={i18nAsset === props.selectedI18nAsset}>
                                            <TableCell component="th" scope="i18nAsset">
                                                {i18nAsset}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="I18nAssets API Response" open={state.showApiResponse} apiResponse={i18nAssetsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function I18nAssetTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const applicationService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedI18nAsset, setSelectedI18nAsset] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <I18nAssets service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedI18nAsset={selectedI18nAsset} setSelectedI18nAsset={setSelectedI18nAsset} />
            </Grid>
            <Grid item xs={12}>
                <I18nAsset service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} i18nAssetId={selectedI18nAsset} />
            </Grid>
        </Grid>
    );
}

export {
    I18nAssetTabContent
};

