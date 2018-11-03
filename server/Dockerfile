FROM golang:1.10.3-stretch as build
RUN mkdir -p /usr/src/github.com/calebhiebert/hybread/server
WORKDIR /usr/src/github.com/calebhiebert/hybread/server

# Copy all application files
COPY . .
RUN go get -d ./...
RUN export GOOS=linux GOARCH=amd64 CGO_ENABLED=1 && go build -o hybread

# Use Alpine as the second build step for a small image
FROM alpine:latest
RUN apk --no-cache add ca-certificates
RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2 && mkdir /app
COPY --from=build /usr/src/github.com/calebhiebert/hybread/server /app/hybread
ENV GIN_MODE=release

CMD [ "/app/hybread" ]