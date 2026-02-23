import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import CreateMessageDialog from './CreateMessageDialog';
import { Message } from './Message';
import { DeviceContext } from '../../common/DeviceContext';
import SDKButton from '../../common/SDKButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function Messages(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState(null);
    const [messageMembers, setMessageMembers] = useState([]);
    const service = props.service;

    const [state, setState] = useState({
        showApiResponse: false,
        showCreateMessageDialog: false
    });

    const [createMessageValue, setCreateMessageValue] = useState({
        messageId: '',
        messageType: '',
        titleMode: 'reference',
        messageMode: 'reference',
        localizedTitleAssetId: '',
        localizedTitleStringId: '',
        localizedMessageAssetId: '',
        localizedMessageStringId: '',
        titleInlineValues: [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}],
        messageInlineValues: [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}]
    });

    useEffect(() => {
        loadMessages();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadMessages();
    }

    async function loadMessages() {
        let response;
        setIsLoading(true);
        try {
            response = await service.enumerateMessages(props.agentId, "includeMembers=true");
            console.log(JSON.stringify(response));

            if (null !== response && 'members' in response && null !== response.members) {
                setMessages(response);
                setMessageMembers(response.members);
            }
            else {
                setMessages(null);
                setMessageMembers([])
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Messages - ' + error.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, messageId) {
        props.setSelectedMessage(messageId);
    }

    async function handleDeleteClicked(e, messageId) {
        let response;
        try {
            response = await service.deleteMessage(props.agentId, messageId);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Delete request successful!');
            props.setSelectedMessage('');
            handleLoadClicked();
        }
        catch (error) {
            props.postAlert('error', 'Failed to delete operation - ' + error.message);
        }
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleCreateMessageDialogClose() {
        setState({ ...state, showCreateMessageDialog: false });
    }

    async function handleShowCreateMessageDialog() {
        setState({ ...state, showCreateMessageDialog: true });
    }

    async function handleCreateMessageExecute() {
        let response;
        try {
            let localizedTitle;
            if (createMessageValue.titleMode === 'reference') {
                localizedTitle = {
                    reference: {
                        i18nAssetId: createMessageValue.localizedTitleAssetId,
                        stringId: createMessageValue.localizedTitleStringId
                    }
                };
            } else {
                // Filter out empty inline values
                const titleValues = createMessageValue.titleInlineValues.filter(
                    item => item.languageTag && item.value
                );
                localizedTitle = {
                    inline: {
                        values: titleValues
                    }
                };
            }

            let localizedMessage;
            if (createMessageValue.messageMode === 'reference') {
                localizedMessage = {
                    reference: {
                        i18nAssetId: createMessageValue.localizedMessageAssetId,
                        stringId: createMessageValue.localizedMessageStringId
                    }
                };
            } else {
                // Filter out empty inline values
                const messageValues = createMessageValue.messageInlineValues.filter(
                    item => item.languageTag && item.value
                );
                localizedMessage = {
                    inline: {
                        values: messageValues
                    }
                };
            }

            const message = {
                messageId: createMessageValue.messageId,
                messageType: createMessageValue.messageType,
                localizedTitle: localizedTitle,
                localizedMessage: localizedMessage
            };
            
            console.log(JSON.stringify(message));
            response = await service.createMessage(props.agentId, message);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Create message request successful!');
            props.setSelectedMessage('');
            handleLoadClicked();
        }
        catch (error) {
            props.postAlert('error', 'Failed to create message - ' + error.message);
        }
        setState({ ...state, showCreateMessageDialog: false });
        setCreateMessageValue({
            messageId: '',
            messageType: '',
            titleMode: 'reference',
            messageMode: 'reference',
            localizedTitleAssetId: '',
            localizedTitleStringId: '',
            localizedMessageAssetId: '',
            localizedMessageStringId: '',
            titleInlineValues: [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}],
            messageInlineValues: [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}]
        });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Messages</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Messages Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Message ID</TableCell>
                                        <TableCell className={classes.tableIdCell}>Message Type</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {messageMembers.map((message) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={message.messageId} hover selected={message.messageId === props.selectedMessage}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="message" onClick={(event) => handleRowClicked(event, message.messageId)} >
                                                {message.messageId}
                                            </TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, message.messageId)} >{message.messageType ? message.messageType : ''}</TableCell>
                                            <TableCell>
                                                <SDKButton
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={false}
                                                    buttonlabel="Delete"
                                                    primaryToolTip="Delete This Message"
                                                    secondaryToolTip="Unable to Delete This Message"
                                                    secondaryToolTipCondition={true}
                                                    onClick={(event) => handleDeleteClicked(event, message.messageId)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Messages API Response" open={state.showApiResponse} apiResponse={messages} handleClose={handleDialogClose} />
                <CreateMessageDialog show={state.showCreateMessageDialog} onOkay={handleCreateMessageExecute} onCancel={handleCreateMessageDialogClose} setCreateMessageValue={setCreateMessageValue} createMessageValue={createMessageValue} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Messages" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!props.loadEnabled} />
                <SDKButton
                    data-testid="message-create-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Create Message"
                    primaryToolTip="Create A New Message"
                    secondaryToolTip="Unable to Create A New Message"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleShowCreateMessageDialog}
                />
            </CardActions>
        </Card>
    );
}

function MessagesTabContent(props) {
    const [selectedMessage, setSelectedMessage] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Messages service={props.service} agentId={props.agentId} loadEnabled={true} postAlert={props.postAlert} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} />
            </Grid>
            <Grid item xs={12}>
                <Message service={props.service} loadEnabled={true} postAlert={props.postAlert} agentId={props.agentId} messageId={selectedMessage} />
            </Grid>
        </Grid>
    )
}

export {
    MessagesTabContent
};

