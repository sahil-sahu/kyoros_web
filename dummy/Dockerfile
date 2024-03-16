# Use a Python base image
FROM python:3.10.12

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the contents of the Python project to the container
COPY ./app .
COPY requirements.txt /
RUN pip install -r /requirements.txt

# # Expose any necessary ports for the application
# # EXPOSE 8000

# # Specify the command to run the Python application
CMD ["python3", "main.py"]