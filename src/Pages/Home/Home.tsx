import React, { Component } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Images from "../../ProjectImages/ProjectImages";
import { Link } from "react-router-dom";
import "./Home.css";

interface HomePageState {}

export default class HomePage extends Component ({}, HomePageState) {
  render() {
    return (
      <div>
        <Header />
        <div className="splash-container">
          <div className="splash">
            <h1 className="splash-head">WEBCHAT APP</h1>
            <p className="splash-subhead">Let's talk with our loved ones</p>
            <div id="custom-button-wrapper">
              <Link to="login">
                <a className="my-super-cool-button">
                  <div className="dots-container">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <span className="buttoncooltext">Get Started</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="content">
            <h2 className="content-head is-center">
              Features at WebChat Application
            </h2>
            <div className="Appfeatures">
              <div className="contenthead">
                <h3 className="content-subhead">
                  <i className="fa fa-rocket"></i> Get Started Quickly
                </h3>
                <p>
                  Just register yourself with this app and start chatting with
                  your loved ones
                </p>
              </div>
              <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-sign-in"></i> Firebase Authentication
                </h3>
                <p>Firebase Authentication has been implemented in this app</p>
              </div>
              <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-th-large"></i> Media
                </h3>
                <p>
                  You can share images with your friends for better experience
                </p>
              </div>
              <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-refresh"></i> Updates
                </h3>
                <p>
                  We will be working with new features for this app for better
                  experience in future
                </p>
              </div>
            </div>
          </div>
          <div className="Appfeaturesfounder">
            <div className="1-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <img
                width="300"
                alt="file Icons"
                className="pure-img-responsive"
                src={Images.Lopez}
              />
            </div>
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
              <h2 className="content-head content-head-ribbon">
                Aleandro Lopez
              </h2>
              <p style={{ color: "white" }}>
                Currently working a student at Altschool and loving to explore
                other ideas with new technology
              </p>
            </div>
          </div>
          <div className="content">
            <h2 className="content-head is-center">Who we Are?</h2>
            <div className="Appfeature">
              <div className="1-box-lrg pure-u-1 pure-u-md-2-5">
                <form className="pure-form pure-form-stacked">
                  <fieldset>
                    <label htmlFor="name">Your Name</label>
                    <input id="name" type="text" placeholder="Your name" />

                    <label htmlFor="email">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                    />

                    <label htmlFor="password">Your Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Your password"
                    />

                    <button type="submit" className="pure-button">
                      Sign Up
                    </button>
                  </fieldset>
                </form>
              </div>
              <div className="1-box-lrg pure-u-1 pure-u-md-3-5">
                <h4>Contact Us</h4>
                <p>
                  For any question or suggestion you can directly contact us
                  on our Facebook Page:{" "}
                  <a href="https://web.facebook.com/olajide.akinlotan">
                    https://web.facebook.com/olajide.akinlotan
                  </a>
                </p>
                <p>
                  Twitter:{" "}
                  <a href="https://twitter.com/AleandroLo17266">
                    https://twitter.com/AleandroLo17266
                  </a>
                </p>
                <p>
                  Facebook:{" "}
                  <a href="https://web.facebook.com/olajide.akinlotan">
                    https://web.facebook.com/olajide.akinlotan
                  </a>
                </p>
                <p>
                  Instagram:{" "}
                  <a href="https://www.instagram.com/akinlopez2000/">
                    https://www.instagram.com/akinlopez2000/
                  </a>
                </p>
                <h4>More Information</h4>
                <p>To whom it may concern</p>
                <p>
                  This App is developed for learning purpose Developed by
                  Olajide Akinlotan
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
