# 1. Use a lightweight Python base image to keep the container fast
FROM python:3.11-slim

# 2. Prevent Python from writing .pyc files and force stdout logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Copy your project files into the container
COPY . /app/

# 5. Install DeepAudit and its dependencies using the pyproject.toml we just made
RUN pip install --no-cache-dir .

# 6. Expose the port the FastAPI server will run on
EXPOSE 8000

# 7. The command to boot the API Gateway when the container starts
CMD ["uvicorn", "deepaudit.api.main:app", "--host", "0.0.0.0", "--port", "8000"]