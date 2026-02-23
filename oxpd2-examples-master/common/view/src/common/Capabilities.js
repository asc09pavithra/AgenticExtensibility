import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import ApiResponseDialog from './ApiResponseDialog';
import AppAlert from './AppAlert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Loading from './Loading';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { PropertyHeader, PropertyItem } from './ResponseTypes';
import ApiResponseButton from './ApiResponseButton';
import { DeviceContext } from './DeviceContext';
import LoadRefreshButton from './LoadRefreshButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

export const useStyles = makeStyles((theme) => ({
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
        overflowX: 'auto'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    capabilities: {
        minHeight: '300px',
        maxHeight: '300px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function BuildImplInfo({ info }) {
    // Just take the first item in the array (this is coming through as an array),
    // update if we have more than 1 item in the array.
    if (info) {
        if (info[0]) {
            return (
                <React.Fragment>
                    <PropertyHeader name="implInfo" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <PropertyItem primary="typeGUN" secondary={info[0].typeGUN || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="value" secondary={JSON.stringify(info[0].value, undefined, 2)} />
                    </List>
                </React.Fragment>
            );
        }
        else {
            return (
                <PropertyItem primary="implInfo" secondary="" />
            )
        }
    }
    return null
}
function BuildLinkProperty({ name, linkProp }) {
    if (linkProp) {
        return (
            <PropertyItem style={{ paddingtop: "-40px" }} primary={name} secondary={linkProp || ""} />
        );
    }
    return null;
}

function BuildLink({ link }) {
    if (link) {
        return (
            <React.Fragment>
                <PropertyHeader name={link.rel} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <BuildLinkProperty name="href" linkProp={link.href} />
                    <BuildLinkProperty name="hrefTemplate" linkProp={link.hrefTemplate} />
                </List>
                <Divider style={{ marginLeft: "40px" }} />
            </React.Fragment>
        )
    }
    return null;
}

export function BuildLinks({ links }) {
    const [open, setOpen] = useState(true);
    const handleClick = () => {
        setOpen(!open);
    };

    if (links) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                links
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {links.length > 0 &&
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ marginTop: "-20px" }}>
                            {links.map(link => (
                                <BuildLink link={link} key={link.rel + link.href} />
                            ))
                            }
                        </List>
                    </Collapse>
                }
            </List>
        );
    }
    return null;
}

export function BuildCommonCapabilitiesNoLinks({ capabilities }) {
    if (capabilities) {
        return (
            <React.Fragment>
                <PropertyItem primary="apiVersion" secondary={capabilities.apiVersion || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="description" secondary={capabilities.description || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="implVersion" secondary={capabilities.implVersion || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="serviceGun" secondary={capabilities.serviceGun || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <BuildImplInfo info={capabilities.implInfo || {}} />
            </React.Fragment>
        );
    }
    return null;
}

export function BuildCommonCapabilities({ capabilities }) {
    if (capabilities) {
        return (
            <React.Fragment>
                <PropertyItem primary="apiVersion" secondary={capabilities.apiVersion || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="description" secondary={capabilities.description || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="implVersion" secondary={capabilities.implVersion || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="serviceGun" secondary={capabilities.serviceGun || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <BuildImplInfo info={capabilities.implInfo || {}} />
                <Divider style={{ marginLeft: "40px" }} />

                <BuildLinks links={capabilities.links || {}} />
            </React.Fragment>
        );
    }
    return null;
}

function CapabilitiesDetails({ capabilities, classes }) {
    if (capabilities) {
        return (
            <List component="nav" className={classes.root}>
                <List component="div" disablePadding>
                    <PropertyItem primary="apiVersion" secondary={capabilities.apiVersion || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="description" secondary={capabilities.description || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="implVersion" secondary={capabilities.implVersion || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="serviceGun" secondary={capabilities.serviceGun || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <BuildImplInfo info={capabilities.implInfo || {}} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <BuildLinks links={capabilities.links || {}} />
                </List>
            </List>
        );
    }
    return null;
}

export default function Capabilities(props) {
    const deviceContext = useContext(DeviceContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const classes = useStyles();

    const [state, setState] = useState({
        showApiResponse: false,
    });
    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    useEffect(() => {
        if (props.initialLoad || props.initialLoad == null) {
            handleRefreshClicked();
        }
    }, [props.initialLoad]);

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    async function handleRefreshClicked() {
        setIsLoading(true);
        try {
            var result = await props.service.getCapabilities();
            console.log(JSON.stringify(result, undefined, 2));
            props.setParentCapabilities(result);
        }
        catch (error) {
            postAlert('error', 'Unable to retrieve the Capabilities - ' + error.cause.message);
        }
        props.setInitialLoad(false);
        setIsLoading(false);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
                <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
                <Typography variant="h5" component="h2">
                    {props.name ? props.name : "Capabilities"}
                </Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    props.capabilities && <CapabilitiesDetails capabilities={props.capabilities} classes={classes} />
                }
                <ApiResponseDialog title="Capabilities API Response" open={state.showApiResponse} apiResponse={props.capabilities} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid='load-refresh-capabilities' onClick={handleRefreshClicked} isLoading={isLoading} location={props.name ? props.name : "Capabilities"} />
                <ApiResponseButton data-testid='get-api-response' onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={props.capabilities == null} />
            </CardActions>
        </Card>
    );
}

export {

}
