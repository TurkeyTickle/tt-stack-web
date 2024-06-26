# Introduction

TurkeyTickle Stack is a prescriptive, opinionated project template for a front-end web development.

## Key Dependencies

- Bun ([Docs](https://bun.sh/docs)) - Package manager
- Vite ([Docs](https://vitejs.dev/)) - Build tool, HMR
- React ([Docs](https://react.dev/)) - UI Framework
- Mantine ([Docs](https://mantine.dev/) ) - UI Components
- Mantine DataTable ([Docs](https://icflorescu.github.io/mantine-datatable/)) - Data tables
- Tabler Icons ([Docs](https://tabler.io/docs/getting-started)) - Icons
- Biome ([Docs](https://biomejs.dev/)) - Formatting, Linting
- Zod ([Docs](https://zod.dev/)) - Schema validation for models and forms
- Zustand ([Docs](https://zustand-demo.pmnd.rs/)) - App state management
- TanStack Query ([Docs](https://tanstack.com/query/latest/docs/react/overview)) - API-sourced data state management
- Axios ([Docs](https://axios-http.com/docs/intro)) - HTTP
- TanStack Router ([Docs](https://tanstack.com/router)) - Routing

## Project Structure

The root directory contains several configuration files:

- `.editorconfig` (EditorConfig configuration) - Enforces consistent indenting and line endings with the help of the EditorConfig VSCode extension (included in [recommended extensions](<#Recommended Extensions>))
- `biome.json` (Biome configuration) - Automatically formats and lints code with the help of the Biome VSCode extension (included in [recommended extensions](<#Recommended Extensions>))
- `postcss.config.cjs` (PostCSS configuration) - Required by Mantine and defines responsive breakpoint CSS variables. These can be modified based on project needs.
- `tsr.config.json` (TanStack Router Vite extension configuration) - While the Vite dev server is running and watching for file changes (`bun run dev`), the TanStack Router Vite extension watches the `src/routes` directory for changes and automatically regenerates the `src/route-tree.gen.ts` file. This generated file defines all page routes for the application, and provides type-safety for route paths. See the [routing section](#Routing) for more information on the file-based routing approach.
- `tsconfig.json` and `tsconfig.vite.json` (TypeScript configuration) - Defines several settings that are required for Vite/React, but also includes TypeScript strictness rules. A full list of rules and what they mean can be found [here](https://www.typescriptlang.org/tsconfig).
- `vite.config.ts` (Vite configuration) - Contains build settings and extensions like the TanStack Router extension mentioned above.
- `.env`, `env.dev`, `.env.uat`, `.env.prod` (dotenv configuration) - Vite uses these files to provide different sets of environment variables to the app based on the environment the app is running in. See the [Vite Env documentation](https://vitejs.dev/guide/env-and-mode) for more info. All custom environment variables should be added to the `src/env.d.ts` file, which provides type-safety for these environment variables throughout the rest of the application.

The `src` directory is where the main app code lives, and contains several subdirectories:

- `assets` - Static assets that are required by the application
- `components` - All reusable components. See the [Components](#Components) section for more info.
- `models` - Data models and enums. See the [Models](#Models) section for more info the modeling approach.
- `routes` - Contains "route" components. In general, each file in this directory maps directly to a URL route, but it also contains certain files like layout files (prefixed with a single underscore). See the [Routing](#Routing) section for more info.
- `services` - Contains groups of functions that call API endpoints and return data. See [API Queries](<#API Queries>) section for more info.
- `state` - Contains client-side state management stores. For example, `src/state/app.store.ts` contains a store that saves and retrieves whether the app drawer on the main layout is open or closed from browser local storage.
- `theme` - Contains files related to Mantine theme customization.

## Debugging (VS Code)

The `.vscode` directory contains `launch.json` and `tasks.json` files that tell VS Code how to build the application and launch the application in a browser window that can be debugged directly from VS Code. To run the dev server and launch a debuggable browser window, go to the `Run and Debug` tab in the sidebar in VSCode, select either `Debug Client (Edge)` or `Debug Client (Chrome)`,  then press the `F5` key. You should now be able to set breakpoints in React code in VS Code.

If you don't need a debugger and would rather just start the dev server and open the page in a browser manually, you can run the default build task by pressing `ctrl+shift+b` (windows) or `cmd+shift+b` (mac), or you can run the `bun run dev` command from a terminal at the project root. Both methods run the same command.

Either way, as long as the `bun run dev` command is running, Vite will hot reload the browser tab whenever changes are saved.

## Components

 All components that do not map directly to a URL route belong in the `src/components` directory. These are components that are meant to be used from *within* route components, so if a component requires something like an ID that comes from the route, (for example `/users/5`) that ID should be passed into the component as a prop. When a *route* component needs to be able to respond to an action that occurs within a *non-route* component, a function prop should be passed from the route component to the non-route component and called when the event occurs so the route component can respond appropriately. See the simplified examples below or `src/components/examples/users/user-form.tsx` for a more detailed example.

### Non-route component example

```tsx
interface Props {
	user: UserModel;
	onSaved: () => void;
}
 
function UserForm({ user, onSaved }: Props) {
	return (
		//...omitted form fields
		<Button onClick={() => onSaved()}>Save</Button>
	)
}
```

### Usage in route component 

```tsx
<UserForm
	user={user}
	onSaved={() => navigate({ to: "/examples/users" })}
/>
```

## Routing

### File-based Routing Strategy

Page routes are handled by TanStack Router using a file-based routin strategy. This means that application routes in the URL almost directly match the structure of the files in the `src/routes` directory. See this section of the [TanStack Router](https://tanstack.com/router/v1/docs/guide/file-based-routing#file-naming-conventions) documentation for details on route file naming conventions.

When running the application in development mode, the TanStack Router DevTools will appear in the bottom right corner of the page. These dev tools can be used to view the full route tree and information about each route. These dev tools are excluded from UAT and Prod builds.

## API Queries

API requests are handled with a combination of TanStack Query and Axios. Axios is responsible for the actual HTTP request, while TanStack Query sits on top providing things like result caching, retries, and exponential backoff.

### Axios

All API requests should use the Axios instance that is exported from `src/axios-instance.ts`. This instance provides standard request configuration and important interceptors that can do things like automatically redirect to a login page if a session expires, or display a toast notification telling the user that something went wrong when an API request fails.

### TanStack Query

TanStack Query provides two primary React hooks - `useQuery` and `useMutation`. Examples of the use of both of these hooks can be found at `src/routes/_main-layout/examples/users/index.tsx` and `src/routes/_main-layout/examples/users/$userId.index.tsx`. Both hooks provide caching, retries, and exponential backoff by default, but can be overridden as needed. 

When running the application in a local development environment, the TanStack Query DevTools will appear in the bottom-left corner of the page. These dev tools can be used to monitor the status of all queries and mutations, and to do helpful things like invalidate caches so the data is refetched from the server. These dev tools are excluded from UAT and Prod builds.

## Models

A common problem with retrieving data from an API in Typescript applications is that even if you've specified a type on the object that is holding the data that was returned from the API, the actual properties on that object might not match the properties defined in the type at all. Typescript is purely a development tool and is stripped away when the application is built for production, so Typescript can't by itself guarantee that an object matches the shape of a type during runtime. 

Zod helps solve this problem, among others, by allowing us to define schemas and parse API responses using those schemas. This allows us to validate during runtime that the data we received from the API is what we were expecting so we can respond appropriately, whether that's by logging an error, showing a message to the user, or something else.

## Form Validation

Mantine provides a framework for building forms that we can combine with Zod to provide rich, declarative form validation. Since we use Zod for our models, in some cases we can use that model directly to drive the form validation rules. In other cases, the fields for a form may not match a model directly. In these cases, Zod should be used to define a form-specific schema in the same file as the form component. See `src/components/examples/users/user-form.tsx` for an example of using a schema to drive form validation.

## Styling

In general, it's easiest to rely on Mantine components to provide out-of-the-box styling. For example, the [Stack Component](https://mantine.dev/core/stack/) is useful to stack items vertically, while the [Group Component](https://mantine.dev/core/group/) is useful for aligning items horizontally. Mantine components are designed to property support theming and light/dark mode, as well as providing consistent values for things like padding and margins. Before resorting to using style attributes or CSS files to style components, check the Mantine library to see if what you're trying to do can easily be acomplished with an out-of-the-box component. If Mantine does not provide an easy way to properly style your component, [CSS modules](https://mantine.dev/styles/css-modules/) should be used.

## Recommended Extensions

When the root project directory is opened in VSCode, you will see a notification to install recommended extensions. It is highly recommended to install these extensions because they enable auto-formatting and linting to keep code style as consistent as possible. If code is pushed with lint errors, the CI/CD pipelines may fail and the lint error will need to be fixed. All recommended extensions are listed at `.vscode/extensions.json`.

## Auto-formatting and Linting

If the recommended formatting and linting VSCode extensions are installed, all code will be constantly checked for lint errors, and files will be automatically formatted on save. The linting rules mostly come from a recommended set for React and Typescript with minor modifications.
