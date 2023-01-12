import { useContext } from "react";
import { GlobalContext } from '../context/Context';

import axios from "axios";
import { Formik, Form, Field, useFormik } from 'formik';
import * as yup from 'yup';
import {
    BooleanSchema,
    DateSchema,
    MixedSchema,
    NumberSchema,
    ArraySchema,
    ObjectSchema,
    StringSchema,
} from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';


import { useState } from "react";
import "./signup.css";




function ForgetPassword() {

    let { state, dispatch } = useContext(GlobalContext);



    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [getEmail, setGetEmail] = useState("");
    const [getOtp, setGetOtp] = useState("");
    const [getNewPassword, setGetNewPassword] = useState("");
    const [loadOtp, setLoadOtp] = useState(false);
    const [putOtp, setPutOtp] = useState(false);





    let handleClose = () => {
        setSuccessOpen(false);
        setErrorOpen(false);
    }

    const validationSchema = yup.object({
        email: yup
            .string('Enter a Valid Email')
            .email('Enter a Valid Email')
            // .isValid('enter a valid email')
            .required('email is Required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);
            setGetEmail(formik.values.email);

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password`, {
                    email: formik.values.email,

                }, {
                    withCredentials: true
                })

                setLoadOtp(true)
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);
                // dispatch({type: 'USER_LOGIN', payload: response.data.profile })

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    const formikOtp = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);
            setGetOtp(formikOtp.values.otp)

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-1`, {
                    email: getEmail,
                    otp: formikOtp.values.otp

                }, {
                    withCredentials: true
                })
                setPutOtp(true);
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);
                // dispatch({type: 'USER_LOGIN', payload: response.data.profile })

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    const formikPassword = useFormik({
        initialValues: {
            newPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-2`, {
                    email: getEmail,
                    otp: getOtp,
                    password: formikPassword.values.newPassword

                }, {
                    withCredentials: true
                })
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);
                // dispatch({type: 'USER_LOGIN', payload: response.data.profile })

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    return (
        <div>

            {(!loadOtp && !putOtp) ?
                <form className="form" onSubmit={formik.handleSubmit}>

                    <TextField
                        id="email"
                        name="email"
                        label="Enter your Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Send OTP
                        </Button>
                        :
                        <CircularProgress />
                    }



                    {/* Successfully Alert */}

                    <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            {successMessage}
                        </Alert>
                    </Snackbar>

                    {/* Error Alert */}

                    <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {errorMessage};
                        </Alert>
                    </Snackbar>
                </form>
                :
                null
            }

            {(loadOtp && !putOtp) ?
                <form className="form" onSubmit={formikOtp.handleSubmit}>

                    <TextField
                        id="otp"
                        name="otp"
                        label="Enter 5 Digit OTP"
                        type="text"
                        value={formikOtp.values.otp}
                        onChange={formikOtp.handleChange}
                        error={formikOtp.touched.otp && Boolean(formikOtp.errors.otp)}
                        helperText={formikOtp.touched.otp && formikOtp.errors.otp}
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Confirm OTP
                        </Button>
                        :
                        <CircularProgress />
                    }



                    {/* Successfully Alert */}

                    <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            {successMessage}
                        </Alert>
                    </Snackbar>

                    {/* Error Alert */}

                    <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {errorMessage};
                        </Alert>
                    </Snackbar>
                </form>
                :
                null
            }

            {(loadOtp && putOtp) ?
                <form className="form" onSubmit={formikPassword.handleSubmit}>


                    <TextField
                        id="newPassword"
                        name="newPassword"
                        label="Enter New Password"
                        type="password"
                        value={formikPassword.values.newPassword}
                        onChange={formikPassword.handleChange}
                        error={formikPassword.touched.newPassword && Boolean(formikPassword.errors.newPassword)}
                        helperText={formikPassword.touched.newPassword && formikPassword.errors.newPassword}
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Change Password
                        </Button>
                        :
                        <CircularProgress />
                    }



                    {/* Successfully Alert */}

                    <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            {successMessage}
                        </Alert>
                    </Snackbar>

                    {/* Error Alert */}

                    <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {errorMessage};
                        </Alert>
                    </Snackbar>
                </form>
                :
                null
            }


        </div>
    )
}
export default ForgetPassword;