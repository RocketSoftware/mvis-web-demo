# xdemo

This project serves as an example for the new Rocket MVIS tool. The MVIS tool allows for standard RESTful protocols
to be used with legacy MV applications. 

The example is a mock streaming service. It demonstrates the feasibility of integrating modern web technologies with legacy MV databases.

Welcome to the MVoovies XDemo wiki!

This will serve as a guide to installing and running the MVoovies application. You should be up and running in no time.

In addition, a blog post and video explanation about the application can be found [here](Placeholder for MVoovies web blog post and video).

# Installation

## Getting Started

### Prequisites / Dependencies 
* Node.js - Click [here](https://nodejs.org/en/) and install the necessary version for your machine.

* MultiValue Integration Server Community Edition - If MVIS is not installed on your machine, please click the link below and follow the included installation guide [here](https://www.rocketsoftware.com/product-categories/dbms-and-application-servers/rocket-u2-trials)

* UniVerse - If UniVerse is not installed on your machine, please find it [here](https://www.rocketsoftware.com/product-categories/dbms-and-application-servers/rocket-u2-trials) and follow the installation guide that can be found [here](https://docs.rocketsoftware.com/nxt/gateway.dll/RKBnew20%2Funiverse%2Fprevious%20versions%2Fv11.2.3%2Funiverse_installguide_v1123.pdf)

### Running the Demo Locally
1. Clone [this](https://github.com/Chimer2017/xdemo) or run `git clone https://github.com/Chimer2017/xdemo.git`
2. `cd xdemo` to navigate to the xdemo directory
2. `npm install` to install all required packages and modules for the application
3. `npm start` to the local server
4. Navigate to [localhost:5555](http://localhost:5555/)

## Credentials for Login
Username: agorovoy@rs.com
Password: admin

### Application Structure
* app.js - The entry point to our application. This file defines our express server. It also requires the routes and models we'll be using in the application.
* routes/ - This folder contains the route definitions for our API.
* assets/ - This folder contains CSS, JS, images, and Bootstrap necessary for the application
* views/ - This folder contains all the rendered screens and UI components(also known as mixins) 

### Elements of Application that Communicate with MVIS
1. The main table renders data from MVIS
2. Filters - each of the filters when clicked sends a specific request to MVIS asking for a filtered data collection. In the case multiple filters are selected, a multiple query MVIS request is built on the front end and then sent to MVIS.
3. Movie Information Panel - when selecting a movie from the main table, a request to MVIS is made asking for specific movie information.


## Configuration

The demo is by default set to work with a local copy of MVIS communit edition and the default port number. If you wish to configure your MVIS server or run it on premise or in the cloud, the demo will also need to be updated. There is the a "config.js" file in the root folder that contains the default port number and endpoint URI. Configure these to connect the demo application with your MVIS server










