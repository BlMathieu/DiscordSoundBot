# Starting the project

1 - Set .Env secrets
- APPLICATION_ID (discord app id)
- PUBLIC_KEY (discord public api key )
- TOKEN (discord token api)
- DEFAULT_PATH (absolute path where you want to store your music files)

2 - Launch docker containers : 
- cd docker
- docker compose up -d

Docker will install npm dependencies and launch the project.

3 - Adding the bot to your discord channel !
Permissions :
- 


4 - Usage : 
- Playing music : ">play {music_name.ext} {?speed: [0.5 < value < 60]} {?loop}"
- Listing musics : ">list"
- Searching a music : ">search {string}"
- Download music from youtube : ">yt add {file_name} {url}"
- Help command:  ">help" || ">"
