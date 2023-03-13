import time
from RSA import *

# Try Bruteforcing the private key


def find_private_key(public_key):
    start_time = time.time()
    n = public_key[0]
    e = public_key[1]

    def phi(n):
        result = n
        p = 2
        while p * p <= n:
            if n % p == 0:
                while n % p == 0:
                    n = n / p
                result = result * (1.0 - (1.0 / float(p)))
            p = p + 1
        if n > 1:
            result = result * (1.0 - (1.0 / float(n)))
        return int(result)

    for d in range(1, n):
        if (e * d) % phi(n) == 1:
            end_time = time.time()
            print("Time required:", end_time-start_time)
            return (n, d)

    print("Private key not found.")
    return None


print("Brute Force:", find_private_key((529, 53)))
