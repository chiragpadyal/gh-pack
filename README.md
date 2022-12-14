# [gh-pack](https://github.com/chiragpadyal/gh-pack)

![npm release](https://img.shields.io/npm/v/gh-pack) ![GitHub](https://img.shields.io/github/license/chiragpadyal/gh-pack)

## About

`gh-pack` is a CLI tool for listing packages in `package.json` file on local or github remote repository. It can bump version of packages in `package.json` file to any desired version on an remote github repository.Under the hood, it uses github rest api to create branch, edit content and create pull request.

### **gh-pack** key features

- List packages on remote github repository or local `package.json` file.
- look for new package version.
- bump package version on remote github repository by creating a pull request like dependabot.
- smooth github login and token creation using github rest api and oauth.

## Getting Started

### How to use

> For help there is help command to know more about any command usage!

Install

```
npm install gh-pack -g
or
npx gh-pack <commands>
```

Usage

```
Usage: gh-pack [options] [command]

CLI to view package.json and bump dependencies version.

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  login [options]    Login to github account
  check <file-path>  Analyze package.json dependencies!
  bump [options]     Bump a package version on github repository!
  help [command]     display help for command
```

bump package version on github:-

```
gh-pack login
```

```
Usage: gh-pack bump [options]

Bump a package version on github repository!

Options:
  -df, --default-branch <string>             main branch name (default: "master")
  --force                                    force bump version, even if logged-in username and target repo
                                             usernmae are different
  -pv , --package-version <package@version>  list of package@version i.e -pv react@1.0.0 -pv redux@latest -pv
                                             react-dom@1.0.0 ....      If the -pv value is all (i.e -pv all) than
                                             all packages will be bump! (default: [])
  -gh, --github-url <github-url>             github repository http url
  -h, --help                                 display help for command
```

## Developement

.env file:-

```
CLIENT_ID:
CLIENT_SECRET:
```

run

```
npm install
node src/index.js <commands>
```

### Tech Stack

- node js

## Authors and Contributors

[@chiragpadayal](https://github.com/chiragpadyal)
