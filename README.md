# kosy-debug-app
This app will emulate the behavior of the kosy p2p protocol for development purposes

## to configure this app
Add a settings.json file (don't check it in! it is .gitignore so every kosy app developer can start using this code). Then add in the following json:

```Typescript
{
    "devServer": {
        "port": "The port you want the development server to run on",
        "host": "The HOST you want the development server to run on",
        "ssl": false | true | { 
            "certPath": "Path to the SSL certificate in PEM format",
            "keyPath": "(optiona) path to the certificate key", 
            "caPath": "(optional) path to the root certificate in PEM format"
        }
    }
}
```

## Install node package manager
To run the code, you'll need a bunch of packages installed. The package manger we've chosen to use is node package manager (npm).
1) Install npm on your local machine.
2) Check that npm is installed properly by running "npm --version" (without quotes). If you're on a windows machine and already have a command console open before the installation, you need to open a new command console before npm becomes available.
3) Run "npm install" (without quotes). This will download all necessary packages into the node_modules folder.

## To actually run the code
If you've done all of the previous steps:

- Run "npm start" (without quotes) to run the application in development mode.
- Run "npm run build" (without quotes) to compile the application into the ./dist folder.
