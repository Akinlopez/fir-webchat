import React, { Component, ChangeEvent } from "react";
import "./Profile.css";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../../Services/firebaseConfig";
import images from "../../ProjectImages/ProjectImages";
import LoginString from "../Login/LoginStrings";

interface ProfileState {
  isLoading: boolean;
  documentKey: string | null;
  id: string | null;
  name: string | null;
  description: string | null;
  photoUrl: string | null;
}

export default class Profile extends Component({}, ProfileState) {
  newPhoto: File | null = null;
  refInput: HTMLInputElement | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: false,
      documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
      id: localStorage.getItem(LoginString.ID),
      name: localStorage.getItem(LoginString.Name),
      description: localStorage.getItem(LoginString.Description),
      photoUrl: localStorage.getItem(LoginString.PhotoURL),
    };
  }

  componentDidMount() {
    if (!localStorage.getItem(LoginString.ID)) {
      this.props.history.push("/");
    }
  }

  onChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value,
    });
  };

  onChangeAboutMe = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: event.target.value,
    });
  };

  onChangeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const prefixfiletype = event.target.files[0].type.toString();
      if (prefixfiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
        this.props.showToast(0, "This file is not an image");
        return;
      }
      this.newPhoto = event.target.files[0];
      this.setState({ photoUrl: URL.createObjectURL(event.target.files[0]) });
    } else {
      this.props.showToast(0, "Something wrong with input file");
    }
  };

  uploadAvatar = () => {
    this.setState({ isLoading: true });
    if (this.newPhoto) {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(this.state.id || "")
        .put(this.newPhoto);
      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      this.updateUserInfo(false, null);
    }
  };

  updateUserInfo = (isUpdatedPhotoURL: boolean, downloadURL: string | null) => {
    let newinfo;
    if (isUpdatedPhotoURL) {
      newinfo = {
        name: this.state.name,
        Description: this.state.description,
        URL: downloadURL,
      };
    } else {
      newinfo = {
        name: this.state.name,
        Description: this.state.description,
      };
    }
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.documentKey || "")
      .update(newinfo)
      .then(() => {
        localStorage.setItem(LoginString.Name, this.state.name || "");
        localStorage.setItem(LoginString.Description, this.state.description || "");
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <div className="profileroot">
        <div className="headerprofile">
          <span>PROFILE</span>
        </div>
        <img className="avatar" alt="" src={this.state.photoUrl || ""} />
        <div className="viewWrapInputFile">
          <img
            className="imgInputFile"
            alt="icon gallery"
            src={images.Olajide}
            onClick={() => {
              this.refInput?.click();
            }}
          />
          <input
            ref={(el) => (this.refInput = el)}
            accept="images/*"
            className="viewInputFile"
            type="file"
            onChange={this.onChangeAvatar}
          />
        </div>
        <span className="textLabel">Name</span>
        <input
          className="textInput"
          value={this.state.name || ""}
          placeholder="Your nickname..."
          onChange={this.onChangeNickname}
        />
        <span className="textLabel">About Me</span>
        <input
          className="textInput"
          value={this.state.description || ""}
          placeholder="Tell about yourself..."
          onChange={this.onChangeAboutMe}
        />
        <div>
          <button className="btnupdate" onClick={this.uploadAvatar}>
            SAVE
          </button>
          <button
            className="btnback"
            onClick={() => {
              this.props.history.push("/chat");
            }}
          >
            BACK
          </button>
        </div>
        {this.state.isLoading ? (
          <div>
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
