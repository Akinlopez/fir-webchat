import React from "react";
import { Card } from "react-bootstrap";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../../Services/firebaseConfig";
import images from "../../ProjectImages/ProjectImages";
import Moment from "react-moment";
import "./ChatBox.css";
import LoginString from "../Login/LoginStrings";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  currentPeerUser: {
    documentKey: string;
    id: string;
    name: string;
    URL: string;
    description: string;
  };
  showToast: (type: number, message: string) => void;
}

interface State {
  isLoading: boolean;
  isShowSticker: boolean;
  inputValue: string;
}

export default class ChatBox extends React.Component(Props, State) {
  private currentUserName: string | null = localStorage.getItem(
    LoginString.Name
  );
  private currentUserId: string | null = localStorage.getItem(LoginString.ID);
  private currentUserPhoto: string | null = localStorage.getItem(
    LoginString.PhotoURL
  );
  private currentUserDocumentId: string | null = localStorage.getItem(
    LoginString.FirebaseDocumentId
  );
  private stateChanged: string | null = localStorage.getItem(
    LoginString.UPLOAD_CHANGED
  );
  private currentPeerUser = this.props.currentPeerUser;
  private groupChatId: string | null = null;
  private listMessages: any[] = [];
  private currentPeerUserMessages: any[] = [];
  private removeListener: any = null;
  private currentPhotoFile: any[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,
      inputValue: "",
    };
  }

  componentDidMount() {
    this.getListHistory();
  }

  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser;
      this.getListHistory();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessages.length = 0;
    this.setState({ isLoading: true });

    if (
      this.hashString(this.currentUserId!) <=
      this.hashString(this.currentPeerUser.id)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`;
    } else {
      this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`;
    }

    //Get History and listen new data added
    (this.removeListener = firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((changes) => {
          if (changes.type === LoginString.DOC) {
            this.listMessages.push(changes.doc.data());
          }
        });
        this.setState({ isLoading: false });
      })),
      (err: any) => {
        this.props.showToast(0, err.toString());
      };
  };

  onSendMessage = (content: string, type: number) => {
    let notificationMessages: any[] = [];
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }
    if (content.trim() === "") {
      return;
    }
    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUser.id,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };
    firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId!)
      .collection(this.groupChatId!)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      });
    this.currentPeerUserMessages.map((item) => {
      if (item.notification != this.currentUserId) {
        notificationMessages.push({
          notificationId: item.notificationId,
          number: item.number,
        });
      }
    });
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentPeerUser.documentKey)
      .update({
        messages: notificationMessages,
      })
      .then((data) => {})
      .catch((err) => {
        this.props.showToast(0, err.toString);
      });
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };

  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
  };

  render() {
    return (
      <Card className="viewChatBoard">
        {/* Rest of the component */}
        <div className="headerChatBoard">
          <img
            className="viewAvatarItem"
            src={this.currentPeerUser.URL}
            alt=""
          />
          <span className="textHeaderChatBoard">
            <p style={{ fontSize: "20px" }}>{this.currentPeerUser.name}</p>
          </span>
          <div className="aboutme">
            <span>
              <p style={{ fontSize: "20px" }}>
                {this.currentPeerUser.description}
              </p>
            </span>
          </div>
        </div>
        <div className="viewListContentChat">
          {this.renderListMessage()}

          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
        </div>
        {this.isShowSticker ? this.renderSticker() : null}

        <div className="viewButton">
          <img
            className="icOpenGallery"
            src={images.input_file}
            alt="input_file"
            onclick={() => {
              this.refInput.click();
            }}
          />
          <img
            className="viewInputGallery"
            accept="images/*"
            type="file"
            onChange={this.onChoosePhoto}
          />
          <img
            className="icOpenSticker"
            src={images.sticker}
            alt="icon open sticker"
            onClick={this.openListSticker}
          />
          <input
            className="viewInput"
            placeholder="Type a message"
            value={this.state.inputValue}
            onChange={(event) => [
              this.setState({ inputValue: event.target.value }),
            ]}
            onKeyPress={this.onKeyPress}
          />
          <img
            className="icSend"
            src={images.send}
            alt="icon send"
            onClick={() => {
              this.onSendMessage(this.state.inputValue, 0);
            }}
          />
        </div>
        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"3 spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </Card>
    );
  }

  // Rest of the methods
  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      //Check this file is an image
      //console.log(localStorage PREFIX_IMAGE)
      const prefixFileType = event.target.files[0].type.toString();
      if (prefixFileType.indexOf("image/") === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };
  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString;
      const uploadTask = firebase
        .storae()
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.setState({ isLoading: false });
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadUrl().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      this.props.showToast(0, "File is null");
    }
  };

  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.IdFrom === this.currentUserId) {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewItemRight" key={item.timestamp}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img className="imgItemRight" src={item.content} alt="" />
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewItemRight" key={item.timestamp}>
                <img
                  className="imgItemRight"
                  src={this.getGifImage(item.content)}
                  alt="content message"
                />
              </div>
            );
          }
        } else {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="perrAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.content}</span>
                  </div>
                  {this.isLastMessageLeft(index) ? (
                    <span className="textTimeLeft">
                      <div className="time">
                        {moment(Number(item.timestamp)).foremate("11")}
                      </div>
                    </span>
                  ) : null}
                </div>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="perrAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft2">
                    <img
                      src={item.content}
                      alt="content message"
                      className="imgItemLeft"
                    />
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("11")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="perrAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft3" key={item.timestamp}>
                    <img className="imgItemRight" src={item.content} alt="" />
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).foremate("11")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return viewListMessage;
    } else {
      return (
        <div className="viewWrapSayHi">
          <span className="textSayHi">Say hi to new friend </span>
          <img className="imgWaveHand" src={images.wave_hand} alt="wave hand" />
        </div>
      );
    }
  };
  renderStickers = () => {
    return (
      <div className="viewStickers">
        <img
          className="imgSticker"
          src={images.logo2}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo2", 2);
          }}
        />

        <img
          className="imgSticker"
          src={images.logo3}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo3", 2);
          }}
        />

        <img
          className="imgSticker"
          src={images.logo4}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo4", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo5}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo5", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo6}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo6", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo7}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo7", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo8}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo8", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo9}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo9", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo10}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo10", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo11}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo11", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo12}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo12", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo13}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo13", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo14}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo14", 2);
          }}
        />
        <img
          className="imgSticker"
          src={images.logo15}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("logo15", 2);
          }}
        />
      </div>
    );
  };
  getGifImage = (value) => {
    switch (value) {
      case "logo2":
        return images.logo2;
      case "logo3":
        return images.logo3;
      case "logo4":
        return images.logo4;
      case "logo5":
        return images.logo5;
      case "logo6":
        return images.logo6;
      case "logo7":
        return images.logo7;
      case "logo7":
        return images.logo8;
      case "logo8":
        return images.logo9;
      case "logo9":
        return images.logo10;
      case "logo10":
        return images.logo11;
      case "logo12":
        return images.logo12;
      case "logo13":
        return images.logo13;
      case "logo14":
        return images.logo14;
      case "logo15":
        return images.logo315;
    }
  };
  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // Corrected the loop condition and the method call
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      // Simplifying the bitwise operation. The original line does nothing meaningful as (hash & hash) will always be hash itself.
    }
    return hash;
  };
  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
}
