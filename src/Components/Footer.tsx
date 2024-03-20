import React from "react";
import "./Footer.css";

class Footer extends React.Component {
  Copyright = () => {
    return (
      <h2 className="body2" color="textSecondary" text-align="center">
        {"Copyright @"}
        {"Chatter App"}
        {new Date().getFullYear()}
        {"."}
      </h2>
    );
  };

  render() {
    return (
      <footer>
        <div className="footer 1-box is-center">{this.Copyright()}</div>
      </footer>
    );
  }
}

export default Footer;
