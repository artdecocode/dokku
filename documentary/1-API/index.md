## CLI

The program is compiled to be used from the CLI. The program is still under development.

<argufy>types/arguments.xml</argufy>

When run without the host and app arguments, `dokku` will execute `git remote -v` command, and extract those records that sign in with the dokku user. If there are more than one apps, the `app` is required.

After that, each command will be constructed in the following way:

```sh
# dokku command ...rest
ssh <host> command <app> ...rest

# e.g.,
# dokku config:set KEY=VALUE
ssh <host> config:set <app> KEY=VALUE
```

%~%

## Commands

The full list of commands is the same as what Dokku supports. There are some special commands.

%~ width="25"%

### `config:env`

The special `config:env` command will read the `.env` file, and execute the `config:set KEY=VALUE` command.

```sh
dokku config:env
```

<!-- requires git remote: dokku   dokku@artd.eco:example (push) -->

<fork>src/bin/dokku config:env</fork>

%~%