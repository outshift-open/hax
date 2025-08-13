from flask import Flask
import os
from prometheus_flask_exporter import PrometheusMetrics

service_name = os.environ.get("SERVICE_NAME", "platform-demo")
app = Flask(service_name)

metrics_labels = {
    "service_name": service_name
}
metrics = PrometheusMetrics(app, default_labels=metrics_labels, default_latency_as_histogram=False)
metrics.start_http_server(5001)
