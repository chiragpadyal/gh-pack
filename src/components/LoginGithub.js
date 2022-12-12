/*

--------------------Get Github Access Token Using Oauth--------------------
Get URL:- https://github.com/login/oauth/authorize
Request Body:- 
- client_id (oauth)
- redirect_uri (redirect url for webhook)
- login(username)
- scope(default readonly. set to repo)
- state(random string)
Response Body:- no body (instead redirect to webhook)

Webhook Redirect:- http:localhost:8080/auth
Response Body:- code

Post URL:- https://github.com/login/oauth/access_token
Request Body:- client_id, client_secret, code
Response Body:- access_token, state

*/

import axios from "axios";
import inquirer from "inquirer";
import { Spinner } from "cli-spinner";
import keytar from "keytar";

import crypto from "crypto";
import dotenv from "dotenv";
import opener from "opener";
import express from "express";

export class LoginGithub {
  constructor(options) {
    dotenv.config(); //import env from .env file
    //Env Var
    this.client_id = process.env.CLIENT_ID;
    this.client_secret = process.env.CLIENT_SECRET;

    this.app = express();
    this.id = crypto.randomBytes(20).toString("hex"); //random string for authentication
    this.listen; //server port listener
    this.timer; //timeout if fails
    this.spinner; //spinner
    this.username = options.username; //username
    this.email = options.email; //username

    this.serverGet();

    this.login();
  }

  serverGet() {
    let _this = this;
    this.app.get("/auth", function (req, res) {
      //Handles Webhook from github rest api
      if (req.query.state === _this.id && req.query.code) {
        // check for authentication, if the access is req by 3rd party
        res.send("Recieved");
        axios
          .post(
            "https://github.com/login/oauth/access_token",
            {
              client_id: _this.client_id,
              client_secret: _this.client_secret,
              code: req.query.code,
            },
            {
              headers: {
                Accept: "application/json",
              },
            }
          )
          .then(function (response) {
            // console.log(response.data.access_token);
            keytar.setPassword(
              "Github-Token-NPM-GUI",
              _this.username,
              response.data.access_token
            );
          })
          .catch(function (error) {
            console.log(error);
          });
      } else res.send("third party created the request");
      _this.spinner.stop(true);
      console.log("done!");
      _this.listen.close();
      clearTimeout(_this.timer);
    });
  }

  doPrompts() {
    const ques = [
      {
        type: "input",
        name: "username",
        message: "What is your username? ",
      },
      {
        type: "input",
        name: "email",
        message: "What is your Email ID? ",
      },
    ];

    return inquirer.prompt(ques);
  }

  async login() {
    if (!this.username && !this.email) {
      const answers = await this.doPrompts();
      this.username = answers.username;
      this.email = answers.email;
    }

    this.spinner = new Spinner("%s Opening Browser...");
    this.spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
    this.spinner.start();

    opener(
      `https://github.com/login/oauth/authorize?client_id=${
        this.client_id
      }&redirect_uri=${"http://localhost:8080/auth"}&login=${
        this.username
      }&scope="repo"&state=${this.id}`
    );
    this.listen = this.app.listen(8080);
    this.timer = setTimeout(() => {
      if (listen) {
        this.spinner.stop(true);
        console.log("failed!");
        this.listen.close();
      }
    }, 60000);
  }
}

// let git = new LoginGithub({
//   username: "chiragpadyal",
//   email: "chiragpadyal@gmail.com",
// });
// git.login({ username: "chiragpadyal", email: "chiragpadyal@gmail.com" });
