import { DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';

export default function BindableSolutionContext({ usedOptions }) {
    const [contextType, setContextType] = useState("explicit");
    const [explicitValue, setExplicitValue] = useState("");
    const [expressionPattern, setExpressionPattern] = useState("");

    useEffect(() => {
        loadSolutionContext();
    }, []);

    function loadSolutionContext() {
        if(usedOptions.current.context !== undefined) {
            if(usedOptions.current.context.explicit !== undefined) {
                setContextType("explicit");
                setExplicitValue(usedOptions.current.context.explicit.explicitValue);
            } else if(usedOptions.current.context.expression !== undefined) {
                setContextType("expression");
                setExpressionPattern(usedOptions.current.context.expression.expressionPattern);
            }
        }
    }

    function getContextTypeValue(num) {
        switch (num) {
            case 10: return "explicit"
            case 20: return "expression"
            default: return "explicit"
        }
    }

    function getContextTypeNumber(value) {
        switch (value) {
            case "explicit": return 10
            case "expression": return 20
            default: return 10
        }
    }

    function handleContextInputChanged(contextType) {
        setContextType(contextType);
    }

    const handleExplicitValueChanged = (event) => {
        setExplicitValue(event.target.value);
        usedOptions.current.context = {
            "explicit":{
                "explicitValue": event.target.value
            }
        }
    }

    const handleExpressionValueChanged = (event) => {
        setExpressionPattern(event.target.value);
        usedOptions.current.context = {
            "expression":{
                "expressionPattern": event.target.value
            }
        }
    }

    return (
        <React.Fragment>
            <DialogTitle style={{ marginLeft: '10px', marginTop: '40px' }}>Solution Context</DialogTitle>
            <DialogContent style={{ height: '540px'}}>
                <Grid container spacing={1} alignContent="flex-start" alignItems="center">
                    <Grid container item xs={12} spacing={1}>
                        <Select variant="outlined" 
                            fullWidth
                            labelId="context-type"
                            id="contextType"
                            value={getContextTypeNumber(contextType)}
                            label="Report Type"
                            style={{ margin: '10px' }}
                            onChange={e => handleContextInputChanged(getContextTypeValue(e.target.value))}
                        >
                            <MenuItem value={10}>explicit</MenuItem>
                            <MenuItem value={20}>expression</MenuItem>
                        </Select>
                        {contextType === "explicit" ? 
                            <TextField variant="outlined" required fullWidth
                                id="explicitValue"
                                label="explicitValue"
                                style={{ marginLeft: '10px', marginRight: '10px' }}
                                type="string"
                                value={explicitValue}
                                onInput={handleExplicitValueChanged}
                            />
                        :
                            <TextField variant="outlined" required fullWidth
                                id="expressionPattern"
                                label="expressionPattern"
                                style={{ marginLeft: '10px', marginRight: '10px' }}
                                type="string"
                                value={expressionPattern}
                                onInput={handleExpressionValueChanged}
                            />
                        }
                    </Grid>
                </Grid>
            </DialogContent>
        </React.Fragment>
    );
}
