# vuetify-project

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Developer settings
Disable CORS when accessing the app via localhost
For chrome in linux: google-chrome  --user-data-dir=”/var/tmp/Chrome” --disable-web-security


Add .env.local file that contains `buildPath=dataDir`
dataDir indicates your maxscale's Data directory absolute path

After compiling and minifying for production, the GUI can be accessed via
[http://127.0.0.1:8989/v1/](http://127.0.0.1:8989/v1/).
If maxscale is running, you need to shut it down and then start it again

`admin_host`

The network interface where the REST API listens on. The default value is the IPv4 address 127.0.0.1 which only listens for local connections.

`admin_port`

The port where the REST API listens on. The default value is port 8989

### browserslist

Using default configuration
[See More](https://github.com/browserslist/browserslist)

### Other Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
