# Use the official Python 3.9 image
FROM python:3.9

# Create user to avoid running as root (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user

# Set environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory
WORKDIR $HOME/app

# Copy requirements file first to leverage Docker cache
COPY --chown=user requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application code
COPY --chown=user . .

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Command to run the application using uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]
