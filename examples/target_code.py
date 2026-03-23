import os
import requests


def run(user_input: str) -> str:
    token = "github_pat_exampletoken1234567890_exampletoken1234567890"
    os.system("echo scanning")
    return requests.get(user_input).text
