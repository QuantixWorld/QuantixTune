# SpotifyTool

## Project Setup
### Install node & nvm
First, download `nvm-setup.exe` for windows [here](https://github.com/coreybutler/nvm-windows) And follow the installation instructions.  
When nvm is installed, in powershell:
```ps
echo "Verify installation of nvm"
nvm -v

echo "Install latest version of node"
nvm install lts

echo "Use the installed version of node"
nvm use [version]

echo "Verify the node installation"
node -v
```

### Backend
Setup node in the backend folder with `npm install`.  
#### Redis
Install the redis server in a WSL2 instance:
```sh
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update && sudo apt-get ugprade -y
sudo apt-get install redis
```

Start the redis server:
```sh
sudo service redis-server start
```

Test the installation:
```sh
redis-cli

127.0.0.1:6379> ping
PONG
```

Lastly, complete the .env file with the correct information.

### Frontend
Setup the frontend folder with `npm install`

## Run app
### Backend
Launch the server from the backend folder and with:
```ps
node ./app.js
```
### Frontend
Launch the frontend app from the frontend folder and with:
```ps
npm run dev
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
