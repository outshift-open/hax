FROM ghcr.io/cisco-eti/sre-python-docker:v3.11.9-hardened-debian-12

# Add user app
RUN useradd -u 1001 app

# Create the app directory and set permissions to app
RUN mkdir /home/app/ && chown -R app:app /home/app

WORKDIR /home/app

# run the application as user app
USER app

# copy the dependencies file to the working directory
COPY --chown=app:app app/requirements.txt .

# install dependencies
RUN pip3 install --user -r requirements.txt --break-system-packages

# copy the content of the local src directory to the working directory
COPY --chown=app:app app/src/ .


# command to run on container start
CMD [ "python3", "server.py" ]
