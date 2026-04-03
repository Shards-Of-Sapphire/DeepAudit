from deepaudit.scanners.dependency import verify_dependencies, verify_package
from deepaudit.scanners.secret import scan_for_secrets
from deepaudit.scanners.static import audit_logic


class StubResponse:
    def __init__(self, status_code: int):
        self.status_code = status_code


class StubSession:
    def __init__(self, mapping: dict[str, int]):
        self.mapping = mapping

    def get(self, url: str, timeout: int = 5) -> StubResponse:
        package_name = url.rstrip("/").split("/")[-2]
        return StubResponse(self.mapping.get(package_name, 404))


def test_verify_real_package() -> None:
    exists, msg = verify_package("requests", session=StubSession({"requests": 200}))
    assert exists is True
    assert "Verified" in msg


def test_verify_fake_package() -> None:
    exists, msg = verify_package(
        "this_is_a_hallucinated_package_12345",
        session=StubSession({"this_is_a_hallucinated_package_12345": 404}),
    )
    assert exists is False
    assert "HALLUCINATION" in msg


def test_verify_dependencies_reports_missing_package() -> None:
    findings = verify_dependencies(
        {
            "libraries": [
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

    assert len(findings) == 1
    assert findings[0]["severity"] == "CRITICAL"
    assert findings[0]["package"] == "deepaudit_secure_helper_v99"


def test_scan_for_github_token() -> None:
    fake_code = (
        'token = "github_pat_11A2B3C4D5E6F7G8H9I0J1_'
        'K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0"'
    )
    findings = scan_for_secrets(fake_code)
    assert len(findings) > 0
    assert findings[0]["label"] == "GitHub Token"


def test_scan_no_secrets() -> None:
    clean_code = 'print("Hello Sapphire!")'
    findings = scan_for_secrets(clean_code)
    assert len(findings) == 0


def test_audit_logic_flags_eval() -> None:
    findings = audit_logic({"raw_code": "result = eval(user_input)"})
    assert len(findings) == 1
    assert findings[0]["severity"] == "HIGH"
