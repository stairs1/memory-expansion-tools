import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import { spacing } from '@material-ui/system';

import { useAlert } from 'react-alert'

import "../styles.css";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    margin: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}
export default function TagBin(props) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
    const alert = useAlert();

    function deleteLabel(evt){
        console.log(evt);
        console.log(evt.currentTarget.value);
        alert.error('You just deleted tag : \"' + evt.currentTarget.value + '\".');
        props.deleter(evt.currentTarget.value);
    }

    function capitalizeFirstLetter(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   // Directly return the joined string
   return splitStr.join(' ');
}



  return (
    <div className={classes.root} key={props.title}>
        <div className="picker">
          <Typography className={classes.margin}>{capitalizeFirstLetter(props.title)}</Typography>
        </div>
          <div className="picker-colors">
            <Button onClick={deleteLabel} size="small" value={props.title}><DeleteIcon/></Button>
          </div>
       <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
      {props.talks != undefined && props.talks.map(function(talk, i){
          {console.log("yeah")}
        return <List dense={true}>
                <ListItem key={talk.talk}>
                  <ListItemText
                    primary={talk.talk}
                    secondary={talk.prettyTime}
                  />
                </ListItem>
            </List>;
    })}
          </div>
        </Grid>
            </Grid>
    </div>
  );
}
