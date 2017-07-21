# angular-universal (Server Side Rendering) for Angular 2+

- Single page application (SPA) frameworks are probably getting the most attention in the JavaScript world in the past years. Handling most of the processing at the client, boiler-plating the content on every page, maintaining the “state”, and omitting the overhead latency on switching pages are just some of its net benefits.
SPA’s provide an awesome User Experience!
Hell yeah, but we’ve got a small problem: the application has to be indexed by search engines!
Many search engines and social networks such as Facebook and Twitter expect plain HTML to utilize the meta tags and relevant page contents. They cannot determine when the JavaScript framework completes rendering the page. As a result, they can only see a very little part of HTML.
SPA’s suck against search engines!
Although Google is fully able to crawl and render most dynamic websites, it’s a mess when people try to share the website link on social networks.

So, we need some real SEO support!
True! We need the search engines, social networks and users of the application see a server-rendered view — as server-side rendering is a reliable, flexible and efficient way to ensure all search engines & social networks can fetch the page content.


## What is angular-universal?
- Angular Universal allow to do server side rendering of the angular code. Waiting front end code generate the page.

- It allow that even if a user act on the page (click on items, change page…), the changes occurring in the server rendered side are replayed in the client rendered page.

- So the end user will not see anything except it will be faster, Whereas google will see all the pages as though it were a normal user.

- The official site `https://universal.angular.io/` states that Universal is “Server-side Rendering for Angular apps”. It’s the middleware that sits between node.js and Angular.
Simply put, it offers best of both worlds: the user experience and high performance and of SPA’s combined with the SEO friendliness of static pages.

## What is rendered differences between angular and angular-universal?

```
Angular: 


<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Ng4Cli</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
<script type="text/javascript" src="inline.bundle.js"></script><script type="text/javascript" src="polyfills.bundle.js"></script><script type="text/javascript" src="styles.bundle.js"></script><script type="text/javascript" src="vendor.bundle.js"></script><script type="text/javascript" src="main.bundle.js"></script></body>
</html>
```

```
Angular-Universal (SSR):


<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Ng4Universal</title><base href="/"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/x-icon" href="favicon.ico"><link href="styles.d41d8cd98f00b204e980.bundle.css" rel="stylesheet"><style ng-transition="ng4-universal"></style></head><body><app-root _nghost-c0="" ng-version="4.3.1">
<div _ngcontent-c0="" style="text-align:center">
  <h1 _ngcontent-c0="">
    Welcome to app!
  </h1>
  //Image logo here...
</div>
<h2 _ngcontent-c0="">Here are some links to help you start: </h2>
<ul _ngcontent-c0="">
  <li _ngcontent-c0="">
    <h2 _ngcontent-c0=""><a _ngcontent-c0="" href="https://angular.io/tutorial" target="_blank">Tour of Heroes</a></h2>
  </li>
  <li _ngcontent-c0="">
    <h2 _ngcontent-c0=""><a _ngcontent-c0="" href="https://github.com/angular/angular-cli/wiki" target="_blank">CLI Documentation</a></h2>
  </li>
  <li _ngcontent-c0="">
    <h2 _ngcontent-c0=""><a _ngcontent-c0="" href="http://angularjs.blogspot.ca/" target="_blank">Angular blog</a></h2>
  </li>
</ul>

<router-outlet _ngcontent-c0=""></router-outlet>
</app-root><script type="text/javascript" src="inline.7e73dfdaba7efea8fa2d.bundle.js"></script><script type="text/javascript" src="polyfills.1553fdd8173a081c720c.bundle.js"></script><script type="text/javascript" src="vendor.01fcf3a3f6fe1f10bd56.bundle.js"></script><script type="text/javascript" src="main.c124bc9dc4c574a5b4e2.bundle.js"></script></body></html>
```

## How to get started?
- First let's assume that you're planning to use `angular 4` using `angular-cli`, and so we have to first install that. 
    ``` 
    > npm install -g @angular/cli 

    to verify: $ > ng help
    ```
- Now since we have to implement server side rendering, we need angular 4 module called `platform-server` & `angular-animations`. 
    ```
    > npm install --save @angular/platform-server @angular/animations
    ```
- Now, like every angular application, let's create one using `angular-cli`
    ```
    > ng new ng4-universal --routing
    ```
    we are passing `--routing` parameter since we want to create sample which has some basic routing pre-implemented.
- Now, open that project code in your faviorite IDE (I am using VSCode). 
- Let's add all dependencies from `package.json`
    ```
    > npm install
    ```
- Now, just like every angular application, this one will have `app.module.ts` as well as startup bootstrap file. We need to change this file little bit and module `browserModule` in it. 
    ```
    app.module.ts
    _____________
    ....
    imports: [
        BrowserModule.withServerTransition({appId: 'ng4-universal'}),
        AppRoutingModule
    ],
    ....
    ```
- Now, since we mentioned that use server transition instead of browser module rendering, it's time to add `ServerModule` code. Add new file under `src\app\` and name it as `app.server.module.ts`.
    ```
    app.server.module.ts
    ____________________
    
    import { NgModule } from '@angular/core';
    import { ServerModule } from '@angular/platform-server';
    import { AppModule } from './app.module';
    import { AppComponent } from './app.component';

    @NgModule({
    imports: [
        ServerModule,
        AppModule
    ],
    bootstrap: [AppComponent]
    })
    export class AppServerModule { }
    
    ```

- Now, since we have mentioned that use `ServerModule` and register it with appModule, it's time to add actual `server.ts`, a node.js / express.js based server code. So, let's add new file under `src\server.ts`.
    ```
    src\server.ts
    _____________
    import 'reflect-metadata';
    import 'zone.js/dist/zone-node';
    import { platformServer, renderModuleFactory } from '@angular/platform-server'
    import { enableProdMode } from '@angular/core'
    import { AppServerModuleNgFactory } from '../dist/ngfactory/src/app/app.server.module.ngfactory'
    import * as express from 'express';
    import { readFileSync } from 'fs';
    import { join } from 'path';

    const PORT = 4600;

    enableProdMode();

    const app = express();

    let template = readFileSync(join(__dirname, '..', 'dist', 'index.html')).toString();

    app.engine('html', (_, options, callback) => {
    const opts = { document: template, url: options.req.url };

    renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(html => callback(null, html));
    });

    app.set('view engine', 'html');
    app.set('views', 'src')

    app.get('*.*', express.static(join(__dirname, '..', 'dist')));

    app.get('*', (req, res) => {
    res.render('index', { req });
    });

    app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}!`);
    });
    ```
- Now, this is basically simple node server code which using below important code. 
    ```
    ...
    import { AppServerModuleNgFactory } from '../dist/ngfactory/src/app/app.server.module.ngfactory'
    ...
    ...
     renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(html => callback(null, html));
    });
    ```
- Since we have added this server.ts file which is not traditional angular file, let's exclude it into `tsconfig.app.json` under `src\`.
    ```
    ...
    ...
    "exclude": [
        "server.ts",
        "test.ts",
        "**/*.spec.ts"
    ]
    ...
    ```
- Now, finally we have to make change in global tsconfig.json under root directory and add angular compiler options to consider this server side rendering setup. 
    ```
    ...
    ...
    "angularCompilerOptions": {                         
        "genDir": "./dist/ngfactory",
        "entryModule": "./src/app/app.module#AppModule"
    }  
    ```
- Let's have below two scripts in our `package.json` so we can easily build and run the code. 
    ```
    "scripts": {
        "prestart": "ng build --prod && ngc",
        "start": "ts-node src/server.ts"
    }
    ```
- That's it, we are done with basic `Universal` setup and ready to run. 
    ```
    > npm run start
    ```

- Once done, you will see final webpack compilation and ready to run `localhost:4600`. When you'll run that url in to browser, let's check `view page source` and you'll see that we have fully server side rendered html page instead of dynamic html.

## Some resources to learn `angular-universal`
- `https://github.com/angular/angular-cli`
- `https://medium.com/burak-tasci/angular-4-with-server-side-rendering-aka-angular-universal-f6c228ded8b0`
- `https://www.youtube.com/watch?v=lncsmB5yfzE&index=27&list=PLmtADjkIi7R93AolvhsKXnqpQCwFChrAk&t=598s`
- `https://scotch.io/tutorials/server-side-rendering-in-angular-2-with-angular-universal`
- `https://universal.angular.io/quickstart/`

## what's included in this repo?
There are two projects in this repo , one with regular `angular-cli` withoug SSR and other one with `angular-universal` with SSR. 

#### Bhavin Patel (`http://itsmebhavin.wordpress.com`)
#### MIT
