install:
	pip install -r requirements.txt

format:
	black *py api/*py api/routers/*py api/internal/*py

run:
	uvicorn main:app

all: install format run