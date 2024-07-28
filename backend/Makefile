install:
	pip install -r requirements.txt

format:
	black *py app/*py app/routers/*py app/internal/*py

run:
	uvicorn main:app

all: install format run