# Development Workflows

Use the following workflows to make and roll out changes to your application.

## Local Development
Build and run the application in your local development environment to quickly iterate and test changes to your application.

1. Build your application as a Docker image:
    ```
    ./build-docker.sh
    ```
1. Run your application in a local Docker container:
    ```
    docker run -p 8080:5000 demo-<YOUR_APP_NAME>:latest
    ```
1. Navigate to http://localhost:8080 in your browser to see your application with your local changes

## Deployment

#TODO: add details