<br/>
<p align="center">
  <a href="https://github.com/maxtyson123/13_DGT_WEBSITE">
    <img src="/website/public/media/images/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Rongoa Website</h3>

  <p align="center">
    A website to dynamically display information about various New Zealand  plants and their usages
    <br/>
    <br/>
    <a href="https://github.com/maxtyson123/13_DGT_WEBSITE"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://13-dgt-website.vercel.app/">View Demo</a>
    .
    <a href="https://github.com/maxtyson123/13_DGT_WEBSITE/issues">Report Bug</a>
    .
    <a href="https://github.com/maxtyson123/13_DGT_WEBSITE/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/maxtyson123/13_DGT_WEBSITE?color=dark-green) ![Stargazers](https://img.shields.io/github/stars/maxtyson123/13_DGT_WEBSITE?color=dark-green) ![Issues](https://img.shields.io/github/issues/maxtyson123/13_DGT_WEBSITE) ![License](https://img.shields.io/github/license/maxtyson123/13_DGT_WEBSITE?color=dark-green)

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

![Screen Shot](doc/screenshots/about.png)

This project is built on top of next js and a SQL database to create a website that informs users about various New Zealand plants and their uses. The website aims to display this information in a interesting, entertaining and interactive way with the site being accessible to a wide range of users on mobile or PC. The plants are stored in a SQL database which the website uses to dynamically generate the contents for the pages from, with it heavily relying on the ID of the plant to do most things. Additonally,  a API is provided to interact with the database connected to the site allowing for the user to search for a plant or download a plant's information. Parts of the API that modify data are restricted behind user authentication, either in the form of an API key or a whitelisted email in the auth table of the database.

## Built With

The site uses many plugins from npm and utilises nodes.js as the backend. Next.js is used to render the site and is deployed with Vercel hosting.

* [Next.js 13](https://nextjs.org/)
* [Vercel](https://vercel.com/)
* [Node.js](https://nodejs.org/en)

## Getting Started


To get a local copy up and running follow these simple steps.

### Prerequisites

The website requires npm and node js

* [node.js](https://nodejs.org/en)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Website Setup:
* Clone the repo
```sh
git clone https://github.com/maxtyson123/13_DGT_WEBSITE.git
```
* Install NPM packages
```sh
npm install
```
* Copy the '.env.example' into a new file '.env.local'
2. Database Setup (Pick one and edit constants.ts to select which one is being used)

2. A) Postgres:
* Setup a Postgres server [PostgreSQL](https://www.postgresql.org/)
* Copy the config into .env.local
* Run the SQL file [create_tables](server/postgres_sql/create_tables.sql)

2. B) MySQL:
* Setup a MySQL server [MySQL](https://www.mysql.com/)
* Copy the config into .env.local
* Run the SQL file [create_tables](server/my_sql/create_tables.sql)

3. FTP Setup:
* Download [FileZilla](https://filezilla-project.org/download.php) or any other FTP provider
* Copy the config into .env.local

4. Github Setup:
* Go to [Github Apps](https://github.com/settings/apps) and press 'New App'
* Set the GitHub App name to Rongoa
* Set the homepage and callback URLs to your site, e.g.
```sh
http://localhost:3000/api/auth/callback/github
```
* Under account permissions set Email addresses to read only
* Once completed creation, create a new client secret
* Copy the config into .env.local




## Usage

##### Accessibility Settings
To change accessibility settings of the site, click on the credits chip in the bottom left to open a pop-up where you can toggle dark mode or dyslexic mode.

##### Whitelist users
To add an API key create a new entry in the auth table with the 'entry' column being the key and the 'type' being 'api'
```sh
INSERT INTO auth (auth_entry, auth_type)
VALUES ('api_key', 'api');

To whitelist a email, create a new entry in the auth table with the 'entry' column being the email and the 'type' being 'email'
```sh
INSERT INTO auth (auth_entry, auth_type)
VALUES ('example@example.com', 'email');
```

##### Create Plants
Go to the [/plants/create](https://13-dgt-website.vercel.app/plants/create) page and enter the information for the plant. Once you are finished, press the upload button, or if you wish to continue creating the plant later, press generate JSON (note: images and attachments will have to be selected again).

##### Edit Plants
Go to the [/plants/create?id={id_of_plant}](https://13-dgt-website.vercel.app/plants/create) page and edit the information for the plant. Once you are finished, press the upload button and it will modify that plant.


_For more examples, please refer to the [Documentation](https://maxtyson123.github.io/13_DGT_WEBSITE)_

## Roadmap

See the [open issues](https://github.com/maxtyson123/13_DGT_WEBSITE/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/maxtyson123/13_DGT_WEBSITE/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.
* Please also read through the [Code Of Conduct](https://github.com/maxtyson123/13_DGT_WEBSITE/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the BSD License. See [LICENSE](https://github.com/maxtyson123/13_DGT_WEBSITE/blob/main/LICENSE) for more information.

## Authors

* [Max Tyson](https://github.com/maxtyson123/) - *Built Website*

## Acknowledgements

* [ShaanCoding](https://github.com/ShaanCoding/)
* [Othneil Drew](https://github.com/othneildrew/Best-README-Template)
* [ImgShields](https://shields.io/)
* [Fort Awesome](https://www.npmjs.com/package/@fortawesome/free-solid-svg-icons)
* [Three JS](https://www.npmjs.com/package/@react-three/fiber)
* [Next Auth](https://www.npmjs.com/package/next-auth)
* [React](https://github.com/facebook/react)
* [Quill](https://quilljs.com/)
