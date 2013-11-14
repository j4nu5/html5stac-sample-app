# Quick Start

## What is HTML5stac?

HTML5stac is a cloud platform for easily building fast, scalable, responsive websites that work seamlessly across mobile, tablet, and desktop devices. 
It was created to address the needs of modern HTML5 web applications, and features the following:

1.  JavaScript everywhere: both on the client & server-side
2.  RESTful APIs for all data objects
3.  Live API console & data inspector
4.  Device-aware templating built on [Handlebars.js](http://handlebarsjs.com/)

HTML5stac uses popular libraries like [Backbone.js](http://backbonejs.org/), and the [Bootstrap](http://getbootstrap.com/) front-end framework, so it's easy to get started.

HTML5stac lets you focus on building full-featured websites rapidly using only JavaScript. Other developer-friendly features include separate staging & production environments, and push-button deployment.

To get started with HTML5stac, sign up at [http://developer.mobstac.com](http://developer.mobstac.com).

# Creating a Sandbox

This tutorial guides you through the sets of steps needed to create a Sandbox environment with Mobstac. The tutorial assumes that you have already signed up with [Mobstac For Developers](http://developer.mobstac.com). Once you have the sandbox environment ready, you can make full use of the variety of features offered by HTML5stac.

## Fork Demo App

It's always helpful to start with an example while getting familiar with a new framework. To help with that we have a demo app available for you to start with. To use the Demo App, you can fork the repository on [GitHub](http://github.com/MobStac/HTML5StacDemo/).

Once you have created a fork of the demo app, please add the fork information to the Demo App already created for you at&nbsp;

## Get Authentication Token

Since HTML5stac relies exclusively on [Mobstac API](https://apiv2.mobstac.com/api/2.0/)&nbsp;for content interaction, deployment and authentication, you'll need to get Authentication Token before you can use any of these features. To get the authentication token, please visit [https://apiv2.mobstac.com/api/2.0/users/](https://apiv2.mobstac.com/api/2.0/users/) and get the token from the response provided in the console.

**Please do not share the token with anyone. API treats token authenticated requests the same as username/password authenticated requests.**

## Deploy App to Server

To deploy the App to Mobstac, make a POST request to Mobstac API using following curl command:

    curl -X POST -H "Authorization: Token auth_token" https://apiv2.mobstac.com/api/2.0/accounts/account_id/properties/property_id/apps/app_id/sync-repo/

We'll cover more on the individual variables mentioned here later. In case you don't know what the individual variables are for your use, you may find that out by exploring the API using [API Console](https://apiv2.mobstac.com/api/2.0/).
