import React, { useState } from 'react';
import { Box, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'; import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function AddTag(props) {
  const classes = useStyles();
  const [label, setLabel] = useState();

    function handleSubmit(evt){
        evt.preventDefault();
        console.log(evt);
        props.adder(label);
    }

  function handleLabelChange(evt) {
      setLabel(evt.target.value);
  };



  return (
      <div>
      <Typography variant="h7">
        Add New Label
      </Typography>
        <form onSubmit={handleSubmit}>
          <TextField type="text" label="Add a new tag/label." onChange={handleLabelChange} value={label}/> 
        <br />
            <Button type="submit" id="submit">Add Tag</Button>
        </form>
      </div>
  );
}
