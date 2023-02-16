import math
import numpy as np


class PrimeNumberGenerator:
    def __init__(self, n):
        self.n = n
        self.primes = self.generate_primes()

    def generate_primes(self):
        primes = []
        for i in range(2, self.n):
            if self.is_prime(i):
                primes.append(i)
        return primes

    def is_prime(self, n):
        if n == 2:
            return True
        if n % 2 == 0 or n <= 1:
            return False
        sqr = int(math.sqrt(n)) + 1
        for divisor in range(3, sqr, 2):
            if n % divisor == 0:
                return False
        return True

    def get_a_random_prime(self):
        return self.primes[np.random.randint(0, len(self.primes))]
