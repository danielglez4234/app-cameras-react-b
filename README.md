## Docker settings

**To run on docker:**
Donwload the Dockerfile and run `Docker build .` in the same directory where you downloaded it. \
Open [http://localhost:3005](http://localhost:3005) to view it in the browser.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3005](http://localhost:3005) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# monitor manager database configurations file

#### Notas:
- **Magnitude_description**:
    - El campo "description" no esta en la base de datos pero si en los demás. Por ahora el campo es agregado colocado a "None" por defecto.
    - De igual forma los campos upper_limit, lower_limit, default_storage_period y default_sampling_period son colocados a "true", "false", "0.0", "0.0" por defecto respectivamente.
    - El campo "value" no esta en el .profile pero si en los demás.
- **Monitor_description**:
    - El script hace el siguiente arreglo siguiendo el formato establecido \
      En el upper_limit y el lower_limit cuando los elementos de un monitor array son todos iguales los agrupa en uno solo \
      ejemplo: \
      desigual: array["1000", "1000", "23", "1000"]..   result => "upper_limit": "["1000","1000", "1000", "23", "1000"]" \
      igual:    array["1000", "1000", "1000", "1000"].. result => "upper_limit": "["1000"]"


#### *- El script actualmente genera la siguiente vista de los datos de los monitores con el formato predefinido:

### monitor_description:

    "instance": <component_name>,
    "className": <class_name>,
    "monitors": {
      <monitor_name>: {
        "description": <description>,
        "units": <unit>,
        "type": <type>,
        "upper_limit": <upper_limit>,
        "lower_limit": <lower_limit>,
        "default_sampling_period": <default_sampling_period>,
        "default_storage_period": <default_storage_period>
      }
    }
}

### magnitude_description:

    "instance": <component_name>,
    "className": <class_name>,
    "monitors": {
      <monitor_name>: {
        "description": "None",
        "units": "None",
        "type": <type>,
        "upper_limit": "true",
        "lower_limit": "false",
        "default_sampling_period": "0.0",
        "default_storage_period": "0.0",
        "value": <values>
      }
    }