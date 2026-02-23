import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import TextField from '@mui/material/TextField';
import SDKButton from '../../common/SDKButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function CreateMessageDialog(props) {

    function handleCreateButtonPushed(e) {
        if (null!== props.onOkay) {
            props.onOkay()
        }
    }

    function handleCancelButtonPushed() {
        if (null !== props.onCancel) {
            props.onCancel();
        }
    }

    return(
        <Dialog fullWidth={true} maxWidth="md" open={props.show} onClose={props.handleClose}>
            <DialogTitle>Create Message</DialogTitle>
            <DialogContent style={{ height: '600px', overflowY: 'auto' }}>
                <CreateMessageInput setMessageValue={props.setCreateMessageValue} messageValue={props.createMessageValue}/>
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit Message"
                    secondaryToolTip="Unable to Exit Message"
                    secondaryToolTipCondition={true}
                    onClick={handleCancelButtonPushed}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Create Message"
                    primaryToolTip="Create a New Message"
                    secondaryToolTip="Unable to Create a Message"
                    secondaryToolTipCondition={true}
                    onClick={handleCreateButtonPushed}
                />
            </DialogActions>
        </Dialog>
    );
}

function CreateMessageInput(props) {
    let messageValue = props.messageValue;
    let setMessageValue = props.setMessageValue;
    const titleMode = messageValue.titleMode || 'reference';
    const messageMode = messageValue.messageMode || 'reference';

    function handleMessageIdChange(e) {
        props.setMessageValue({...props.messageValue, messageId: e.target.value});
    }

    function handleTitleModeChange(e) {
        setMessageValue({...messageValue, titleMode: e.target.value});
    }

    function handleMessageModeChange(e) {
        setMessageValue({...messageValue, messageMode: e.target.value});
    }

    function handleTitleInlineChange(index, field, value) {
        const titleInlineValues = messageValue.titleInlineValues || [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}];
        titleInlineValues[index] = {...titleInlineValues[index], [field]: value};
        setMessageValue({...messageValue, titleInlineValues});
    }

    function handleMessageInlineChange(index, field, value) {
        const messageInlineValues = messageValue.messageInlineValues || [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}];
        messageInlineValues[index] = {...messageInlineValues[index], [field]: value};
        setMessageValue({...messageValue, messageInlineValues});
    }

    return (
        <Grid container spacing={3} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={6}>
                    <TextField label="messageId" variant="outlined" size="small" fullWidth onChange={handleMessageIdChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="messageType" variant="outlined" size="small" fullWidth onChange={(e) => setMessageValue({...messageValue, messageType: e.target.value})}/>
                </Grid>
                
                {/* localizedTitle Section */}
                <Grid item xs={12} style={{marginTop: '16px', display: 'flex', alignItems: 'center'}}>
                    <strong style={{marginRight: '16px'}}>localizedTitle</strong>
                    <FormControl component="fieldset">
                        <RadioGroup row value={titleMode} onChange={handleTitleModeChange}>
                            <FormControlLabel value="reference" control={<Radio color="primary" />} label="Reference" />
                            <FormControlLabel value="inline" control={<Radio color="primary" />} label="Inline" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                {titleMode === 'reference' ? (
                    <>
                        <Grid item xs={6}>
                            <TextField label="i18nAssetId" variant="outlined" size="small" fullWidth onChange={(e) => setMessageValue({...messageValue, localizedTitleAssetId: e.target.value})}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="stringId" variant="outlined" size="small" fullWidth onChange={(e) => setMessageValue({...messageValue, localizedTitleStringId: e.target.value})}/>
                        </Grid>
                    </>
                ) : (
                    <>
                        {[0, 1, 2].map(index => (
                            <React.Fragment key={`title-inline-${index}`}>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="languageTag" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={messageValue.titleInlineValues?.[index]?.languageTag || ''}
                                        onChange={(e) => handleTitleInlineChange(index, 'languageTag', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="value" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={messageValue.titleInlineValues?.[index]?.value || ''}
                                        onChange={(e) => handleTitleInlineChange(index, 'value', e.target.value)}
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                    </>
                )}
                
                {/* localizedMessage Section */}
                <Grid item xs={12} style={{marginTop: '16px', display: 'flex', alignItems: 'center'}}>
                    <strong style={{marginRight: '16px'}}>localizedMessage</strong>
                    <FormControl component="fieldset">
                        <RadioGroup row value={messageMode} onChange={handleMessageModeChange}>
                            <FormControlLabel value="reference" control={<Radio color="primary" />} label="Reference" />
                            <FormControlLabel value="inline" control={<Radio color="primary" />} label="Inline" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                {messageMode === 'reference' ? (
                    <>
                        <Grid item xs={6}>
                            <TextField label="i18nAssetId" variant="outlined" size="small" fullWidth onChange={(e) => setMessageValue({...messageValue, localizedMessageAssetId: e.target.value})}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="stringId" variant="outlined" size="small" fullWidth onChange={(e) => setMessageValue({...messageValue, localizedMessageStringId: e.target.value})}/>
                        </Grid>
                    </>
                ) : (
                    <>
                        {[0, 1, 2].map(index => (
                            <React.Fragment key={`message-inline-${index}`}>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="languageTag" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={messageValue.messageInlineValues?.[index]?.languageTag || ''}
                                        onChange={(e) => handleMessageInlineChange(index, 'languageTag', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="value" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={messageValue.messageInlineValues?.[index]?.value || ''}
                                        onChange={(e) => handleMessageInlineChange(index, 'value', e.target.value)}
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                    </>
                )}
            </Grid>
        </Grid>
    );
}
