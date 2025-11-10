# Copyright 2025 Cisco Systems, Inc. and its affiliates
#
# SPDX-License-Identifier: Apache-2.0

import datetime
import json
import logging
import os
from flask import request, Response

from common import app, metrics, service_name
from health_check import check_self, HealthState


# static information as metric
metrics.info('app_info', 'Application info', version=os.environ.get("APPLICATION_VERSION", "NOT_FOUND"))


@app.route("/")
def hello():
    # logs and metrics dashboard links should be displayed only if MCOM is available for observability
    observability_links_html = """
    <li><a href="https://outshift-preprod.observe.appdynamics.com/ui/tools/logs?since=now-1h">Logs</a> (if deployed to ETI Platform)</li>
    <li><a href='{grafana_dashboard_url}'>Grafana Dashboard</a> (if deployed to ETI Platform)</li>
    """.format(
        service_name=service_name,
        grafana_dashboard_url=os.environ.get("METRICS_DASHBOARD_URL")
    )
    # Return HTML to render for the page
    return """
    <html>
        <body>
        <p>Platform Demo hax Hello World</p>
        <ul>
            <li><a href='/env'>Env Vars</a></li>
            <li><a href='/metrics'>Metrics</a></li>
            <li><a href='/healthz'>Health</a></li>
            {0}
        </ul>
        </body>
    <html>
    """.format(observability_links_html)

@app.route("/env")
def env_var():
    # Test retrieving environment variable set via k8s configmap
    return """
    <html>
        <body>
        <p>Platform Demo hax Hello World Environment Vars</p>
        <ul>
            <li>CONFIGMAP_TEST: {}</li>
            <li>CONFIGMAP_DEFAULT_EXAMPLE: {}</li>
            <li>CONFIGMAP_OVERLAY_EXAMPLE: {}</li>
            <li>APPLICATION_VERSION: {}</li>
            <li>MOCK_DB_UPTIME: {}</li>
            <li>MOCK_FOO_UPTIME: {}</li>
        </ul>
        </body>
    </html>
    """.format(
        os.environ.get("CONFIGMAP_TEST"),
        os.environ.get("CONFIGMAP_DEFAULT_EXAMPLE"),
        os.environ.get("CONFIGMAP_OVERLAY_EXAMPLE"),
        os.environ.get("APPLICATION_VERSION"),
        os.environ.get("MOCK_DB_UPTIME"),
        os.environ.get("MOCK_FOO_UPTIME")
    )

@app.route("/foo")
@metrics.counter('foo', 'Number of requests for /foo',
         labels={'path': '/foo', 'method': lambda: request.method})
def foo():
    # Return a 404 response for /foo
    return """
    <html>
        <body>
        <h1>Hello, foo</h1>
        </body>
    </html>
    """


##### Health Endpoint Example

@app.route("/healthz")
@metrics.counter('healthz', 'Number of requests for /healthz',
         labels={'path': '/healthz', 'method': lambda: request.method})
def healthz():
    """Example /healthz endpoint for a service.
    This endpoint is for demonstration only; the reported health states and
    "upstream" services do not reflect the health or dependencies of this
    demo service.
    """
    
    # self health check implemented in health_check.py
    service_state = check_self()

    # construct the healthz endpoint response body
    timestamp = datetime.datetime.now().isoformat()
    response_body = {
        "service_name": service_name,
        "service_state": service_state.name,
        "last_updated": timestamp
    }

    # Capture service health as status code for k8s liveness probe
    # - No need to restart service when service is up or an _optional_ dependency is down
    # - Restarting service may help with service is in unknown or bad state
    if (service_state == HealthState.UP) or (service_state == HealthState.DEGRADED):
        response_code = 200
    elif (service_state == HealthState.DOWN) or (service_state == HealthState.UNKNOWN):
        response_code = 500

    return Response(json.dumps(response_body), status=response_code, mimetype='application/json')


@app.errorhandler(404)
@metrics.do_not_track()
def page_not_found(e):
    return """
    <html>
        <body>
        <h1>404 - Not Found</h1>
        </body>
    </html>
    """

if __name__ == "__main__":
    log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
    app.logger.setLevel(logging.getLevelName(log_level))
    app.logger.info("Starting up the '{}' demo app! Version: '{}'".format(service_name, os.environ.get("APPLICATION_VERSION")))
    app.run(host='0.0.0.0')