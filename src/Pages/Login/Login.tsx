import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../Services/firebaseConfig";
import LoginString from "../Login/LoginStrings";
import "./Login.css";
import { Card } from "react-bootstrap";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

interface Props {}

interface State {
  isLoading: boolean;
  error: string;
  email: string;
  password: string;
}

export default class Login extends Component(Props, State) {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      error: "",
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    this.setState({ [name]: value } as Pick<State, keyof State>);
  }

  async componentDidMount() {
    if (localStorage.getItem(LoginString.ID)) {
      this.setState({ isLoading: false }, () => {
        this.props.showToast(1, "Login success");
        this.props.history.push("./chat");
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({ error: "" });
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (result) => {
        let user = result.user;
        if (user) {
          await firebase
            .firestore()
            .collection("users")
            .where("id", "==", user.uid)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const currentdata = doc.data();
                localStorage.setItem(LoginString.FirebaseDocumentId, doc.id);
                localStorage.setItem(LoginString.ID, currentdata.id);
                localStorage.setItem(LoginString.Name, currentdata.name);
                localStorage.setItem(LoginString.Email, currentdata.email);
                localStorage.setItem(
                  LoginString.Password,
                  currentdata.password
                );
                localStorage.setItem(LoginString.PhotoURL, currentdata.URL);
                localStorage.setItem(
                  LoginString.Description,
                  currentdata.description
                );
              });
            });
        }
        this.props.history.push("./chat");
      })
      .catch((error) => {
        this.setState({
          error: "Error while signing in, please try again",
        });
      });
  }

  render() {
    const paper = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
    };
    const rightcomponent = {
      boxShadow: "0 80px 80px #808888",
      backgroundColor: "smokeygrey",
    };
    const root = {
      height: "100vh",
      background: "linear-gradient(90deg, #e3ffe7 0%, #d3e77ff 100%)",
      marginBottom: "50px",
    };
    const Signinsee = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      marginBottom: "20px",
      backgroundColor: "#1ebea5",
      width: "100%",
      boxShadow: "0 5px 5px #808888",
      height: "10rem",
      paddingTop: "48px",
      opacity: "0.5",
      borderBottom: "5px solid green",
    };
    const form = {
      width: "100%",
      marginTop: "50px",
    };
    const Avatar = {
      backgroundColor: "green",
    };

    const { error, email, password } = this.state;

    return (
      <Grid container component="main" style={root}>
        <CssBaseline />
        <Grid item xs={1} sm={4} md={7} className="image">
          <div className="image1"></div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          style={rightcomponent}
          elevation={6}
          square
        >
          <Card style={Signinsee}>
            <div>
              <Avatar style={Avatar}>
                <LockOutlinedIcon width="50px" height="50px" />
              </Avatar>
            </div>
            <div>
              <Typography component="h1" variant="h5" />
              Sign In To
            </div>
            <div>
              <Link to="/">
                <button className="btn">
                  <i className="fa fa-home"></i>
                  WebChat
                </button>
              </Link>
            </div>
          </Card>
          <div style={paper}>
            <form style={form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={email}
              />
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
                onChange={this.handleChange}
                value={password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Typography component="h6" variant="h5">
                {error ? <p className="text.danger">{error}</p> : null}
              </Typography>

              <div className="CenterAliningItems">
                <button className="button1" type="submit">
                  <span>Login In</span>
                </button>
              </div>
              <div className="CenterAliningItems">
                <p>Don't have an account ?</p>
                <Link to="/Signup" variant="body2">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}
