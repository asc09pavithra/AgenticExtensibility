import { Card, CardActions, CardContent, Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState, Fragment } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyItem, PropertyHeader } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function BuildMessageLocalizedString({ name, localizedString }) {
    if (localizedString) {
        if (localizedString.reference) {
            return (
                <React.Fragment>
                    <PropertyHeader name={name} />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <PropertyHeader name="reference" />
                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                            <PropertyItem primary="i18nAssetId" secondary={localizedString.reference.i18nAssetId || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="stringId" secondary={localizedString.reference.stringId || ""} />
                        </List>
                    </List>
                </React.Fragment>
            );
        }
        else if (localizedString.inline && localizedString.inline.values) {
            return (
                <React.Fragment>
                    <PropertyHeader name={name} />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <PropertyHeader name="inline" />
                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                            <PropertyHeader name="values" />
                            {localizedString.inline.values.map((item, index) => (
                                <React.Fragment key={`${name}-inline-${index}`}>
                                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                        <PropertyItem primary="languageTag" secondary={item.languageTag || ""} />
                                        <Divider style={{ marginLeft: "40px" }} />
                                        <PropertyItem primary="value" secondary={item.value || ""} />
                                        {index < localizedString.inline.values.length - 1 && <Divider style={{ marginLeft: "40px" }} />}
                                    </List>
                                </React.Fragment>
                            ))}
                        </List>
                    </List>
                </React.Fragment>
            );
        }
    }
    return null;
}

function MessageDetails(props) {
    const message = props.message || {};

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12}>
                <List component="nav" className={classes.root}>
                    <PropertyItem primary="messageId" secondary={message.messageId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="messageType" secondary={message.messageType} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildMessageLocalizedString name="localizedTitle" localizedString={message.localizedTitle} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildMessageLocalizedString name="localizedMessage" localizedString={message.localizedMessage} />
                </List>
            </Grid>
        </Grid>
    );
}

function Message(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
    });

    useEffect(() => {
        loadMessage(props.messageId);
    }, [props.messageId]);

    async function handleLoadClicked() {
        loadMessage(props.messageId);
    }

    async function loadMessage(messageId) {
        let response;

        console.log("loadMessage.messageId: " + messageId);

        if (!messageId || messageId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await applicationService.getMessage(props.agentId, messageId);
            console.log("getMessage response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentMessage(response);
                setShowButtons(true);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Message with id ' + messageId + ' - ' + error.cause.message);
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
                <Typography variant="h5" component="h2">Message</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentMessage && <MessageDetails message={currentMessage} />)
                }
                <ApiResponseDialog title="Message API Response" open={state.showApiResponse} apiResponse={currentMessage} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Message" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    Message
};

