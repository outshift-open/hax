import os
import random


def _probability(probability):
    """Simulate success with specified probability.
    Probability must be a decimal value between 0 and 100, inclusive.
    Returns True for success; returns False for failure
    """
    SIMULATE_WITH_PROBABILITY = os.environ.get("SIMULATE_WITH_PROBABILITY", False)
    if SIMULATE_WITH_PROBABILITY:
      if (probability < 0) or (probability > 100):
          raise ValueError("Invalid probability value. Must be an int between 0 and 100, inclusive.")
      if random.randint(1, 100) <= probability:
          return True
      else:
          return False
    else:
      return True

def verify_db():
    MOCK_DB_UPTIME = float(os.environ.get("MOCK_DB_UPTIME", "99.0"))
    if _probability(MOCK_DB_UPTIME):
        return True
    else:
        return False


def verify_foo():
    MOCK_FOO_UPTIME = float(os.environ.get("MOCK_FOO_UPTIME", "99.0"))
    if _probability(MOCK_FOO_UPTIME):
        return True
    else:
        return False