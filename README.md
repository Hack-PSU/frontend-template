# HackPSU Frontend

## High Level Project Architecture

The tools selected for this project were picked because they are both:

1. Easy to learn
2. Easy to read

New tools brought in to this project should also follow these principles.

This project uses [NextJS 13](https://nextjs.org/blog/next-13) which is very similar to previous versions of [NextJS](https://nextjs.org) but is more versatile to custom layouts and static site generation.

The project is very much in development and additional tools may be added/stripped and this README should be updated accordingly.

This project uses [Tailwind](https://tailwindcss.com), an inline css styling tool. We use it to embed styling directly into our tsx. The primary reason we are using it is to reduce the amount of dead code/styling that was present in the previous frontend repository.

This project also uses [Radix](https://www.radix-ui.com) for creating custom components. It is a library of unstyled react components which can be modified with Tailwind to match any theme we desire.

This project also uses [Framer Motion](https://www.framer.com/motion/) for animations (or at least it will). It is an intuitive animation library with strong documentation.

## Running Locally

This project uses [pnpm](https://pnpm.io) as its package manager. `pnpm` has several advantages over `npm` and `yarn.` I have installed `pnpm` through [asdf](https://asdf-vm.com) which is a software version manager for a large variety of tools. Any way you choose to download `pnpm` is fine so long as it is a somewhat recent version.

After cloning the repository running the application is incredibly simple:

1. `pnpm i` to install all required modules
2. `pnpm dev` to run the application on a locally hosted port (default is 3000)

## Stuff that needs to be done:

- responsive design
- give stuff types
- add social links
- make accessible
- add auth state for firebase
- animate collapsible component
- add FAQ collapsible content (either make 2 columns with flex or an adjustable grid layout)
- figure out how to template sponsors
- configure vercel deployments
- decide on branch development structure
