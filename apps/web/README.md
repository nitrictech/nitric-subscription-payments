# Next.js Starter

This is a [Next.js](https://nextjs.org/) project that uses a [Nitric API](https://nitric.io/docs/apis) with [Nitric Collections](https://nitric.io/docs/collections) and [Nitric Storage ](https://nitric.io/docs/storage)to store and display data. It also uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Turborepo](https://turborepo.org/) for the build system.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Nitric CLI](/docs/installation.mdx)

## Set up the Next.js app

Clone the [Next.js starter repository]().

```bash
git clone https://github.com/nitrictech/nextjs-starter
```

Install the dependencies:

```text
cd nextjs-starter
yarn install
```

## Project structure

This project is split into three main area:

- **apis** - This is where nitric APIs are stored
- **apps** - This is where your web applications are stored
- **packages** - This is where shared common code is stored (such as types and configuration)

## Set up API proxy

Next, you'll want to run your application locally. Start by create your `.env` file by renaming the `.env.example` file:

```
mv web/apps/.env.example web/apps/.env
```

This holds your `API_BASE_URL` variable, which is used to proxy between your universal Next.js API route (configured under rewrites in next.config.js) and your Nitric APIs.

## Run the App

Run the app with the following command:

```bash
yarn dev
```

> This will use turbo repo to run both your nextjs app and the nitric shirts api

Open your browser at localhost:3000 to see the running application.

If you make any changes to the API or App, hot reloading is enabled so the API will rebuild.

## Deploying

### Deploy the Nitric API

Setup your credentials and any other cloud specific configuration:

- [AWS](/docs/reference/aws)
- [Azure](/docs/reference/azure)

Run the appropriate deployment command

> Warning: Publishing services to the cloud may incur costs.
> AWS

```bash
nitric stack up functions/*.ts --provider aws
```

Azure

```bash
nitric stack up functions/*.ts --provider azure
```

When the deployment is complete, go to the relevant cloud console and you'll be able to see and interact with your API.

To undeploy run the following command.

```bash
nitric stack down
```

### Deploy the Next.js App

Choose one of the following deploy buttons and make sure to update the `API_BASE_URL` variable during this setup process.

#### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitrictech/nextjs-starter&env=DATABASE_URL)

#### Deploy on Netlify

\*Note: The `Netlify.toml` file in this repository includes the configuration for you to customize the `API_BASE_URL` property on the initial deploy.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nitrictech/nextjs-starter)

## Learn more

To learn more about Nitric, take a look at our [docs website](https://nitric.io/docs) which contains quick start guides and reference documentation.

## Need help?

Get help from [Nitric's support team](https://nitric.io/docs/support), or join our [GitHub Discussion board](https://github.com/nitrictech/nitric/discussions) to see how others are using Nitric.

