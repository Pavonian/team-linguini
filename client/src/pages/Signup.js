import React, { useState } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AuthForm, RedirectDiv } from "../components/auth";
import { authStyle } from "../themes/signup.style";
import {
  fetchUserFailure,
  fetchUserSuccess,
  fetchUserRequest,
  setIsAuthenticated,
} from "../context/auth/auth.action";
import { useAuth } from "../context/auth/auth.provider";

const Signup = () => {
  const auth = useAuth();
  const { dispatchIsAuthenticated, dispatchUser } = auth;

  const [serverResponse, setServerResponse] = useState("");

  //Classes of CSS style
  const classes = makeStyles(authStyle)();

  //Callback for the form submission after validation
  const onSubmit = (values) => {
    const { email, password } = values;

    //Make a request to backend
    const url = "/api/v1/auth/register";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        //If success to create a new account, redirect to login page
        if (!res.error) {
          //Save data on local storage
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("token", JSON.stringify(res.token));

          //Update the state of Auth providers
          dispatchIsAuthenticated(setIsAuthenticated(true));
          dispatchUser(fetchUserSuccess(res.user));
          console.log("login successfully");

          //Redirect to dashboard
          window.location.replace("/");
        } else {
          throw Error(res.error);
        }
      })
      .catch((e) => {
        // console.log(e);
        dispatchUser(fetchUserFailure(e.message));
        setServerResponse(e.message);
      });
  };
  return (
    <Grid container className={classes.vh100}>
      <Grid item md={6} xs={12} className={classes.img}>
        {/*<img alt='' src={"/images/image1.png"} className={classes.img}/>*/}
      </Grid>
      <Grid item md={6} xs={12}>
        <AuthForm
          title="Sign up to Kanban"
          input1="Enter email"
          input2="Create Password"
          submit="Sign up"
          onSubmit={onSubmit}
          serverResponse={serverResponse}
        />
        <RedirectDiv
          title={"Already have an account?"}
          link={"/login"}
          desc={"Login"}
        />
      </Grid>
    </Grid>
  );
};

export { Signup };
