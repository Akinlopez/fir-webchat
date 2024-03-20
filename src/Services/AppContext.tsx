import React, { ReactElement } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./firebaseConfig";
import { v4 as uuid } from "uuid";

// Define context types and default value
type contextTypes = {
  loading: boolean;
  currentUser: userTypes | null;
  todoItems: todoItemInterface[];
  logInUser: Function;
  registerUser: Function;
  handleAuthChange: Function;
  updateAvatar: Function;
  addTodoItem: Function;
  getTodoItems: Function;
  updateTodoItem: Function;
  deleteTodoItem: Function;
  signOutUser: Function;
};

const contextDefaultVal: contextTypes = {
  loading: false,
  currentUser: null,
  todoItems: [],
  logInUser: () => {},
  registerUser: () => {},
  handleAuthChange: () => {},
  updateAvatar: () => {},
  addTodoItem: () => {},
  getTodoItems: () => {},
  updateTodoItem: () => {},
  deleteTodoItem: () => {},
  signOutUser: () => {},
};

// Define Props interface
interface Props {
  children: React.ReactNode;
}

export const AppContext = React.createContext(contextTypes)(contextDefaultVal);

export default function AppContextProvider({ children }: Props): ReactElement {
  const [currentUser, setCurrentUser] = React.useState< userTypes | null >(null);
  const [loading, setLoading] = React.useState(false);
  const [todoItems, setTodoItems] = React.useState < todoItemInterface[]> ([]);

  // Define your context provider functions here

  return (
    <AppContext.Provider
      value={{
        loading,
        currentUser,
        todoItems,
        logInUser,
        registerUser,
        handleAuthChange,
        updateAvatar,
        addTodoItem,
        getTodoItems,
        updateTodoItem,
        deleteTodoItem,
        signOutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}



