### HANDLES CLEANING OF SCRAPED DATA

# import necessary packages
from bs4 import BeautifulSoup
import re

def extract_body_content(html_content):
    """Extract body content from HTML page. """
    soup = BeautifulSoup(html_content, "html.parser")
    body_content = soup.body
    return str(body_content) if body_content else ""

def clean_body_content(body_content):
    """Clean the body content, removing scripts, styles and unnecessary texts."""
    soup = BeautifulSoup(body_content, "html.parser")

    # remove script, style tags
    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()

    # convert to text and remove unnecessary spaces
    cleaned_content = soup.get_text(separator="\n")
    cleaned_content = "\n".join([line.strip() for line in cleaned_content.splitlines() if line.strip()])

    return cleaned_content

### CHUNK SPLITTER FOR LLM 
def split_dom_content(dom_content, max_length=6000):
    return [dom_content[i:i+max_length] for i in range(0, len(dom_content), max_length)]
