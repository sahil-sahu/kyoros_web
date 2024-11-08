# Use the official PostgreSQL image
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=kyoros

# Copy the SQL file to the container
COPY db.sql /docker-entrypoint-initdb.d/

# The `docker-entrypoint-initdb.d` folder is where any `.sql`, `.sql.gz`, or `.sh` files
# will automatically be executed by the official PostgreSQL image during the container's initialization.
