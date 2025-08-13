from enum import Enum
from prometheus_flask_exporter import Gauge, Histogram
import time

from common import service_name
from mock_services import verify_db, verify_foo

class HealthState(Enum):
    UP = 0
    UNKNOWN = 1
    DEGRADED = 2
    DOWN = 3

class HealthCheckType(Enum):
    SELF = 0
    UNKNOWN = 1
    DEPENDENCY_OPTIONAL = 2
    DEPENDENCY_CRITICAL = 3

health_metrics_labels = ['service_name', 'health_check_type', 'health_check_name']

HEALTH_SELF_STATE = Gauge('health_self_state', 'state of self health check (gauge)', health_metrics_labels)

state_buckets = (0, 1, 2, 3)
HEALTH_SELF_STATE_H = Histogram('health_self_state_h', 'state of self health check (histogram)', health_metrics_labels, buckets=state_buckets)

HEALTH_DEPENDENCY_STATE = Gauge('health_dependency_state', 'state of db dependency check (gauge)', health_metrics_labels)
HEALTH_DEPENDENCY_STATE_H = Histogram('health_dependency_state_h', 'state of dependency health check (histogram)', health_metrics_labels, buckets=state_buckets)
HEALTH_DEPENDENCY_DURATION = Gauge('health_dependency_duration', 'duration of dependency health check (gauge)', health_metrics_labels)
HEALTH_DEPENDENCY_DURATION_H = Histogram('health_dependency_duration_h', 'duration of dependency health check (histogram)', health_metrics_labels)


def check_db():
    """Verify successful queries on dependent database
    """
    start_time = time.time()
    is_ok = verify_db()
    duration = time.time() - start_time
    service_state = HealthState.UP if is_ok else HealthState.DOWN

    # update health metrics
    HEALTH_DEPENDENCY_DURATION.labels(service_name, HealthCheckType.DEPENDENCY_CRITICAL.name, 'db').set(duration)
    HEALTH_DEPENDENCY_DURATION_H.labels(service_name, HealthCheckType.DEPENDENCY_CRITICAL.name, 'db').observe(duration)
    HEALTH_DEPENDENCY_STATE.labels(service_name, HealthCheckType.DEPENDENCY_CRITICAL.name, 'db').set(service_state.value)
    HEALTH_DEPENDENCY_STATE_H.labels(service_name, HealthCheckType.DEPENDENCY_CRITICAL.name, 'db').observe(service_state.value)
    return is_ok


def check_foo():
    """Verify dependency service Foo is reachable
    """
    start_time = time.time()
    is_ok = verify_foo()
    duration = time.time() - start_time
    service_state = HealthState.UP if is_ok else HealthState.DOWN

    # update health metrics
    HEALTH_DEPENDENCY_DURATION.labels(service_name, HealthCheckType.DEPENDENCY_OPTIONAL.name, 'foo').set(duration)
    HEALTH_DEPENDENCY_DURATION_H.labels(service_name, HealthCheckType.DEPENDENCY_OPTIONAL.name, 'foo').observe(duration)
    HEALTH_DEPENDENCY_STATE.labels(service_name, HealthCheckType.DEPENDENCY_OPTIONAL.name, 'foo').set(service_state.value)
    HEALTH_DEPENDENCY_STATE_H.labels(service_name, HealthCheckType.DEPENDENCY_OPTIONAL.name, 'foo').observe(service_state.value)
    return is_ok


def check_self():
    """Define service-specific logic for calculating this service's health state.
    """
    # check db (mocked)
    db_ok = check_db()
    # check foo (mocked)
    foo_ok = check_foo()

    if db_ok and foo_ok:
        service_state = HealthState.UP
    if db_ok and not foo_ok:
        # foo is an optional dependency
        service_state = HealthState.DEGRADED
    if not db_ok:
        # db is a critical service
        service_state = HealthState.DOWN

    # update health metrics
    HEALTH_SELF_STATE.labels(service_name, HealthCheckType.SELF.name, service_name).set(service_state.value)
    HEALTH_SELF_STATE_H.labels(service_name, HealthCheckType.SELF.name, service_name).observe(service_state.value)
    return service_state
