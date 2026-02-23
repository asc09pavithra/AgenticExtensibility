import React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

function BindableStringValue({ name, bindedValue }) {
    if (bindedValue && bindedValue.expression) {
        return (
            <React.Fragment>
                <PropertyHeader name={name} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    {(bindedValue.expression.expressedValue !== undefined && bindedValue.expression.expressedValue !== null) &&
                        <React.Fragment>
                            <PropertyItem primary="expressedValue" secondary={String(bindedValue.expression.expressedValue)} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </React.Fragment>
                    }
                    <PropertyItem primary="expressionPattern" secondary={bindedValue.expression.expressionPattern} />
                </List>
            </React.Fragment>
        )
    }
    else if (bindedValue && bindedValue.explicit) {
        return (
            <React.Fragment>
                <PropertyHeader name={name} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="explicitValue" secondary={String(bindedValue.explicit.explicitValue)} />
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function BuildLocalizedStringList({ name, localizedString }) {
    if (localizedString) {
        return (
            <React.Fragment>
                <PropertyHeader name={name} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="stringId" secondary={localizedString.stringId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="i18nAssetId" secondary={localizedString.i18nAssetId || ""} />
                </List>
            </React.Fragment>
        );
    }
    return null;
}

function PropertyHeader({ name }) {
    return (
        <ListItem style={{ paddingLeft: "40px" }}>
            <ListItemText disableTypography
                primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px", marginBottom: "-20px" }}>{name}</Typography>}
            />
        </ListItem>
    )
}

function PropertyItem({ primary, secondary }) {
    return (
        <ListItem style={{ paddingLeft: "40px" }}>
            <ListItemText disableTypography
                primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>{primary}</Typography>}
                secondary={<Typography type="body1" style={{ fontSize: "18px" }}>{secondary}</Typography>}
            />
        </ListItem>
    );
}

function PropertyItemWithDivider({ primary, secondary }) {
    return (
        <React.Fragment>
            <ListItem style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>{primary}</Typography>}
                    secondary={<Typography type="body1" style={{ fontSize: "18px" }}>{secondary}</Typography>}
                />
            </ListItem>
            <Divider style={{ marginLeft: "40px" }} />
        </React.Fragment>
    );
}

function PropertyItemNoStyle({ primary, secondary, style }) {
    return (
        <ListItem style={style}>
            <ListItemText disableTypography
                primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>{primary}</Typography>}
                secondary={<Typography type="body1" style={{ fontSize: "18px" }}>{secondary}</Typography>}
            />
        </ListItem>
    );
}

export {
    BindableStringValue,
    BuildLocalizedStringList,
    PropertyHeader,
    PropertyItem,
    PropertyItemNoStyle,
    PropertyItemWithDivider
}
