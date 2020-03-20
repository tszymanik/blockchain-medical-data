FROM ubuntu:latest

LABEL maintainer Tomasz Szymanik <tmszymanik@gmail.com>

RUN useradd szyman --create-home

RUN apt-get update
RUN apt-get install -y software-properties-common curl wget nodejs npm

USER szyman
CMD /bin/bash
