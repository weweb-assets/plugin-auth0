To start setting-up Auth0 plugin, you need to follow these 4 steps:

#1 - Create a single page application

Once you're logged in, go to Applications > Create application.
![https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/01-create-application.png?raw=true](https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/01-create-application.png?raw=true)

Select Single Page Application.
![https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/02-single-page-application.png?raw=true](https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/02-single-page-application.png?raw=true)

Go to the app Settings, copy & paste the the Domain, the Client Id and the Client Secret in WeWeb.
![https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/03-copy-credentials.png?raw=true](https://github.com/weweb-assets/plugin-auth0/blob/main/src/markdown/images/03-copy-credentials.png?raw=true)

#2 - Create a machine to machine application

Go to Applications > Create application.

Select Machine to Machine Application.
![https://i.imgur.com/rKDfqY6.png](https://i.imgur.com/rKDfqY6.png)

Go to the app Settings, copy & paste the the Domain, the Client Id and the Client Secret in WeWeb.
![https://i.imgur.com/jMe6xpd.png](https://i.imgur.com/jMe6xpd.png)

Select Auth0 Management API.
![https://i.imgur.com/H4PubBC.png](https://i.imgur.com/H4PubBC.png)

Give all the permissions to your app.
![https://i.imgur.com/EEKU6jw.png](https://i.imgur.com/EEKU6jw.png)

#3 - Specify the login page

![https://i.imgur.com/jW2BsyI.png](https://i.imgur.com/jW2BsyI.png)

#4 - Allow your website and the editor to connect

Copy & paste Allowed Callback URLs, Allowed Logout URLs, Allowed Web Origins, Allowed Origins (CORS) from WeWeb in the corresponding fields inside the Single Page Application's settings in AUth0, and click Save.

![https://i.imgur.com/wgHXCox.png](https://i.imgur.com/wgHXCox.png)
![https://i.imgur.com/9z6kbkI.png](https://i.imgur.com/9z6kbkI.png)
