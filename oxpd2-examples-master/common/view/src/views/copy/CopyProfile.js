import { Card, CardActions, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import OptionDefinition from '../../common/OptionDefinition';
import SDKButton from '../../common/SDKButton';

function BuildOptionDefinitions(props) {
    const [open, setOpen] = useState(props.expanded);
    const definitions = props.definitions.sort((a, b) => a.optionName.localeCompare(b.optionName));

    if (definitions && Object.keys(definitions).length > 0){
        return (
            <List component="div" disablePadding>
                <List component="div" disablePadding={true}>
                    {definitions.map((definition) => (
                        <OptionDefinition style={{marginLeft: "0px"}} expanded={props.expanded} definition={definition} />
                    ))}
                </List>
            </List>
        );
    } else {
        return (
            <List component="div" disablePadding>
                <ListItem style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                                {props}
                            </Typography>}
                    />
                </ListItem>
                <Divider style={{ marginLeft: "40px" }} />
            </List>
        )
    }
}

function BuildCopyProfile(props){
    const classes = useStyles();

    const allExpanded = props.allExpanded;
    const profile = props.profile;

    const [baseOpen, setBaseOpen] = useState(props.allExpanded);
    const handleBaseOpenClick = () => {
        setBaseOpen(!baseOpen);
    };

    const [storedCopyOpen, setStoredCopyOpen] = useState(props.allExpanded);
    const handleStoredCopyOpenClick = () => {
        setStoredCopyOpen(!storedCopyOpen);
    };

    if (profile) {
        return (
            <List component="nav" className={classes.root}>
                <List component="div" disablePadding>
                    <ListItem button onClick={handleBaseOpenClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                            <ListItemText disableTypography
                                primary={
                                    <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                        {"base"}
                                    </Typography>}
                            /> {baseOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    <Collapse in={baseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <BuildOptionDefinitions expanded={allExpanded} definitions={profile.base ? profile.base.definitions || null : null} />
                        </List>
                    </Collapse>
                </List>
                <Divider style={{ marginLeft: "40px" }} />
                <List component="div" disablePadding>
                    <ListItem button onClick={handleStoredCopyOpenClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                            <ListItemText disableTypography
                                primary={
                                    <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                        {"storedCopy"}
                                    </Typography>}
                            /> {storedCopyOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    <Collapse in={storedCopyOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <BuildOptionDefinitions expanded={allExpanded} definitions={profile.storedCopy ? profile.storedCopy.definitions || null : null} />
                        </List>
                    </Collapse>
                </List>
            </List>
        );
    } else {
        return (<List></List>);
    }
}

function CopyProfileTabContent(props){
    const deviceContext = useContext(DeviceContext);
    const copyService = props.service;
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const [state, setState] = useState({
        showApiResponse: false
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function handleLoadClicked() {
        loadProfile();
    }

    async function loadProfile() {
        let response;
        setIsLoading(true);
        try {
            response = await copyService.getCopyProfile();
            console.log("loadCopyProfile - " + JSON.stringify(response));

            if (null !== response) {
                setProfile(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to get Profile  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleExpandAll() {
        setAllExpanded(true);
        loadProfile();
    }

    async function handleColapseAll() {
        setAllExpanded(false);
        loadProfile();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Copy Profile</Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    <BuildCopyProfile allExpanded={allExpanded} profile={profile} />
                }
                <ApiResponseDialog title="Copy Profile API Response" open={state.showApiResponse} apiResponse={profile} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <SDKButton
                    disabled={!profile}
                    buttonlabel="Expand All"
                    primaryToolTip="Expand All Dropdowns"
                    secondaryToolTip="Profile Not Loaded"
                    secondaryToolTipCondition={profile !== null}
                    onClick={handleExpandAll}
                />
                <SDKButton
                    disabled={!profile}
                    buttonlabel="Collapse All"
                    primaryToolTip="Collapse All Dropdowns"
                    secondaryToolTip="Profile Not Loaded"
                    secondaryToolTipCondition={profile !== null}
                    onClick={handleColapseAll}
                />
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Profile" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!profile} />
            </CardActions>
        </Card>
    );
}

export {
    CopyProfileTabContent
};

