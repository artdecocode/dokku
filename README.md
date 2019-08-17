# dokku

[![npm version](https://badge.fury.io/js/dokku.svg)](https://npmjs.org/package/dokku)

`dokku` is The CLI Utility To Control A Remote Dokku Host.

```sh
yarn add dokku
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
- [Commands](#commands)
  * [`config:env`](#configenv)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## CLI

The program is compiled to be used from the CLI. The program is still under development.

<table>
  
   
  <thead>
    <tr>
     <th>Argument</th> 
     <th>Short</th>
     <th>Description</th>
    
  </tr>
   
  </thead>
  
    
  <tr>
     <td>command</td>
     <td></td>
     <td>The command to execute.</td>
    
  </tr>
  
    
  <tr>
    
       
    <td>--host</td>
    
       
    <td></td>
    
       
    <td>
      The host. If not given, reads executes <code>git remote</code> and uses <code>dokku</code> record.
    </td>
    
      
  </tr>
  
    
  <tr>
    
       
    <td>--app</td>
    
       
    <td>-a</td>
    
       
    <td>
      The app. If not given, reads executes <code>git remote</code> and uses <code>dokku</code> record.
    </td>
    
      
  </tr>
  
    
  <tr>
    
       
    <td>--user</td>
    
       
    <td></td>
    
       
    <td>
      Dokku user, used to look the host from git remote, and to connect. Default <code>dokku</code>.
    </td>
    
      
  </tr>
  
  
</table>

When run without the host and app arguments, `dokku` will execute `git remote -v` command, and extract those records that sign in with the dokku user. If there are more than one apps, the `app` is required.

After that, each command will be constructed in the following way:

```sh
# dokku command ...rest
ssh <host> command <app> ...rest

# e.g.,
# dokku config:set KEY=VALUE
ssh <host> config:set <app> KEY=VALUE
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## Commands

The full list of commands is the same as what Dokku supports. There are some special commands.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true" width="25">
</a></p>

### `config:env`

The special `config:env` command will read the `.env` file, and execute the `config:set KEY=VALUE` command.

```sh
dokku config:env
```

```
Will connect to dokku@artd.eco:example
config:set example HELLO=world DOKKU=node.js
-----> Setting config vars
       HELLO:  world
       DOKKU:  node.js
-----> Restarting app example
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>