import random
from PrimeGenerator import PrimeNumberGenerator
import numpy as np


class RSA:
    def __init__(self):
        self.public_key = None
        self.private_key = None

    def generate_keys(self):
        p = PrimeNumberGenerator(100).get_a_random_prime()
        q = PrimeNumberGenerator(100).get_a_random_prime()

        if p < q:
            p, q = q, p
        n = p * q
        phi = (p - 1) * (q - 1)

        e = PrimeNumberGenerator(100).get_a_random_prime()

        if e > phi:
            e, phi = phi, e

        d = self.modinv(e, phi)

        self.public_key = (n, e)
        self.private_key = (n, d)

    def encrypt(self, message):
        n, e = self.public_key
        encrypted_message = [pow(ord(char), e, n) for char in message]
        return encrypted_message

    def encrypt_with_public_key(self, message, public_key):
        n, e = public_key
        encrypted_message = [pow(ord(char), e, n) for char in message]
        return encrypted_message

    def encrypt_with_public_key_np(self, message, public_key):
        n, e = public_key
        encrypted_message = np.array(
            [pow(ord(char), e, n) for char in message])
        return encrypted_message

    def decrypt(self, encrypted_message):
        n, d = self.private_key
        decrypted_message = [chr(pow(char, d, n))
                             for char in encrypted_message]
        decrypted_message = ''.join(decrypted_message)
        return decrypted_message

    def decrypt_with_private_key(self, encrypted_message, private_key):
        n, d = private_key
        decrypted_message = [chr(pow(char, d, n))
                             for char in encrypted_message]
        decrypted_message = ''.join(decrypted_message)
        return decrypted_message

    def decrypt_with_private_key_np(self, encrypted_message, private_key):
        n, d = private_key
        decrypted_message = [chr(pow(char, d, n))
                             for char in encrypted_message]
        decrypted_message = ''.join(decrypted_message)
        return decrypted_message

    def modinv(self, a, m):
        g, x, y = self.extended_gcd(a, m)
        if g != 1:
            raise Exception('modular inverse does not exist')
        return x % m

    def extended_gcd(self, a, b):
        if a == 0:
            return (b, 0, 1)
        else:
            g, y, x = self.extended_gcd(b % a, a)
            return (g, x - (b // a) * y, y)
