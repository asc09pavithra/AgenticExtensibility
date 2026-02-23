import { List, ListItem, ListItemText } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { PropertyHeader, PropertyItem } from './ResponseTypes';

function BuildRuleConditionMessage(props) {
    const condition = props.condition;
    const message = props.message;

    return (
        <>
            {condition && 
                <>
                    <PropertyHeader name={"condition"} />
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <PropertyItem primary="typeGUN" secondary={condition.typeGUN || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="value" secondary={(condition.value && JSON.stringify(condition.value, null, 2)) || ""} />
                    </List>
                    <Divider style={{ marginLeft: "40px" }} />
                </>
            }

            {message && 
                <PropertyItem primary="message" secondary={message} />
            }
        </>
    );
}

function BuildDisableRule(props) {
    const disable = props.disable;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            disable
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={disable.condition} message={disable.message} />
                </List>
            </Collapse>
        </List>
    );
}

function BuildRangeRule(props) {
    const range = props.range;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            range
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={range.condition} message={range.message} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="lowerBoundary" secondary={range.lowerBoundary+"" || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="upperBoundary" secondary={range.upperBoundary+"" || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="step" secondary={range.step+"" || ""} />
                </List>
            </Collapse>
        </List>
    );
}

function BuildStringLengthRule(props) {
    const stringLength = props.stringLength;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            stringLength
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={stringLength.condition} message={stringLength.message} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="maximumLength" secondary={stringLength.maximumLength+"" || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="minimumLength" secondary={stringLength.minimumLength+"" || ""} />
                </List>
            </Collapse>
        </List>
    );
}

function BuildRegularExpressionRule(props) {
    const regularExpression = props.regularExpression;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            regularExpression
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={regularExpression.condition} message={regularExpression.message} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="expression" secondary={regularExpression.expression || ""} />
                </List>
            </Collapse>
        </List>
    );
}

function BuildValidValuesRule(props) {
    const validValues = props.validValues;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            validValues
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={validValues.condition} message={validValues.message} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyHeader name={"optionValues"} />
                    <List component="div" disablePadding={true}>
                        {validValues.optionValues && validValues.optionValues.map((value) => (
                            <PropertyItem secondary={value} />
                        ))}
                    </List>
                </List>
            </Collapse>
        </List>
    );
}

function BuildPossibleValuesRule(props) {
    const possibleValues = props.possibleValues;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            possibleValues
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={possibleValues.condition} message={possibleValues.message} />
                    <PropertyHeader name={"optionValues"} />
                    <List component="div" disablePadding={true}>
                        {possibleValues.optionValues && possibleValues.optionValues.map((value) => (
                            <PropertyItem secondary={value} />
                        ))}
                    </List>
                </List>
            </Collapse>
        </List>
    );
}

function BuildForceSetRule(props) {
    const forceSet = props.forceSet;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            forceSet
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildRuleConditionMessage condition={forceSet.condition} message={forceSet.message} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="optionValue" secondary={forceSet.optionValue || ""} />
                </List>
            </Collapse>
        </List>
    );
}

function BuildOptionRule(props) {
    const rule = props.rule;
    
    if (rule.disable) {
        return (
            <BuildDisableRule expanded={props.expanded} disable={rule.disable} />
        );
    } else if (rule.range) {
        return (
            <BuildRangeRule expanded={props.expanded} range={rule.range} />
        );
    } else if (rule.stringLength) {
        return (
            <BuildStringLengthRule expanded={props.expanded} stringLength={rule.stringLength} />
        );
    } else if (rule.regularExpression) {
        return (
            <BuildRegularExpressionRule expanded={props.expanded} regularExpression={rule.regularExpression} />
        );
    } else if (rule.validValues) {
        return (
            <BuildValidValuesRule expanded={props.expanded} validValues={rule.validValues} />
        );
    } else if (rule.possibleValues) {
        return (
            <BuildPossibleValuesRule expanded={props.expanded} possibleValues={rule.possibleValues} />
        );
    } else if (rule.forceSet) {
        return (
            <BuildForceSetRule expanded={props.expanded} forceSet={rule.forceSet} />
        );
    }
    return(
        <List></List>
    );
}

function OptionRules(props) {
    const rules = props.rules;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };
    
    if (rules && Object.keys(rules).length > 0) {
        return (
            <List component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    rules
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {rules.map((rule) => (
                            <BuildOptionRule expanded={props.expanded} rule={rule} />
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    }
    return (
        <List component="div" disablePadding>
            <ListItem  disablePadding style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            rules
                        </Typography>
                    }
                />
            </ListItem>
        </List>
    );
}

export default function OptionDefinition(props) {
    const definition = props.definition;
    const [open, setOpen] = useState(props.expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    let background = props.style;
    if (!definition.isAvailable) {
        background = {
            backgroundColor : "rgba(187, 187, 187, 0.25)",
            marginLeft : props.style.marginLeft
        }
    }

    return (
        <List style={background} component="div" disablePadding>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {definition.optionName}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <>
                        {definition.description && 
                            <>
                                <PropertyItem primary="description" secondary={definition.description || ""} />
                                <Divider style={{ marginLeft: "40px" }} />
                            </>
                        }
                        <PropertyItem primary="isAvailable" secondary={definition.isAvailable+"" || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <OptionRules expanded={props.expanded} rules={definition.rules} />
                    </>
                </List>
            </Collapse>
        </List>
    );
}
