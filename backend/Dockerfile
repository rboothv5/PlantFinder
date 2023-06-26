FROM python:3.8-slim-buster
WORKDIR /PlantFinder/backend
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip3 install -r requirements.txt
COPY . .

