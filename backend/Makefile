install:
	pip install -r requirements.txt

format:
	black *py api/*py api/routes/*py

run:
	uvicorn main:app --reload

all: install format run