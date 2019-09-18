//This file contains all configurations for the application
//The configurations are currently set as to work for a localhost 
//environment. Change the base URL and port number respective to where 
//your MVIS server is located. 
//- © 2019 Rocket Software, Inc. or its affiliates. All Rights Reserved
//- Written by Andrew Gorovoy 

//Documentation and app structure explanations can be found on the Github wiki found [here]


const config = {
    mvis: {
        port: '7171',
        baseEndPointURL: 'http://den-vm-eng142.rocketsoftware.com:',
    },
}

module.exports = config;
 
