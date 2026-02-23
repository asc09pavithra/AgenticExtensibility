import { List } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
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
        minHeight: '300px',
        maxHeight: '300px'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    box: {
        minHeight: '200px',
        maxHeight: '200px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    },
    jsoninput: {
        fontFamily: 'Monospace',
        fontSize: '12pt',
    }
}), { defaultTheme: theme });


export default function SolutionContext(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [solutionId, setSolutionId] = useState('');

    const solutionManagerService = props.service;

    const [context, setContext] = useState(null);
    const [newContext, setNewContext] = useState('');

    const [state, setState] = useState({
        showApiResponse: false,
        showModifyDialog: false,
        dialogModifyButtonEnabled: false,
    });

    useEffect(() => {
        loadSolutionContext(props.solutionId);
    }, [props.solutionId]);

    async function handleLoadClicked() {
        loadSolutionContext(props.solutionId);
    }

    async function handleModifyClicked() {
        setState({ ...state, dialogModifyButtonEnabled: false, showModifyDialog: true });
    }

    async function handleModifyDialogCancel() {
        setState({ ...state, dialogModifyButtonEnabled: false, showModifyDialog: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleModifyDialogExecute() {
        let response;
        try {
            response = await solutionManagerService.modifySolutionContext(solutionId, JSON.parse(newContext));
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Modify context request successful!');
        }
        catch (error) {
            let message = "";
            if (error.cause) {
                message = error.cause.message ? error.cause.message : "";
                if (error.cause.errorDescription && error.cause.errorDescription.value) {
                    message = message + ": " + error.cause.errorDescription.value.key;
                }
            }

            props.postAlert('error', 'Failed to modify context - ' + message);
        }

        setState({ ...state, showModifyDialog: false });
    }

    async function handleReplaceDialogExecute() {
        let response;
        try {
            response = await solutionManagerService.replaceSolutionContext(solutionId, JSON.parse(newContext));
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Replace context request successful!');
        }
        catch (error) {
            let message = "";
            if (error.cause) {
                message = error.cause.message ? error.cause.message : "";
                if (error.cause.errorDescription && error.cause.errorDescription.value) {
                    message = message + ": " + error.cause.errorDescription.value.key;
                }
            }
            props.postAlert('error', 'Failed to initiate replace context operation - ' + message);
        }

        setState({ ...state, showModifyDialog: false });
    }

    function handleContextContentChanged(context) {
        if (null !== context) {
            setNewContext(context);
            setState({ ...state, dialogModifyButtonEnabled: true });
        }
    }

    async function loadSolutionContext(solutionId) {

        let response;

        console.log(solutionId);

        if (!solutionId || solutionId.length === 0) {
            return;
        }
        setSolutionId(solutionId);
        setIsLoading(true);
        try {
            response = await solutionManagerService.getSolutionContext(solutionId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setContext(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'unable to retrieve Context for Solution ' + solutionId + '- ' + error.cause.message);
        }
        setIsLoading(false);
    }
    return (
        <div>
            <Card>
                <CardContent>
                    {
                        isLoading ? <Loading message="Loading resource..." /> :
                            (context && <SolutionContextCardContent classes={classes} context={context} />)
                    }
                    <Dialog fullWidth={true} maxWidth="lg" open={state.showModifyDialog} onClose={handleModifyDialogCancel}>
                        <DialogTitle>Modify or Replace Context</DialogTitle>
                        <DialogContent style={{ height: '450px', overflow: 'hidden' }}>
                            <ContextDialogContent_TextField context={context} onContextInputChanged={handleContextContentChanged} />
                        </DialogContent>
                        <DialogActions>
                            <SDKButton
                                disabled={false}
                                buttonlabel="Cancel"
                                primaryToolTip="Exit This View"
                                secondaryToolTip="Exit Unavailable"
                                secondaryToolTipCondition={true}
                                onClick={handleModifyDialogCancel}
                            />
                            <SDKButton
                                disabled={!state.dialogModifyButtonEnabled}
                                buttonlabel="Modify Context"
                                primaryToolTip="Modify The Solution Context"
                                secondaryToolTip="Data Must Be Changed"
                                secondaryToolTipCondition={state.dialogModifyButtonEnabled}
                                onClick={handleModifyDialogExecute}
                            />
                            <SDKButton
                                disabled={!state.dialogModifyButtonEnabled}
                                buttonlabel="Replace Context"
                                primaryToolTip="Replace The Solution Context"
                                secondaryToolTip="Data Must Be Changed"
                                secondaryToolTipCondition={state.dialogModifyButtonEnabled}
                                onClick={handleReplaceDialogExecute}
                            />
                        </DialogActions>
                    </Dialog>
                    <ApiResponseDialog title="Solution Context API Response" open={state.showApiResponse} apiResponse={context} handleClose={handleDialogClose} />
                </CardContent>
                <CardActions>
                    <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Solution Context" />
                    <SDKButton
                        disabled={!props.loadEnabled}
                        buttonlabel="Modify/Replace"
                        primaryToolTip="Modify/Replace Context"
                        secondaryToolTip="Context Loading"
                        secondaryToolTipCondition={props.loadEnabled}
                        onClick={handleModifyClicked}
                    />
                    <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={context === null} />
                </CardActions>
            </Card>
        </div>
    );
}

function SolutionContextCardContent(props) {
    const [dataOpen, setDataOpen] = useState(true);
    const [sensitiveDataOpen, setSensitiveDataOpen] = useState(true);

    const handleClickData = () => {
        setDataOpen(!dataOpen);
    };

    const handleClickSensitiveData = () => {
        setSensitiveDataOpen(!sensitiveDataOpen);
    };

    return (
        <React.Fragment>
            <Divider style={{ marginLeft: "40px" }} />

            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClickData} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                data
                            </Typography>}
                    /> {dataOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={dataOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {props.context.data && props.context.data.map(value => (
                            <React.Fragment>
                                <PropertyHeader name={value.key} />
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <PropertyItem secondary={value.value || ""} />
                                </List>
                            </React.Fragment>
                        ))}
                    </List>
                </Collapse>
            </List>

            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClickSensitiveData} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                sensitiveData
                            </Typography>}
                    /> {sensitiveDataOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={sensitiveDataOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {props.context.sensitiveData && props.context.sensitiveData.map(value => (
                            <React.Fragment>
                                <PropertyHeader name={value.key} />
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <PropertyItem secondary={""} />
                                </List>
                            </React.Fragment>
                        ))}
                    </List>
                </Collapse>
            </List>
        </React.Fragment>
    );
}

function ContextDialogContent_TextField(props) {
    // Deep copy the context
    var context = JSON.parse(JSON.stringify(props.context));

    // Remove the Links & OpMeta because they aren't part of a modify or replace request
    delete context.links;
    delete context.$opMeta;

    const [value, setValue] = useState(JSON.stringify(context, undefined, 2));

    function handleContextInputChanged(event) {
        setValue(event.target.value);
        props.onContextInputChanged(event.target.value);
    }

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                    <TextField
                        multiline
                        rows={17}
                        onChange={handleContextInputChanged}
                        label="Edit Context"
                        variant="outlined"
                        size="large"
                        fullWidth
                        value={value} />
                </Grid>
            </Grid>
        </Grid>
    );
}
