# Nitric To-Dos

In this tutorial, you'll create a [Next.js](https://nextjs.org/) application that connects to a task list [Nitric API](https://nitric.io/docs/apis) and a task list [Nitric Collection](https://nitric.io/docs/collections). We will also be using [Tailwind CSS](https://tailwindcss.com/) for styling and [Turborepo](https://turborepo.org/) for our build system.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Nitric CLI](https://nitric.io/docs/installation)

## Set up the Next.js app

Clone the [Next.js starter repository](https://github.com/nitrictech/nitric-todo).

```bash
git clone https://github.com/nitrictech/nitric-todo
```

Install the dependencies with npm or yarn.

```text
cd nextjs-starter
yarn install
```

Next, open the project in your editor of choice.

```bash
> cd my-profile-api
```

Make sure all dependencies are resolved with yarn or npm.

```bash
yarn install
```

## Run Locally

To test out our project, we can do

```bash
nitric run
```

## Deploying

### Deploy the Next.js App

Choose one of the following deploy buttons and make sure to update the `DATABASE_URL` variable during this setup process.

#### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitrictech/nextjs-starter&env=DATABASE_URL)

#### Deploy on Netlify

\*Note: The `Netlify.toml` file in this repository includes the configuration for you to customize the `DATABASE_URL` property on the initial deploy.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nitrictech/nextjs-starter)

### Deploy the Nitric API

Setup your credentials and any other cloud specific configuration:

- [AWS](/docs/reference/aws)
- [Azure](/docs/reference/azure)
- [GCP](/docs/reference/gcp)

Run the appropriate deployment command

> Warning: Publishing services to the cloud may incur costs.
> AWS

```bash
nitric stack up
```

> Azure

```bash
nitric stack up
```

> GCP

```bash
nitric stack up
```

When the deployment is complete, go to the relevant cloud console and you'll be able to see and interact with your API.

To undeploy run the following command.

```bash
nitric stack down
```
