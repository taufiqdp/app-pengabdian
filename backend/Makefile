install:
	pip install -r requirements.txt

format:
	black *py app/*py app/routers/*py app/internal/*py test/*py

testing:
	python -m pytest

run:
	uvicorn main:app

all: install format testing run 