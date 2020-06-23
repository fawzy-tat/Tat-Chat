import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import queryString from "query-string";
import { useLocation } from "react-router";
import io from "socket.io-client";
import "react-chat-elements/dist/main.css";
// MessageBox component
import { SystemMessage } from "react-chat-elements";
import { MessageList } from "react-chat-elements";

import { Input } from "react-chat-elements";
import Button from "@material-ui/core/Button";
import PermanentDrawerLeft from "./PermanentDrawerLeft";

//Drawer
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

let socket;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  stickyInput: {
    position: "fixed",
    bottom: 0,
    left: "250px",
    right: "250px",
  },
  inputBtn: {
    right: "260px",
  },
}));
const drawerWidth = 240;
const Chat = () => {
  const classes = useStyles();
  const location = useLocation();

  const Endpoint = "localhost:5000";
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [adminMessages, setAdminMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(Endpoint);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    socket.on("message", (message) => {
      if (message.user === "admin") {
        setAdminMessages((adminMessages) => [...adminMessages, message]);
      } else {
        const newMessage = {
          position: message.user === name ? "right" : "left",
          type: "text",
          text: message.text,
          date: new Date(),
        };
        setMessages((messages) => [...messages, newMessage]);
      }
    });

    socket.on("roomData", ({ users }) => {
      // console.log(users);
      const updatedUsers = users.map((user) => {
        return {
          avatar: "https://picsum.photos/200/300",
          alt: "Reactjs",
          title: user.name,
        };
      });

      setUsers(updatedUsers);
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      socket.emit("disconnect");
      socket.off();
    };
  }, [Endpoint, location.search]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };
  console.log(name);
  console.log(room);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Tat Chat
          </Typography>
        </Toolbar>
      </AppBar>
      <PermanentDrawerLeft users={users} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {adminMessages.map((adminMessage) => {
          return <SystemMessage text={adminMessage.text} />;
        })}

        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={"100%"}
          dataSource={messages}
        />

        <Input
          placeholder="Type here..."
          multiline={true}
          className={classes.stickyInput}
          // onChange={(e) => setMessage(e.target.value)}
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
          rightButtons={
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              className={classes.inputBtn}
            >
              Send
            </Button>
          }
        />
      </main>
    </div>
  );
};

export default Chat;
