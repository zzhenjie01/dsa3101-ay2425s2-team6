#!/bin/bash
set -e

# Add Spark jars to classpath
export SPARK_CLASSPATH="/opt/spark/jars/*"

# Default command
if [ "$1" = "spark-submit" ]; then
    exec "$@"
else
    echo "Container started. Waiting for spark-submit..."
    # Keeps the container alive indefinitely using a lightweight process
    # `tail -f` means follow the file, it keeps reading the end of the file.
    # `/dev/null` is a special Linux device that’s basically a black hole; it accepts input and discards it, and it’s always empty.
    # So this command never outputs anything and never ends.
    exec tail -f /dev/null
fi