import { Card, CardActions, CardContent, Grid } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyItem, PropertyHeader } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';
import ModifyHomescreenDialog from './ModifyHomescreenDialog';

function HomescreenCustomMessage({ homescreenCustomMessage }) {
    if (!homescreenCustomMessage) {
        return null;
    }

    if (homescreenCustomMessage.emptyMessage !== undefined) {
        return (
            <React.Fragment>
                <PropertyHeader name="homescreenCustomMessage" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                    <PropertyHeader name="emptyMessage" />
                </List>
                <Divider style={{ marginLeft: "40px", marginTop: "20px" }} />
            </React.Fragment>
        );
    } else if (homescreenCustomMessage.message !== undefined) {
        return (
            <React.Fragment>
                <PropertyHeader name="homescreenCustomMessage" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                    <PropertyHeader name="message" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                        {homescreenCustomMessage.message.message && (
                            <React.Fragment>
                                <PropertyHeader name="message" />
                                <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                                    <PropertyItem 
                                        primary="i18nAssetId" 
                                        secondary={homescreenCustomMessage.message.message.i18nAssetId || ""} 
                                    />
                                    <Divider style={{ marginLeft: "40px" }} />
                                    <PropertyItem 
                                        primary="stringId" 
                                        secondary={homescreenCustomMessage.message.message.stringId || ""} 
                                    />
                                </List>
                                <Divider style={{ marginLeft: "40px" }} />
                            </React.Fragment>
                        )}
                        {homescreenCustomMessage.message.solutionId && (
                            <PropertyItem 
                                primary="solutionId" 
                                secondary={homescreenCustomMessage.message.solutionId} 
                            />
                        )}
                    </List>
                </List>
                <Divider style={{ marginLeft: "40px" }} />
            </React.Fragment>
        );
    } else if (homescreenCustomMessage.inlineMessage !== undefined) {
        return (
            <React.Fragment>
                <PropertyHeader name="homescreenCustomMessage" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                    <PropertyHeader name="inlineMessage" />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                        {homescreenCustomMessage.inlineMessage.message && 
                         homescreenCustomMessage.inlineMessage.message.values && (
                            <React.Fragment>
                                <PropertyHeader name="message" />
                                <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                                    <PropertyHeader name="values" />
                                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                                        {homescreenCustomMessage.inlineMessage.message.values.map((item, index) => (
                                            <InlineMessageValue key={`inline-${index}`} item={item} index={index} />
                                        ))}
                                    </List>
                                </List>
                            </React.Fragment>
                        )}
                    </List>
                </List>
                <Divider style={{ marginLeft: "40px" }} />
            </React.Fragment>
        );
    }

    return (<></>);
}

function InlineMessageValue({ item, index }) {
    const [open, setOpen] = useState(false);
    
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            {item.languageTag || `Value ${index + 1}`}
                        </Typography>
                    }
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <PropertyItem 
                        primary="languageTag" 
                        secondary={item.languageTag || ""} 
                    />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem 
                        primary="value" 
                        secondary={item.value || ""} 
                    />
                </List>
            </Collapse>
        </React.Fragment>
    );
}

function HomescreenDetails(props) {
    const homescreen = props.homescreen || {};
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12}>
                <List component="nav" className={classes.root}>
                    {homescreen.defaultApplicationId && (
                        <React.Fragment>
                            <PropertyItem 
                                primary="defaultApplicationId" 
                                secondary={homescreen.defaultApplicationId} 
                            />
                            <Divider style={{ marginLeft: "40px" }} />
                        </React.Fragment>
                    )}
                    {homescreen.homescreenCustomMessage && (
                        <HomescreenCustomMessage homescreenCustomMessage={homescreen.homescreenCustomMessage} />
                    )}
                </List>
            </Grid>
        </Grid>
    );
}

function Homescreen(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentHomescreen, setCurrentHomescreen] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showModifyDialog: false,
    });

    const [modifyHomescreenValue, setModifyHomescreenValue] = useState({
        defaultApplicationId: '',
        messageMode: 'none',
        messageI18nAssetId: '',
        messageStringId: '',
        solutionId: '',
        inlineValues: [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}]
    });

    useEffect(() => {
        loadHomescreen();
    }, []);

    async function handleLoadClicked() {
        loadHomescreen();
    }

    async function loadHomescreen() {
        let response;

        setIsLoading(true);
        try {
            response = await applicationService.getHomescreen();
            console.log("getHomescreen response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentHomescreen(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Homescreen - ' + error.message);
        }

        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleModifyClicked() {
        if (currentHomescreen) {
            let messageMode = 'none';
            let messageI18nAssetId = '';
            let messageStringId = '';
            let solutionId = '';
            let inlineValues = [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}];

            if (currentHomescreen.homescreenCustomMessage) {
                if (currentHomescreen.homescreenCustomMessage.emptyMessage !== undefined) {
                    messageMode = 'emptyMessage';
                } else if (currentHomescreen.homescreenCustomMessage.message !== undefined) {
                    messageMode = 'message';
                    if (currentHomescreen.homescreenCustomMessage.message.message) {
                        messageI18nAssetId = currentHomescreen.homescreenCustomMessage.message.message.i18nAssetId || '';
                        messageStringId = currentHomescreen.homescreenCustomMessage.message.message.stringId || '';
                    }
                    solutionId = currentHomescreen.homescreenCustomMessage.message.solutionId || '';
                } else if (currentHomescreen.homescreenCustomMessage.inlineMessage !== undefined) {
                    messageMode = 'inlineMessage';
                    if (currentHomescreen.homescreenCustomMessage.inlineMessage.message?.values) {
                        const values = currentHomescreen.homescreenCustomMessage.inlineMessage.message.values;
                        for (let i = 0; i < Math.min(values.length, 3); i++) {
                            inlineValues[i] = {
                                languageTag: values[i].languageTag || '',
                                value: values[i].value || ''
                            };
                        }
                    }
                }
            }

            setModifyHomescreenValue({
                defaultApplicationId: currentHomescreen.defaultApplicationId || '',
                messageMode,
                messageI18nAssetId,
                messageStringId,
                solutionId,
                inlineValues
            });
        }
        setState({ ...state, showModifyDialog: true });
    }

    async function handleModifyDialogClose() {
        setState({ ...state, showModifyDialog: false });
    }

    async function handleModifyExecute() {
        let response;
        try {
            const requestBody = {};

            if (modifyHomescreenValue.defaultApplicationId && modifyHomescreenValue.defaultApplicationId.trim() !== '') {
                requestBody.defaultApplicationId = modifyHomescreenValue.defaultApplicationId;
            }

            if (modifyHomescreenValue.messageMode !== 'none') {
                requestBody.homescreenCustomMessage = {};

                if (modifyHomescreenValue.messageMode === 'emptyMessage') {
                    requestBody.homescreenCustomMessage.emptyMessage = {};
                } else if (modifyHomescreenValue.messageMode === 'message') {
                    requestBody.homescreenCustomMessage.message = {
                        message: {
                            i18nAssetId: modifyHomescreenValue.messageI18nAssetId,
                            stringId: modifyHomescreenValue.messageStringId
                        }
                    };
                    if (modifyHomescreenValue.solutionId) {
                        requestBody.homescreenCustomMessage.message.solutionId = modifyHomescreenValue.solutionId;
                    }
                } else if (modifyHomescreenValue.messageMode === 'inlineMessage') {
                    // Filter out empty inline values
                    const values = modifyHomescreenValue.inlineValues.filter(
                        item => item.languageTag && item.value
                    );
                    requestBody.homescreenCustomMessage.inlineMessage = {
                        message: {
                            values: values
                        }
                    };
                }
            }

            console.log("Modify homescreen request:", JSON.stringify(requestBody));
            response = await applicationService.modifyHomescreen(requestBody);
            console.log("Modify homescreen response:", JSON.stringify(response));
            
            props.postAlert('success', 'Homescreen modified successfully!');
            loadHomescreen();
        }
        catch (error) {
            props.postAlert('error', 'Failed to modify homescreen - ' + error.message);
        }
        setState({ ...state, showModifyDialog: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Homescreen</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentHomescreen && <HomescreenDetails homescreen={currentHomescreen} />)
                }
                <ApiResponseDialog title="Homescreen API Response" open={state.showApiResponse} apiResponse={currentHomescreen} handleClose={handleDialogClose} />
                <ModifyHomescreenDialog 
                    show={state.showModifyDialog} 
                    onOkay={handleModifyExecute} 
                    onCancel={handleModifyDialogClose} 
                    setModifyHomescreenValue={setModifyHomescreenValue} 
                    modifyHomescreenValue={modifyHomescreenValue} 
                />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Homescreen" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!currentHomescreen} />
                <SDKButton
                    disabled={!currentHomescreen}
                    buttonlabel="Modify"
                    primaryToolTip="Modify Homescreen"
                    secondaryToolTip="Unable to Modify Homescreen"
                    secondaryToolTipCondition={currentHomescreen !== null}
                    onClick={handleModifyClicked}
                />
            </CardActions>
        </Card>
    );
}

export {
    Homescreen
};
