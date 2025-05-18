# termina.ai - bff / proxy

<p align="center">
  <img alt="Logo" with="300" height="300" src="./static/images/termina-ai.jpg" />
</p>

This project acts as an intermediary that connects your frontend interface with backend services. It is designed to manage user connections over dedicated virtual rooms, providing a seamless experience for individuals during the relationship termination process.

## Features

- Acts as a proxy between the frontend and backend.
- Maintains user connectivity in virtual rooms.
- Facilitates secure and stable communication.
- Enforces code quality standards using ESLint, Prettier, and TypeScript type checks.

## Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:AllanOliveiraM/termina-ai-rooms-back.git
   cd termina-ai-rooms-back
   ```

2. **Install dependencies using Yarn:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with all the mandatory environment variables. At a minimum, ensure that the following variables are defined:

   - `PORT`
   - `NODE_ENV`
   - `JWT_SECRET`
   - `TERMINAI_SERVICE_URL`

## Scripts

The following scripts are available in the `package.json`:

#### Prepares the environment through a setup script.

```bash
$ yarn prepare
```

#### Starts the NestJS application in watch mode.

```bash
$ yarn dev
```

#### Runs TypeScript type checks.

```bash
$ yarn type:check
```

#### Verifies code quality with ESLint.

```bash
$ yarn eslint:check
```

#### Verifies the code style with Prettier.

```bash
$ yarn prettier:check
```

#### Uses Commitizen for standardized commit messages.

```bash
$ yarn commit
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
