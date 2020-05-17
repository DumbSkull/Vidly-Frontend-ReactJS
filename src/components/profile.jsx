import React, { Component } from "react";
import jwtDecode from "jwt-decode";

class Profile extends Component {
  state = {
    name: "",
    email: "",
    isAdmin: "",
    infoClose: 0,
  };

  componentDidMount() {
    this.setState({
      name: jwtDecode(localStorage.getItem("token")).name,
      email: jwtDecode(localStorage.getItem("token")).email,
      isAdmin: jwtDecode(localStorage.getItem("token")).isAdmin,
    });
  }

  getFirstWord(str) {
    let spaceIndex = str.indexOf(" ");
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
  }

  render() {
    return (
      <React.Fragment>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 rounded mx-auto text-white text-center bg-dark mb-5">
          <h1 class="display-4">
            {this.getFirstWord(this.state.name)}'s Profile
          </h1>
          <p class="lead">A kind vidly user.</p>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <img
              class="rounded-circle"
              src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
              alt="Generic placeholder image"
              width="140"
              height="140"
            />
            <h2>{this.state.name}</h2>
            <p class="mt-3">Email: {this.state.email}</p>
            <p>
              Admin Status:{" "}
              {this.state.isAdmin ? <span>Yes</span> : <span>No</span>}
            </p>
          </div>
          <div class="col-lg-8 featurette">
            <div class="row featurette">
              <div class="col-md-12">
                <h2 class="featurette-heading">Welcome to your profile. </h2>
                {!this.state.infoClose && (
                  <div class="alert alert-info mt-5" role="alert">
                    <button
                      onClick={() => {
                        this.setState({ infoClose: 1 });
                      }}
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="alert-heading">Note:</h4>

                    <p>More features are being added onto the profile page.</p>
                    <hr />
                    <p class="mb-0">
                      Be sure to come back and check my website later. I'm
                      positive that there would be more :)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Profile;
