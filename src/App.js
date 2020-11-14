import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  // USE EFFECTS

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update the username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
      return () => {
        //perform some cleanup
        unsubscribe();
      }
    });
  }, [user, username]);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
    })));
  })
}, []);

const handleClose = () => {
  setOpen(false);
};

const signUp = (event) => {
  event.preventDefault();

  auth
  .createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    authUser.user.updateProfile({
      displayName: username,
    })
  })
  .catch((error) => alert(error.message))
}

const signIn = (event) => {
  event.preventDefault();

  auth.signInWithEmailAndPassword(email, password)
  .catch((error) => alert(error.message))

  setOpenSignIn(false);
}

  return (
    <div className="app">

      {/* MODAL */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              ></img>
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Input>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* SIGNED IN */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              ></img>
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      {/* HEADER */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          ></img>

          {/* SIGNUP / LOGIN BUTTONS */}
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      {/* POSTS MAPPING + INSTAGRAM EMBED*/}
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL}></Post>
            ))
          }
        </div>
      
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CAjVp1nj0F8/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* Image Upload */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;