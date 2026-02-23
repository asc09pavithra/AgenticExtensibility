import { Card, CardActions, CardContent, List, ListItem, ListItemText } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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
    const handleClick = () => {
        setOpen(!open);
    };
    const definitions = props.definitions.sort((a, b) => a.optionName.localeCompare(b.optionName));
    

    if (definitions && Object.keys(definitions).length > 0){
        return (
            <List component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                                {props.baseName}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {definitions.map((definition) => (
                            <>
                                <OptionDefinition style={{ marginLeft: "40px"}} expanded={props.expanded} definition={definition} />
                            </>
                        ))}
                    </List>
                </Collapse>
                <Divider style={{ marginLeft: "40px" }} />
            </List>
        );
    } else {
        return (
            <List component="div" disablePadding>
                <ListItem style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                                {props.baseName}
                            </Typography>}
                    />
                </ListItem>
                <Divider style={{ marginLeft: "40px" }} />
            </List>
        )
    }
}

function BuildScanProfile(props){
    const classes = useStyles();

    const allExpanded = props.allExpanded;
    const profile = props.profile;

    if (profile) {
        return (
            <List component="nav" className={classes.root}>
                <List component="div" disablePadding>
                    <BuildOptionDefinitions baseName={"base"} expanded={allExpanded} definitions={profile.base ? profile.base.definitions : null} />
    
                    {profile.email &&
                        <BuildOptionDefinitions baseName={"email"} expanded={allExpanded} definitions={profile.email.definitions} />
                    }
    
                    {profile.ftp &&
                        <BuildOptionDefinitions baseName={"ftp"} expanded={allExpanded} definitions={profile.ftp.definitions} />
                    }
    
                    {profile.http &&
                        <BuildOptionDefinitions baseName={"http"} expanded={allExpanded} definitions={profile.http.definitions} />
                    }
    
                    {profile.localFolder &&
                        <BuildOptionDefinitions baseName={"localFolder"} expanded={allExpanded} definitions={profile.localFolder.definitions} />
                    }
    
                    {profile.networkFolder &&
                        <BuildOptionDefinitions baseName={"networkFolder"} expanded={allExpanded} definitions={profile.networkFolder.definitions} />
                    }
                </List>
            </List>
        );
    } else {
        return (<List></List>);
    }
}

function ScanProfileTabContent(props){
    const deviceContext = useContext(DeviceContext);
    const scanJobService = props.service;
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
            response = await scanJobService.getScanProfile();
            console.log("loadScanProfile - " + JSON.stringify(response));

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
                <Typography variant="h5" component="h2">Scan Profile</Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    <BuildScanProfile allExpanded={allExpanded} profile={profile} />
                }
                <ApiResponseDialog title="Scan Profile API Response" open={state.showApiResponse} apiResponse={profile} handleClose={handleDialogClose} />
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
    ScanProfileTabContent
};

