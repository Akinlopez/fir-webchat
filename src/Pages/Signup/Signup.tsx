import React, { Component, ChangeEvent, FormEvent } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import "./Signup.css";
import { grey } from "@mui/material/colors";
import { Card } from "react-bootstrap";
import firebase from "../../Services/firebaseConfig";
import LoginString from "../Login/LoginStrings";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SignupState {
  email: string;
  password: string;
  name: string;
  error: string | null;
}

export default class Signup extends Component(
  RouteComponentProps,
  SignupState
 ) {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      [event.target.name]: event.target.value,
    } as Pick<SignupState, keyof SignupState>);
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { name, password, email } = this.state;

    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await firebase.firestore().collection("users").add({
        name,
        id: result.user?.uid,
        email,
        password,
        URL: "",
        description: "",
        messages: [{ notificationId: "", number: 0 }],
      });
      localStorage.setItem(LoginString.ID, result.user?.uid || "");
      localStorage.setItem(LoginString.Name, name);
      localStorage.setItem(LoginString.Email, email);
      localStorage.setItem(LoginString.Password, password);
      localStorage.setItem(LoginString.PhotoURL, "");
      localStorage.setItem(LoginString.UPLOAD_CHANGED, "state_changed");
      localStorage.setItem(LoginString.Description, "");
      localStorage.setItem(LoginString.FirebaseDocumentId, "");
      this.setState({
        email: "",
        password: "",
        name: "",
      });
      this.props.history.push("/chat");
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { email, password, name, error } = this.state;

    const Signinsee = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      backgroundColor: "#1ebea5",
      width: "100%",
      boxShadow: "0 5px 5px #008888",
      height: "10rem",
      paddingTop: "48px",
      opacity: "0.5",
      borderBottom: "5px solid green",
    };

    return (
      <div>
        <CssBaseline />
        <Card style={Signinsee}>
          <div>
            <Typography component="h1" variant="h5">
              Sign Up To
            </Typography>
          </div>
          <div>
            <Link to="/">
              <button className="btn">
                <i className="fa fa-home"></i>WebChat
              </button>
            </Link>
          </div>
        </Card>
        <Card className="formacontrooutside">
          <form className="customform" noValidate onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address-example:abc@gmail.com"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.handleChange}
              value={email}
            />
            <div>
              <p style={{ color: grey, fontSize: "15px", marginLeft: "0" }}>
                Password: length Greater than 6(alphabet, number, special
                character)
              </p>
            </div>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              onChange={this.handleChange}
              value={password}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              type="text"
              autoComplete="name"
              autoFocus
              onChange={this.handleChange}
              value={name}
            />
            <div>
              <p style={{ color: grey, fontSize: "15px" }}>
                Please fill all the fields and password should be greater than
                6
              </p>
            </div>
            <div className="CenterAliningItems">
              <button className="button1" type="submit">
                <span> Sign Up </span>
              </button>
            </div>
            <div>
              <p style={{ color: "grey" }}>Already have an account?</p>
              <Link to="/login">Login In</Link>
            </div>
            <div className="error">
              <p id="1" style={{ color: "red" }}>
                {error}
              </p>
            </div>
          </form>
        </Card>
      </div>
    );
  }
}
