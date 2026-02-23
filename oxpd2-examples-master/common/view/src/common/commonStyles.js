import { makeStyles } from '@mui/styles';
import { indigo, red, green, orange, grey, blue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(.5),
        top: theme.spacing(.5),
        color: theme.palette.grey[500],
    },
    dialogTextField: {
        marginTop: 8,
        marginBottom: 8,
    },
    textFieldGrid: {
        marginTop: 14,
        marginBottom: 14,
    },
    appBar: {
        transition: '.5s',
        display: 'inline-grid',
    },
    loading: {
        marginTop: 10,
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
    table: {
        minWidth: 450,
    },
    tableIdCell: {
        width: 350
    },
    row: {
        cursor: "pointer",
    },
    selected: {
        backgroundColor: indigo[50] + '!important',
        color: "#fff !important",
        "&:hover": {
            backgroundColor: "transparent !important",
        },
    },
    hoverx: {
        "&:hover": {
            backgroundColor: grey[50] + "!important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
    statusChipGood: {
        minWidth: '80px',
        color: '#fff',
        backgroundColor: green[500]
    },
    statusChipMostlyGood: {
        minWidth: '80px',
        color: '#000',
        backgroundColor: green[100]
    },
    statusChipBad: {
        minWidth: '80px',
        color: '#fff',
        backgroundColor: red[500]
    },
    statusChipTransitional: {
        minWidth: '80px',
        color: '#fff',
        backgroundColor: blue[800]
    },
    statusChipWarning: {
        minWidth: '80px',
        color: '#fff',
        backgroundColor: orange[800]
    },
    statusChipNeutral: {
        minWidth: '80px',
        color: '#fff',
        backgroundColor: grey[700]
    },
    statusChipIcon: {
        color: '#fff',
    },
    json: {
        borderRadius: '5px',
        border: '1px solid #0a0a0f',
        background: '#f0f0f5',
        padding: '5px',
        fontFamily: 'Monospace',
        fontSize: '12pt',
        overflowY: 'auto',
        overflowX: 'auto',
        minHeight: '300px',
        maxHeight: '300px',
        maxWidth: '1200px'
    },
    largeScrollingBox: {
        border: '1px solid #C8C8C8',
        borderRadius: '2px',
        maxHeight: '300px',
        maxWidth: '1200px',
        overflowX: 'auto',
        overflowY: 'auto',
        wordWrap: 'break-word'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    },
    avatarSmall: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    avatarLarge: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
}), { defaultTheme: theme });

const baseTabStyles = {
    TabIndicatorProps: {
        style: {
            backgroundColor: 'red'
        }
    },
    sx: {
        '& .MuiTab-root': {
            color: 'rgba(0, 0, 0, 0.6)',
            paddingLeft: '20px',
            paddingRight: '20px',
        },
        '& .Mui-selected': {
            color: 'black !important',
        }
    }
};

export {
    useStyles,
    baseTabStyles
}
