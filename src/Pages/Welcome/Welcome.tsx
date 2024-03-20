import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Welcome.css';


interface WelcomeCardProps {
  currentUserPhoto: string;
  currentUsername: string;
}

export default class WelcomeCard extends Component (WelcomeCardProps) {
  render() {
    return (
      <div className='viewWelcomeBoard'>
        <img 
          className='avatarWelcome'
          src={this.props.currentUserPhoto}
          alt=''
        />
       
        <span className='textTitleWelcome'>{`Welcome, ${this.props.currentUsername}`}</span>
        <span className='textDescriptionWelcome'>
          Let's connect the World
        </span>
      </div>
    )
  }
}
