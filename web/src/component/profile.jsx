import { useContext } from "react";
import { GlobalContext } from '../context/Context';
import { useState, useEffect } from "react"
import axios from "axios";
import { Formik, Form, Field, useFormik } from 'formik';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import moment from "moment"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import CancelIcon from '@mui/icons-material/Cancel';
// import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';

import coverImage from "../images/coverPhoto1.png";
import profileImage from "../images/profilePhoto1.jpg";
import InfiniteScroll from 'react-infinite-scroller';

// import { AiTwotoneEdit } from 'react-icons/ai';
import { GrUpdate } from 'react-icons/gr';
import SearchAppBar from "./header";
import Grid from '@mui/material/Grid';
import "./product.css";
// import SearchAppBar from './header'



function Profile() {
  let { state, dispatch } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [failDeleteOpen, setFailDeleteOpen] = useState(false);
  const [updatedOpen, setUpdatedOpen] = useState(false);
  const [failUpdatedOpen, setFailUpdatedOpen] = useState(false);
  const [loadPosts, setLoadPosts] = useState(false);
  const [eof, setEof] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);
  const [currentPosts, setCurrentPosts] = useState(null);
  const [failedMessage, setFailedMessage] = useState("");
  const [preview, setPreview] = useState("");




  const getAllPosts = async () => {
    if (eof) return;
    try {
      const response = await axios.get(`${state.baseUrl}/posts?page=${posts.length}`, {
        withCredentials: true
      })
      if (response.data.data.length === 0) setEof(true);
      console.log("response: ", response);
      console.log("data: ", response.data)
      setPosts((prev) => {
        return [...prev, ...response.data.data]
      });
      console.log("posts: ", posts);
    }
    catch (error) {
      console.log("error in getting all Products: ", error);
    }
  }

  useEffect(() => {
    getAllPosts();

  }, [loadPosts])



  let handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
    setDeleteOpen(false);
    setFailDeleteOpen(false);
    setUpdatedOpen(false);
    setFailUpdatedOpen(false);
  }

  let deletePost = async (_id) => {
    try {
      const response = await axios.delete(`${state.baseUrl}/post/${_id}`)
      console.log("response: ", response.data);
      setLoadPosts(!loadPosts);
      setDeleteOpen(true);
    }
    catch (error) {
      console.log("requested failed: ", error);
      setFailDeleteOpen(true);
    }
  }
  let editPost = (post) => {
    setClickEdit(!clickEdit);
    setCurrentPosts(post);
    editFormik.setFieldValue("text", post.text)
  }





  const validationSchema = yup.object({
    text: yup
      .string('Enter Post Text')
      .required('Text is Required'),
  });
  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {


      dispatch({ type: 'CLICK_LOGIN' });
      console.log("values: ", values);

      let postImage = document.getElementById("pictures");
      console.log("picture :", postImage.files[0]);
      let formData = new FormData();
      formData.append("myFile" , postImage.files[0]);
      formData.append("text" , formik.values.text);

      axios({
        method: "post" ,
        url: `${state.baseUrl}/post`,
        data: formData,
        headers: {'Content-Type' : 'multipart/form-data'}
      })
      .then(response => {
        dispatch({ type: 'CLICK_LOGOUT' });
        let message = response.data.message;
        console.log("message: ", message)
        console.log("response: ", response.data);
        setOpen(true);
        setLoadPosts(!loadPosts);
        setPreview("");
        formik.resetForm();
      })
      .catch(err => {
        dispatch({ type: 'CLICK_LOGOUT' });
        console.log("error: ", err);
        setFailedMessage(err.data.message);
        setErrorOpen(true);
      })
    },
  });
  const editFormik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values: ", values);
      setClickEdit(!clickEdit);
      axios.put(`${state.baseUrl}/post/${currentPosts._id}`, {

        text: editFormik.values.text,
      })
        .then(response => {
          setUpdatedOpen(true);
          let message = response.data.message;
          console.log("message: ", message)
          console.log("response: ", response.data);
          setLoadPosts(!loadPosts);
          formik.resetForm();


        })
        .catch(err => {
          setFailUpdatedOpen(true);
          console.log("error: ", err);
        })
    },
  });
  console.log("state", state);




  return (
    <div>
      <div className="cover">
        <img src={coverImage} alt="" />
      </div>
      <div className="profile">
        <img src={profileImage} alt="" />
        <span> {state?.user?.firstName}  {state?.user?.lastName} </span>
      </div>
      {/* <SearchAppBar /> */}
      <form className="pForm" onSubmit={formik.handleSubmit}>
        <TextField


          multiline
          rows={5}
          variant="filled"

          id="text"
          name="text"
          label="Text:"
          placeholder="What's on your mind"
          value={formik.values.text}
          onChange={formik.handleChange}
          error={formik.touched.text && Boolean(formik.errors.text)}
          helperText={formik.touched.text && formik.errors.text}
        />
        <br />
        <br />
        <input
          type="file"
          id="pictures"
          accept="image/*"
          onChange={(e) => {
            let url = URL.createObjectURL(e.currentTarget.files[0]);
            console.log("URL :" , url);
            setPreview(url);
          }}
        />
        <br />
        <img src={preview} width={200} alt="" />
        <br />

        {(state.clickLoad === false) ?

          <Button color="primary" variant="contained" type="submit">
            Post
          </Button>
          :
          <CircularProgress />
        }



        {/* Successfully Alert */}

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Posted!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {failedMessage}!
          </Alert>
        </Snackbar>

        {/* Succfull Alert */}

        <Snackbar open={deleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Profile deleted Successfully!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={failDeleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Requested failed to Delete Profile!
          </Alert>
        </Snackbar>

      </form>
      <Snackbar open={updatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Profile Edited Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={failUpdatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Requested failed to Edit Profile!
        </Alert>
      </Snackbar>
      <br />
      <br />
      <InfiniteScroll
        pageStart={0}
        loadMore={getAllPosts}
        hasMore={!eof}
        loader={<center><div className="loader" key={0}><CircularProgress /></div></center>}
      >
        <div style={{ alignSelf: "center" }}>
          {posts?.map((eachPost, i) => (
            <div key={i} className="card">
              <div className="postP">
                <Avatar className="pof" src={profileImage} sx={{ height: 55, width: 55, top: 17 }} />
                <div className="nam">
                  <h3><b>{eachPost?.owner?.firstName} {eachPost?.owner?.lastName}</b></h3>
                  <p>{moment(eachPost.createdOn).fromNow()}</p>
                </div>
              </div>
              <br />
              <p>{eachPost?.text}</p>
              <IconButton aria-label="delete" size="large" color="red" style={{ color: "red" }} onClick={() => {
                deletePost(eachPost?._id)
              }} >
                <DeleteIcon fontSize="inherit" color="red" />
              </IconButton>
              {
                (clickEdit && currentPosts._id === eachPost._id) ? <IconButton aria-label="cancel" size="large" color="orange" style={{ color: "orange" }} onClick={() => {
                  editPost(eachPost)
                }} >
                  <CancelIcon fontSize="inherit" color="orange" />
                </IconButton> :
                  <IconButton aria-label="edit" size="large" color="green" style={{ color: "green" }} onClick={() => {
                    editPost(eachPost)
                  }} >
                    <EditIcon fontSize="inherit" color="green" />
                  </IconButton>
              }


              {
                (clickEdit && currentPosts._id === eachPost._id) ?
                  <div>
                    <form className="form" onSubmit={editFormik.handleSubmit}>
                      <TextField


                        multiline
                        rows={5}
                        variant="filled"

                        id="text"
                        name="text"
                        label="Text:"
                        placeholder="What's on your mind"
                        value={editFormik.values.text}
                        onChange={editFormik.handleChange}
                        error={editFormik.touched.text && Boolean(editFormik.errors.text)}
                        helperText={editFormik.touched.text && editFormik.errors.text}
                      />
                      <br />
                      <br />

                      <IconButton color="primary" variant="contained" type="submit">

                        <GrUpdate />

                      </IconButton>


                    </form>

                  </div>
                  : null
              }



            </div>

          ))
          }
        </div>
      </InfiniteScroll>



    </div>

  )

}
export default Profile;