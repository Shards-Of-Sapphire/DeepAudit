from src.deepaudit.scanners.dependency import scan as verify_dependencies


class StubResponse:
    def __init__(self, status_code: int):
        self.status_code = status_code


class StubSession:
    def __init__(self, mapping: dict[str, int]):
        self.mapping = mapping

    def get(self, url: str, timeout: int = 5) -> StubResponse:
        package_name = url.rstrip("/").split("/")[-2]
        return StubResponse(self.mapping.get(package_name, 404))


SAMPLE_WITH_FAKE_DEP = """
import os
import requests
import deepaudit_secure_helper_v99

def process_data(user_input):
    result = eval(user_input)
    return result
"""


def test_fake_dependency_fixture_is_flagged() -> None:
    findings = verify_dependencies(
        {
            "libraries": [
                "os",
                "requests",
                "deepaudit_secure_helper_v99",
            ]
        },
        session=StubSession(
            {
                "requests": 200,
                "deepaudit_secure_helper_v99": 404,
            }
        ),
    )

    assert any(finding["package"] == "deepaudit_secure_helper_v99" for finding in findings)
