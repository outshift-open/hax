import unittest

import mock_services

class TestProbabilityMethods(unittest.TestCase):

    def test_probability_helper(self):

        ### Input validation
        probability = 101
        with self.assertRaises(ValueError):
            mock_services._probability(probability)

        probability = -1
        with self.assertRaises(ValueError):
            mock_services._probability(probability)

        ### Probability sanity tests 

        probability = 0
        trials = 1000
        error_margin = 0
        success = 0
        failures = 0
        for _ in range(trials):
            if mock_services._probability(probability):
                success += 1
            else:
                failures += 1
        
        print("Success: ", success)
        print("Failures: ", failures)
        self.assertEqual(success + failures, trials)
        self.assertTrue(success == 0 and failures == trials)

        ##################

        probability = 100
        trials = 1000
        error_margin = 0
        success = 0
        failures = 0
        for _ in range(trials):
            if mock_services._probability(probability):
                success += 1
            else:
                failures += 1
        
        print("Success: ", success)
        print("Failures: ", failures)
        self.assertEqual(success + failures, trials)
        self.assertTrue(success == trials and failures == 0)

        ##################

        probability = 50
        trials = 1000
        error_margin = 35
        success = 0
        failures = 0
        for _ in range(trials):
            if mock_services._probability(probability):
                success += 1
            else:
                failures += 1
        
        print("Success: ", success)
        print("Failures: ", failures)
        self.assertEqual(success + failures, trials)
        self.assertTrue(success < probability/100.0 * trials + error_margin and success > probability/100.0 * trials - error_margin)

        ##################

        probability = 25
        trials = 1000
        error_margin = 35
        success = 0
        failures = 0
        for _ in range(trials):
            if mock_services._probability(probability):
                success += 1
            else:
                failures += 1
        
        print("Success: ", success)
        print("Failures: ", failures)
        self.assertEqual(success + failures, trials)
        self.assertTrue(success < probability/100.0 * trials + error_margin and success > probability/100.0 * trials - error_margin)

        ##################

        probability = 75.0
        trials = 1000
        error_margin = 35
        success = 0
        failures = 0
        for _ in range(trials):
            if mock_services._probability(probability):
                success += 1
            else:
                failures += 1
        
        print("Success: ", success)
        print("Failures: ", failures)
        self.assertEqual(success + failures, trials)
        self.assertTrue(success < probability/100.0 * trials + error_margin and success > probability/100.0 * trials - error_margin)
        

if __name__ == '__main__':
    unittest.main()