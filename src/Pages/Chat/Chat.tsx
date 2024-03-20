import React, { Component } from 'react';
import firebase from '../../Services/firebaseConfig';
import './Chat.css';
import ReactLoading from 'react-loading';
import ChatBox from '../ChatBox/ChatBox';
import WelcomeCard from '../Welcome/Welcome';
import { RouteComponentProps } from 'react-router-dom';
import LoginString from '../Login/LoginStrings';
import Moment from "react-moment";


interface User {
  key: number;
  id: string;
  name: string;
  URL: string;
}

interface Message {
  NotificationId: string;
  number: number;
}

interface State {
  isLoading: boolean;
  isOpenDialogConfirmLogout: boolean;
  currentPeerUser: User | null;
  displayedContactSwitchedNotification: Message[];
  displayedContacts: JSX.Element[];
}

export default class Chat extends Component (Props, State) {
  private currentUserName: string | null = localStorage.getItem(LoginString.Name);
  private currentUserId: string | null = localStorage.getItem(LoginString.ID);
  private currentUserPhoto: string | null = localStorage.getItem(LoginString.PhotoURL);
  private currentUserDocumentId: string | null = localStorage.getItem(LoginString.FirebaseDocumentId);
  private currentUserMessages: Message[] = [];
  private searchUsers: User[] = [];
  private notificationMessagesErase: Message[] = [];

  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      displayedContactSwitchedNotification: [],
      displayedContacts: [],
    };
    this.onProfileClick = this.onProfileClick.bind(this);
    this.getListUser = this.getListUser.bind(this);
    this.renderListUser = this.renderListUser.bind(this);
    this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
    this.notificationErase = this.notificationErase.bind(this);
    this.updaterenderList = this.updaterenderList.bind(this);
  }

  logout = () => {
    firebase.auth().signOut();
    this.props.history.push("/");
    localStorage.clear();
  };

  onProfileClick = () => {
    this.props.history.push("/profile");
  };

  componentDidMount() {
    firebase.firestore()
      .collection("users")
      .doc(this.currentUserDocumentId || "")
      .get()
      .then((doc) => {
        doc.data()?.messages.map((item: Message) => {
          this.currentUserMessages.push({
            NotificationId: item.NotificationId,
            number: item.number,
          });
        });
        this.setState({
          displayedContactSwitchedNotification: this.currentUserMessages,
        });
      });
    this.getListUser();
  }

  getListUser = async () => {
    const result = await firebase.firestore().collection("users").get();
    if (result.docs.length > 0) {
      let listUsers: User[] = [];
      listUsers = result.docs.map((item, index) => {
        return {
          key: index,
          id: item.id,
          name: item.data().name,
          URL: item.data().URL,
        };
      });
      this.searchUsers = [...listUsers];
      this.setState({
        isLoading: false,
      });
    }
    this.renderListUser();
  };

  getClassnameforUserandNotification = (itemId: string) => {
    let number = 0;
    let className = "";
    let check = false;
    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = "viewWrapItemfocused";
    } else {
      this.state.displayedContactSwitchedNotification.forEach((item) => {
        if (item.NotificationId.length > 0) {
          if (item.NotificationId === itemId) {
            check = true;
            number = item.number;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
    }
    return className;
  };

  notificationErase = (itemId: string) => {
    this.state.displayedContactSwitchedNotification.forEach((el) => {
      if (el.NotificationId.length > 0) {
        if (el.NotificationId !== itemId) {
          this.notificationMessagesErase.push({
            NotificationId: el.NotificationId,
            number: el.number,
          });
        }
      }
    });
    this.updaterenderList();
  };

  updaterenderList = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentUserDocumentId || "")
      .update({ messages: this.notificationMessagesErase });
    this.setState({
      displayedContactSwitchedNotification: this.notificationMessagesErase,
    });
  };

  renderListUser = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser: JSX.Element[] = [];
      let classname = "";
      this.searchUsers.forEach((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              key={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
              }}
            >
              <img className="viewAvatarItem" src={item.URL} alt="" />
              <div className="viewWrapcontentItem">
                <span className="textItem">Name: {item.name}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationparagraph">
                  <p className="newmessages">New messages</p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No User is Present");
    }
  };

  searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let SearchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((el) => {
        let SearchValue = el.name.toLowerCase();
        return SearchValue.indexOf(SearchQuery) !== -1;
      });
    this.displayedContacts = displayedContacts;
    this.displaySearchedContacts();
  };

  displaySearchedContacts = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser: JSX.Element[] = [];
      let classname = "";
      this.displayedContacts.forEach((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              key={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
              }}
            >
              <img className="viewAvatarItem" src={item.URL} alt="" />
              <div className="viewWrapcontentItem">
                <span className="textItem">Name: {item.name}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationparagraph">
                  <p className="newmessages">New messages</p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No User is Present");
    }
  };

  render() {
    return (
      <div className="root">
        <div className="body">
          <div className="viewListUser">
            <div className="profileviewleftside">
              <img
                className="ProfilePicture"
                alt=""
                src={this.currentUserPhoto || ""}
                onClick={this.onProfileClick}
              />
              <button className="Logout" onClick={this.logout}></button>
            </div>
            <div className="rootsearchbar">
              <div className="input-container">
                <i className="fa fa-search-icon"></i>
                <input
                  className="input-field"
                  type="text"
                  onChange={this.searchHandler}
                />
              </div>
            </div>
            {this.state.displayedContacts}
          </div>
          <div className="viewBoard">
            {this.state.currentPeerUser ? (
              <ChatBox
                currentPeerUser={this.state.currentPeerUser}
                showToast={this.props.showToast}
              />
            ) : (
              <WelcomeCard
                currentUserName={this.currentUserName || ""}
                currentUserPhoto={this.currentUserPhoto || ""}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
