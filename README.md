# kozy-debug-app
This app will emulate the behavior of the kozy p2p protocol for development purposes

## to configure this app
Add a settings.json file (don't check it in! it is .gitignore so every kozy app developer can start using this code). Then add in the following json:

{
    "integration-url": <url to your integration>
}

## to compile and run the app
1) When using visual studio code, install the live server plugin for ease of access.
2) Install the latest version of the typescript compiler (https://www.typescriptlang.org/download)
3) Open a command line tool and enter the following command: "tsc" (without quotes)
4) Press the Go Live button.