# MaxGui

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production
Check [Config build path](#config-build-path) before building

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
### App translation
Create a json file in `src/locales`. For example: `es.json`
Copy everything in `src/locales/en.json` file and paste to `es.json` then .... translate it
Change the value of VUE_APP_I18N_LOCALE in `.env` file to the desire locale

### Developer settings
#### Disable CORS to access app via localhost
For chrome in linux: google-chrome  --user-data-dir=”/var/tmp/Chrome” --disable-web-security

#### Config build path
Add .env.local file that contains `buildPath=dataDir`
`dataDir` indicates your maxscale's Data directory absolute path

After compiling and minifying for production, the GUI can be accessed via
http://`admin_host`:`admin_port`

`admin_host`: The network interface where the REST API listens on. The default value is the IPv4 address 127.0.0.1 which only listens for local connections.

`admin_port`:The port where the REST API listens on. The default value is port 8989

The default is: [http://127.0.0.1:8989](http://127.0.0.1:8989)
If maxscale is running, you need to shut it down and then start it again

### browserslist

Using default configuration
[See More](https://github.com/browserslist/browserslist)

### Other Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
