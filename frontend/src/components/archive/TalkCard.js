import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Box, Divider, ButtonBase } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function TalkCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      <Box m={2}>
    <Card className={classes.root}>
      <div onClick={handleExpandClick}>
      <CardContent>
        <Typography variant="body1" component="p">
            {props.data.prettyTime} : {props.data.talk}
        </Typography>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider />
        <CardContent>
          <Typography variant="body2" paragraph>
                Address: {props.data.address}
          </Typography>
          <Typography variant="body2" paragraph>
                GPS: {props.data.latitude}, {props.data.longitude}      
          </Typography>
        </CardContent>
      </Collapse>
      </div>
    </Card>
      </Box>
  );
}
