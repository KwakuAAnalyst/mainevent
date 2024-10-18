# Event Ecosystem App

This is an event ecosystem web application built using Next.js, where users can view current and upcoming events, as well as add new events if they are verified using zkPass.

## Features

- View current and upcoming events.
- Add new events (requires zkPass verification & wallet connection).
- Responsive UI built with modern web technologies.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Authentication**: zkPass for verification
- **Deployment**: Vercel (or any Next.js compatible platform)

## Getting Started

Follow the steps below to get the app running locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (v1.22 or later)
- An AyaLabs account (for zkPass verification functionality)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/KwakuAAnalyst/mainevent.git

    ```

2. **Install dependencies**:
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```


### Running the Application

1. **Run the development server**:
    Using npm:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```

2. Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the app in action.

### Adding a New Event

1. Users must verify their identity with zkPass to add new events.
2. Click on the "Add New Event" button in the navigation bar.
3. Complete the zkPass verification process.
4. Connect your evm wallet.
5. Fill in the event details and submit the form.

### Deployment

To deploy this application, you can use platforms like Vercel, Netlify, or any platform that supports Next.js apps.

1. **Deploying on Vercel**:
   - Push the repository to GitHub.
   - Go to [Vercel](https://vercel.com/) and connect your GitHub repository.
   - Vercel will automatically build and deploy the project.

2. **Custom Deployment**:
   You can also deploy the app on any custom server that supports Node.js.
   To build for production:
   ```bash
   npm run build
   ```
   Then start the production server:
   ```bash
   npm start
   ```

## Contributing

Feel free to open issues or pull requests for any improvements.

## License

This project is licensed under the MIT License.


