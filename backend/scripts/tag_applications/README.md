# Resume Parser
This is a simple API for parsing resume files using [pyresparser](https://github.com/OmkarPathak/pyresparser). 

## Downloading Requirements
### Virtualenv
You can set up a virtual environment with the following commands:
~~~
python -m venv venv/
source venv/bin/activate
~~~
Install the required dependencies:
~~~
pip install -r requirements.txt
~~~
### Anaconda
Alternatively, you can use Anaconda:
~~~
conda env create -f environment.yml
conda activate resume-parser
~~~
## spaCy and NLTK
Pyresparser uses spaCy and NLTK for NLP operations. Install them using the following commands:
~~~
# spaCy
python -m spacy download en_core_web_sm

# nltk
python -m nltk.downloader words
python -m nltk.downloader stopwords
~~~
## Running the API Locally
Running the following command will get the app set up on port 5000:
~~~
python app.py
~~~