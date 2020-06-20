import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import { ChatList } from "react-chat-elements";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  leaveBtn: {
    position: "absolute",

    bottom: 10,
  },
}));

export default function PermanentDrawerLeft({ users }) {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <Divider />
      <ChatList className="chat-list" dataSource={users} />
      <Link
        className={classes.leaveBtn}
        to={"/"}
        component={Button}
        fullWidth
        variant="contained"
        color="secondary"
      >
        {/* <Button fullWidth variant="contained" color="secondary"> */}
        Leave Room
        {/* </Button> */}
      </Link>
    </Drawer>
  );
}
