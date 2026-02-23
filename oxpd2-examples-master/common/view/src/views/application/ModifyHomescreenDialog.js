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

export default function ModifyHomescreenDialog(props) {

    // Check if form is valid for submission
    function isFormValid() {
        const homescreenValue = props.modifyHomescreenValue;

        // If message mode is 'message', i18nAssetId, stringId, and solutionId are required
        if (homescreenValue.messageMode === 'message') {
            if (!homescreenValue.messageI18nAssetId || homescreenValue.messageI18nAssetId.trim() === '') {
                return false;
            }
            if (!homescreenValue.messageStringId || homescreenValue.messageStringId.trim() === '') {
                return false;
            }
            if (!homescreenValue.solutionId || homescreenValue.solutionId.trim() === '') {
                return false;
            }
        }

        return true;
    }

    function handleModifyButtonPushed(e) {
        if (null !== props.onOkay) {
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
            <DialogTitle>Modify Homescreen</DialogTitle>
            <DialogContent style={{ height: '600px', overflowY: 'auto' }}>
                <ModifyHomescreenInput setHomescreenValue={props.setModifyHomescreenValue} homescreenValue={props.modifyHomescreenValue}/>
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Cancel Modify"
                    secondaryToolTip="Unable to Cancel"
                    secondaryToolTipCondition={true}
                    onClick={handleCancelButtonPushed}
                />
                <SDKButton
                    disabled={!isFormValid()}
                    buttonlabel="Modify Homescreen"
                    primaryToolTip="Modify Homescreen"
                    secondaryToolTip="Unable to Modify Homescreen - Required fields missing"
                    secondaryToolTipCondition={isFormValid()}
                    onClick={handleModifyButtonPushed}
                />
            </DialogActions>
        </Dialog>
    );
}

function ModifyHomescreenInput(props) {
    let homescreenValue = props.homescreenValue;
    let setHomescreenValue = props.setHomescreenValue;

    const messageMode = homescreenValue.messageMode || 'none';

    function handleMessageModeChange(e) {
        setHomescreenValue({...homescreenValue, messageMode: e.target.value});
    }

    function handleInlineChange(index, field, value) {
        const inlineValues = homescreenValue.inlineValues || [{languageTag: '', value: ''}, {languageTag: '', value: ''}, {languageTag: '', value: ''}];
        inlineValues[index] = {...inlineValues[index], [field]: value};
        setHomescreenValue({...homescreenValue, inlineValues});
    }

    return (
        <Grid container spacing={3} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12} style={{ marginTop: '5px' }}>
                    <TextField 
                        label="defaultApplicationId" 
                        variant="outlined" 
                        size="small" 
                        fullWidth 
                        value={homescreenValue.defaultApplicationId || ''}
                        onChange={(e) => setHomescreenValue({...homescreenValue, defaultApplicationId: e.target.value})}
                    />
                </Grid>

                <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{marginRight: '16px'}}>homescreenCustomMessage</div>
                    <FormControl component="fieldset">
                        <RadioGroup row value={messageMode} onChange={handleMessageModeChange}>
                            <FormControlLabel value="none" control={<Radio color="primary" />} label="No Message" />
                            <FormControlLabel value="emptyMessage" control={<Radio color="primary" />} label="Empty Message" />
                            <FormControlLabel value="message" control={<Radio color="primary" />} label="Message" />
                            <FormControlLabel value="inlineMessage" control={<Radio color="primary" />} label="Inline Message" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                {/* Show fields based on selected message mode */}
                {messageMode === 'message' && (
                    <>
                        <Grid item xs={12}>
                            message
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="i18nAssetId" 
                                variant="outlined" 
                                size="small" 
                                fullWidth 
                                required
                                value={homescreenValue.messageI18nAssetId || ''}
                                onChange={(e) => setHomescreenValue({...homescreenValue, messageI18nAssetId: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="stringId" 
                                variant="outlined" 
                                size="small" 
                                fullWidth 
                                required
                                value={homescreenValue.messageStringId || ''}
                                onChange={(e) => setHomescreenValue({...homescreenValue, messageStringId: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="solutionId" 
                                variant="outlined" 
                                size="small" 
                                fullWidth 
                                required
                                value={homescreenValue.solutionId || ''}
                                onChange={(e) => setHomescreenValue({...homescreenValue, solutionId: e.target.value})}
                            />
                        </Grid>
                    </>
                )}
                
                {messageMode === 'inlineMessage' && (
                    <>
                        <Grid item xs={12}>
                            inlineMessage
                        </Grid>
                        {[0, 1, 2].map(index => (
                            <React.Fragment key={`inline-${index}`}>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="languageTag" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={homescreenValue.inlineValues?.[index]?.languageTag || ''}
                                        onChange={(e) => handleInlineChange(index, 'languageTag', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        label="value" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth 
                                        value={homescreenValue.inlineValues?.[index]?.value || ''}
                                        onChange={(e) => handleInlineChange(index, 'value', e.target.value)}
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                    </>
                )}
                
                {messageMode === 'emptyMessage' && (
                    <Grid item xs={12}>
                        emptyMessage (No additional fields required)
                    </Grid>
                )}
                
                {messageMode === 'none' && (
                    <></>
                )}
            </Grid>
        </Grid>
    );
}
