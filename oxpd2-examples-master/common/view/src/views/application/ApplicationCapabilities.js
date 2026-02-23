import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import AppBar from '@mui/material/AppBar';
import { BuildCommonCapabilitiesNoLinks, BuildLinks } from '../../common/Capabilities';
import { Card, CardActions, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import Typography from '@mui/material/Typography';
import { Tabs, Tab } from '@mui/material';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { DeviceContext } from '../../common/DeviceContext';
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
        minHeight: '200px',
        maxHeight: '200px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function BuildIconFormats({ formats }) {
    if (formats) {
        return (
            <React.Fragment>
                <PropertyHeader name="applicationIconFormats"></PropertyHeader>
                <List style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }} component="div" disablePadding >
                    {formats.map(format => (
                        <div key={format} style={{ fontSize: "18px", paddingLeft: "40px" }}>{format}</div>
                    ))}
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function BuildSoftKeyboardTypes({ types }) {
    if (types) {
        return (
            <React.Fragment>
                <PropertyHeader name="softKeyboardTypes"></PropertyHeader>
                <List style={{ paddingLeft: "40px", paddingTop: "10px" }} component="div" disablePadding >
                    {types.map(type => (
                        <div key={type} style={{ fontSize: "18px", paddingLeft: "40px" }}>{type}</div>
                    ))}
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function BuildUserInfo({ userInfo, classes }) {
    if (userInfo) {
        return (
            <List component="nav" className={classes.root}>
                <List component="div" disablePadding>
                    <PropertyItem primary="applicationIconHeight" secondary={userInfo.applicationIconHeight || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="applicationIconWidth" secondary={userInfo.applicationIconWidth || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="displayResolutionX" secondary={userInfo.displayResolutionX || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="displayResolutionY" secondary={userInfo.displayResolutionY || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="displaySize" secondary={userInfo.displaySize || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="footerHeight" secondary={String(userInfo.footerHeight) || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="hardKeyboardType" secondary={userInfo.hardKeyboardType || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="hasHardBackKey" secondary={String(userInfo.hasHardBackKey) || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="hasHardHomeKey" secondary={String(userInfo.hasHardHomeKey) || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="headerHeight" secondary={userInfo.headerHeight || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="nativeTheme" secondary={userInfo.nativeTheme || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildIconFormats formats={userInfo.applicationIconFormats || {}} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSoftKeyboardTypes types={userInfo.softKeyboardTypes} />
                </List>
            </List>
        );
    }
    return null;
}

function CapabilitiesWithTab({ capabilities, classes }) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container><Grid item xs={12}><Paper elevation={3}>
            <AppBar position="static" color="inherit" className={classes.appBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Application Capabilities Tabs"
                    {...baseTabStyles}
                >
                    <Tab style={{ fontStyle: "italic" }} label="General Info" {...a11yProps(0)} />
                    <Tab style={{ fontStyle: "italic" }} label="Links" {...a11yProps(1)} />
                    <Tab style={{ fontStyle: "italic" }} label="User Interface Attributes" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <ViewTabPanel value={value} index={0}>
                <BuildCommonCapabilitiesNoLinks capabilities={capabilities || {}} classes={classes} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={1}>
                <BuildLinks links={capabilities.links || {}} classes={classes} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={2}>
                <BuildUserInfo userInfo={capabilities.userInterfaceAttributes || {}} classes={classes} />
            </ViewTabPanel>
        </Paper></Grid></Grid>
    );
}

function ApplicationCapabilities(props) {
    const deviceContext = useContext(DeviceContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const classes = useStyles();

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });    

    useEffect(() => {
        if (props.initialLoad || props.initialLoad == null) {
            handleRefreshClicked();
        }
    }, [props.initialLoad]);    

    async function handleRefreshClicked() {
        setIsLoading(true);
        try {
            var result = await props.service.getCapabilities();
            if (null !== result) {
                console.log(JSON.stringify(result, undefined, 2));
                props.setCapabilities(result);
                setState({ ...state, showButtons: true });
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve the Capabilities - ' + error.cause.message);
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
                <Typography variant="h5" component="h2">
                    Application Service Capabilities
                </Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    props.capabilities && <CapabilitiesWithTab capabilities={props.capabilities} classes={classes} />
                }
                <ApiResponseDialog title="Capabilities API Response" open={state.showApiResponse} apiResponse={props.capabilities} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleRefreshClicked} isLoading={isLoading} location="Application Capabilities" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    ApplicationCapabilities
}
