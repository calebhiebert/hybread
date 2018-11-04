# Start with a golang image
FROM golang:1.10.3-stretch as build

# Install dep
ADD https://github.com/golang/dep/releases/download/v0.5.0/dep-linux-amd64 /usr/bin/dep
RUN chmod +x /usr/bin/dep

# Create a user to run the app as
RUN useradd --shell /bin/bash hybread

# Set the workdir to the application path
WORKDIR $GOPATH/src/github.com/calebhiebert/hybread

# Copy all application files
COPY . .

# Install packages
RUN dep ensure --vendor-only

# Build the app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix nocgo -ldflags="-w -s" -o /go/bin/hybread

# Start from a scratch container for a nice and small image
FROM scratch

# Copy the binary build
COPY --from=build /go/bin/hybread /go/bin/hybread

# Copy the password file (with the hybread user) from the build container
COPY --from=build /etc/passwd /etc/passwd

# Set the user to the previously created user
USER hybread

# Expose the API port
EXPOSE 8080

CMD [ "/go/bin/hybread" ]