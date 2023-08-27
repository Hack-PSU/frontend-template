# HackPSU Frontend

## High Level Project Architecture

The tools selected for this project were picked because they are both:

1. Easy to learn
2. Easy to read

New tools brought in to this project should also follow these principles.

This project uses [NextJS 13](https://nextjs.org/blog/next-13) which is very similar to previous versions of [NextJS](https://nextjs.org) but is more versatile in its ability to create nested layouts and render html on the server.

This project uses [Tailwind](https://tailwindcss.com), an inline css styling tool. We use it to embed styling directly into our tsx. The primary reason we are using it is to reduce the amount of dead code/styling that was present in the previous frontend repository.

## Running Locally

This project uses [pnpm](https://pnpm.io) as its package manager. `pnpm` has several advantages over `npm` and `yarn.` I have installed `pnpm` through [asdf](https://asdf-vm.com) which is a software version manager for a large variety of tools. Any way you choose to download `pnpm` is fine so long as it is a somewhat recent version.

After cloning the repository running the application is incredibly simple:

1. `pnpm i` to install all required modules
2. `pnpm dev` to run the application on a locally hosted port (default is 3000)

## User Authentication

Authentication is done through Firebase. Currently all of the logic beyond that is hand generated but this will probably be migrated to use [NextAuth](https://next-auth.js.org) in the near future. Honestly a big advantage of this is just not needing to build our own UI for sign in. Similarly we could use Firebase's drop in sign in solution.

## Data fetching

Fortunately most of the data that we show on our pages doesn't change frequently (think workshops and hackathon events). This means that most of our data should be fetched from server components and cached where possible. [NextJS 13 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

## Customization

The goal of this template is to be easily stylable. One way we will accomplish this is will custom theme colors defined in `tailwind.config.ts`. [Custom Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
