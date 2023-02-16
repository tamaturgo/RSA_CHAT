from datetime import datetime, timedelta
import requests
import json
import customtkinter as ctk
from PIL import Image
import pandas as pd
import numpy as np
import math
from RSA import RSA
import threading
import time


class UserDto:
    def __init__(self, email, password, name):
        self.password = password
        self.phoneNumber = 9999999999
        self.email = email
        self.name = name
        self.rsaPublicKey = 999999

    def set_rsa_public_key(self, key):
        self.rsaPublicKey = key


class Application:

    logged_user_id = None
    logged_user_name = None
    logged_user_email = None

    logged_user_public_key = None
    logged_user_private_key = None

    def __init__(self, master):
        self.master = master
        master.title("CHAT RSA")
        # Login
        self.login_view()

        # RSA Generate Keys
        self.rsa = RSA()
        self.rsa.generate_keys()

        # Save Key in File
        self.private_key = self.rsa.private_key
        self.public_key = self.rsa.public_key

        self.save_keys(self.private_key, self.public_key)

        print("Private Key: ", self.private_key)
        print("Public Key: ", self.public_key)

        print("Message: Hello World")
        self.encrypted_message = self.rsa.encrypt("Hello World")
        print("Encrypted Message: ", self.encrypted_message)
        print("Decrypted Message: ", self.rsa.decrypt(self.encrypted_message))
    # ! -- Views --
    # ? Login

    def login_view(self):
        self.frame = ctk.CTkFrame(self.master)
        self.frame.pack(pady=20, padx=60, fill="both", expand=True)

        self.label = ctk.CTkLabel(
            self.frame, text="CHAT RSA", font=("Helvetica", 16))
        self.label.pack(pady=20, padx=20)

        self.divider = ctk.CTkFrame(self.frame, height=2)
        self.divider.pack(fill="x", padx=5, pady=5)

        self.group_frame_user = ctk.CTkFrame(self.frame)
        self.group_frame_user.pack(pady=20, padx=20)

        self.label = ctk.CTkLabel(self.group_frame_user, text="Username")
        self.label.pack(pady=20, padx=20, side="left")

        self.username_entry = ctk.CTkEntry(self.group_frame_user)
        self.username_entry.pack(pady=20, padx=20)

        self.group_frame_pass = ctk.CTkFrame(self.frame)
        self.group_frame_pass.pack(pady=20, padx=20)

        self.label = ctk.CTkLabel(self.group_frame_pass, text="Password")
        self.label.pack(pady=20, padx=20, side="left")

        self.password_entry = ctk.CTkEntry(self.group_frame_pass)
        self.password_entry.pack(pady=20, padx=20)

        self.button = ctk.CTkButton(
            self.frame, text="Login", command=self.login_method)
        self.button.pack(pady=0, padx=0)

        self.label = ctk.CTkLabel(self.frame, text="", text_color="red")
        self.label.pack(pady=20, padx=20)

        self.button = ctk.CTkButton(
            self.frame, text="Create User", command=self.open_create_user)
        self.button.pack(pady=0, padx=0)

    # ? Create User
    def create_user_view(self):
        self.frame = ctk.CTkFrame(self.master)
        self.frame.pack(pady=20, padx=60, fill="both", expand=True)

        self.label = ctk.CTkLabel(
            self.frame, text="CHAT RSA", font=("Helvetica", 16))
        self.label.pack(pady=20, padx=20)

        self.divider = ctk.CTkFrame(self.frame, height=2)
        self.divider.pack(fill="x", padx=5, pady=5)

        self.group_frame_user = ctk.CTkFrame(self.frame)
        self.group_frame_user.pack(pady=0, padx=0, fill="both", expand=True)

        self.label = ctk.CTkLabel(self.group_frame_user, text="Username")
        self.label.pack(pady=20, padx=20, side="left")

        self.username_entry = ctk.CTkEntry(self.group_frame_user)
        self.username_entry.pack(pady=20, padx=20, fill="both",
                                 side="right")

        self.group_frame_email = ctk.CTkFrame(self.frame)
        self.group_frame_email.pack(pady=0, padx=0, fill="both", expand=True)

        self.label = ctk.CTkLabel(self.group_frame_email, text="Email")
        self.label.pack(pady=20, padx=20, side="left")

        self.email_entry = ctk.CTkEntry(self.group_frame_email)
        self.email_entry.pack(pady=20, padx=20, fill="both",
                              side="right")

        self.group_frame_pass = ctk.CTkFrame(self.frame)
        self.group_frame_pass.pack(pady=0, padx=0, fill="both", expand=True)

        self.label = ctk.CTkLabel(self.group_frame_pass, text="Password")
        self.label.pack(pady=20, padx=20, side="left")

        self.password_entry = ctk.CTkEntry(self.group_frame_pass)
        self.password_entry.pack(pady=20, padx=20, fill="both",
                                 side="right")

        self.group_frame_pass_confirm = ctk.CTkFrame(self.frame)
        self.group_frame_pass_confirm.pack(
            pady=0, padx=0, fill="both", expand=True)

        self.label = ctk.CTkLabel(
            self.group_frame_pass_confirm, text="Confirm Password")
        self.label.pack(pady=20, padx=20, side="left")

        self.password_entry_confirm = ctk.CTkEntry(
            self.group_frame_pass_confirm)
        self.password_entry_confirm.pack(pady=20, padx=20, fill="both",
                                         side="right")

        self.button = ctk.CTkButton(
            self.frame, text="Create User", command=self.create_user_method)
        self.button.pack(pady=0, padx=0)

        self.label_warning = ctk.CTkLabel(
            self.frame, text="", text_color="red")
        self.label_warning.pack(pady=20, padx=20)

    #! -- Methods -- #

    def save_keys(self, private_key, public_key):
        def tuple_to_string(x): return str(x[0]) + "," + str(x[1])
        private_key = tuple_to_string(private_key)
        public_key = tuple_to_string(public_key)
        # save tuple of keys to file
        with open('pyclient/private_key.txt', 'w') as f:
            f.write(private_key)
        with open('pyclient/public_key.txt', 'w') as f:
            f.write(public_key)

    def send_create_user_request(self, user):
        try:
            print("Sending request to server")
            print(user.__dict__)
            response = requests.post(
                "http://localhost:8080/api/v1/user", json=user.__dict__)

            # ? Open login view
            self.frame.destroy()
            self.login_view()

        except requests.exceptions.ConnectionError:
            self.label_warning.configure(text="Error connecting to server")

    def login_method(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if username == "" or password == "":
            self.label.configure(text="Please enter username and password")
        else:
            self.label.configure(text="")
            url = "http://localhost:8080/api/v1/user"
            response = requests.get(url)
            data = response.json()
            df = pd.DataFrame(data)
            print(df)
            df = df[df['email'] == username]
            df = df[df['password'] == password]
            if df.empty:
                self.label.configure(text="Username or password is incorrect")
            else:
                self.label.configure(text="")
                self.frame.destroy()
                self.chat_view()

                # ? Load keys from file
                with open('pyclient/private_key.txt', 'r') as f:
                    private_key = f.read()
                with open('pyclient/public_key.txt', 'r') as f:
                    public_key = f.read()

                # ? Convert string to tuple
                def string_to_tuple(x): return tuple(map(int, x.split(',')))
                private_key_tuple = string_to_tuple(private_key)
                public_key_tuple = string_to_tuple(public_key)

                # ? Create user object
                username = df['name'].values[0]
                email = df['email'].values[0]
                password = df['password'].values[0]
                user = UserDto(email, password, username)
                user.set_rsa_public_key(public_key)
                user_id = df['_id'].values[0]

                # ? update user on database
                self.send_update_user_request(user, user_id)

                # ? Update local user
                self.logged_user_id = user_id
                self.logged_user_name = username
                self.logged_user_email = email

    def get_all_users(self):
        url = "http://localhost:8080/api/v1/user"
        response = requests.get(url)
        data = response.json()
        df = pd.DataFrame(data)
        return df

    def send_update_user_request(self, user, userid):
        try:
            print("Sending request to server")
            print(user.__dict__)
            response = requests.put(
                "http://localhost:8080/api/v1/user/" + userid, json=user.__dict__)

            print(response)
        except requests.exceptions.ConnectionError:
            self.label_warning.configure(text="Error connecting to server")

    def open_create_user(self):
        self.frame.destroy()
        self.create_user_view()

    def create_user_method(self):
        username = self.username_entry.get()
        email = self.email_entry.get()
        password = self.password_entry.get()
        password_confirm = self.password_entry_confirm.get()

        if password != password_confirm:
            self.label_warning.configure(text="Passwords do not match")
            return

        user = UserDto(email, password, username)

        self.send_create_user_request(user)

    #
    #
    #
    #
    #
    #
    #
    # ? Chat

    def chat_view(self):
        self.frame = ctk.CTkFrame(self.master)
        self.frame.pack(pady=20, padx=60, fill="both", expand=True)

        self.group_frame_messages = ctk.CTkFrame(self.frame)

        self.messages_received = ctk.CTkLabel(
            self.group_frame_messages, text="", text_color="#0f003f", wraplength=900, justify="left")
        self.messages_received.pack(pady=20, padx=20, side="left")

        self.group_frame_send = ctk.CTkFrame(self.frame)
        self.group_frame_send.pack(pady=0, padx=0, expand=True)

        self.message_entry = ctk.CTkEntry(self.group_frame_send)
        self.message_entry.pack(pady=0, padx=0, fill="both", expand=True)

        self.button = ctk.CTkButton(
            self.group_frame_send, text="Send", command=self.send_message)
        self.button.pack(pady=0, padx=0)

        self.group_frame_messages.pack(
            pady=0, padx=0, fill="both", expand=True)

        # Create thread to update messages
        thread = threading.Thread(target=self.update_messages)
        thread.start()

    def update_messages(self):
        while True:
            self.load_messages()
            time.sleep(2)

    def load_messages(self):
        print("\n\nLoading messages")
        url = "http://localhost:8080/api/v1/message"
        response = requests.get(url)
        data = response.json()
        df = pd.DataFrame(data)
        df = df[df['reciverId'] == self.logged_user_id]
        # ?Decrypt messages

        # ? Load keys from file
        with open('pyclient/private_key.txt', 'r') as f:
            private_key = f.read()

        # ? Convert string to tuple
        def string_to_tuple(x): return tuple(map(int, x.split(',')))
        private_key_tuple = string_to_tuple(private_key)

        # ? Decrypt messages

        message_decrypted = []
        for index, row in df.iterrows():
            message = row['message']

            # ? Convert string to array
            def string_to_array(x): return list(map(int, x.split(',')))
            message = string_to_array(message)

            message_decrypted.append(
                self.rsa.decrypt_with_private_key(message, private_key_tuple))

        df['message'] = message_decrypted

        messages_lines = []

        # Lê linhas do arquivo
        with open('pyclient/messages.txt', 'r') as f:
            messages_lines = f.readlines()

        # ? Add new messages from file to dataframe
        for message in messages_lines:
            if message != "":
                message = message.split("-")
                message_date = message[1]
                message_date = message_date.replace("\n", "")
                # format date to (yyyy-mm-ddThh:mm:ss.sssZ)
                yyyy = message_date[7:11]
                mm = message_date[4:6]
                dd = message_date[1:3]
                hh = message_date[12:14]
                min = message_date[15:17]
                ss = message_date[18:20]
                message_date = yyyy + "-" + mm + "-" + dd + \
                    "T" + hh + ":" + min + ":" + ss + ".000Z"
                message = message[0].split(": ")
                message_sender = message[0]
                message = message[1]

                if message_sender == self.logged_user_id:
                    df = df.append({'senderId': message_sender, 'message': message,
                                    'createdAt': message_date, 'reciverId': self.logged_user_id}, ignore_index=True)

        # ? Sort by date and remove duplicates

        new_df = pd.DataFrame(columns=['senderId', 'message', 'createdAt'])

        for index, row in df.iterrows():
            if row['createdAt'] not in new_df['createdAt'].values:
                new_df = new_df.append(row)

        new_df = new_df.sort_values(by=['createdAt'], ascending=False)
        new_df = new_df.reset_index(drop=True)

        df = new_df
        messages_string = ""
        for index, row in df.iterrows():
            if index < 10:
                if row['senderId'] == self.logged_user_id:
                    messages_string += "##### You: " + row['message'] + " - " + \
                        row['createdAt'] + " \n ------ \n"
                else:
                    username = self.getUserName(row['senderId'])

                    messages_string += "&&&&&"+username + ": " + \
                        row['message'] + " - " + row['createdAt'] + \
                        " \n ------ \n"

        self.messages_received.configure(text=messages_string)

    def getUserName(self, userId):
        url = "http://localhost:8080/api/v1/user/" + userId
        response = requests.get(url)
        data = response.json()
        return data['name']

    def send_message(self):
        # ? Load keys from users
        all_users = self.get_all_users()

        # ? Remove logged user from list
        all_users = all_users[all_users['_id'] != self.logged_user_id]

        # ? Get users public keys
        public_keys = all_users['rsaPublicKey'].values

        # ? Convert string to tuple
        def string_to_tuple(x): return tuple(map(int, x.split(',')))
        public_keys = list(map(string_to_tuple, public_keys))

        # ? Get users ids
        users_ids = all_users['_id'].values

        # ? Get message
        message = self.message_entry.get()

        # ? Encrypt the message for each user
        encrypted_messages = []
        for public_key in public_keys:
            encrypted_messages.append(self.rsa.encrypt_with_public_key(
                message=message, public_key=public_key))

        # ? Send message to server
        for i in range(len(encrypted_messages)):
            self.send_message_request(encrypted_messages[i], users_ids[i])

        # ? Save message copy to logged user

        current_date_time = datetime.now()
        four_hours = timedelta(hours=4)
        current_date_time = current_date_time + four_hours
        current_date_time = current_date_time.strftime('%d/%m/%Y %H:%M:%S')
        with open('pyclient/messages.txt', 'a') as f:
            f.write(self.logged_user_id + ": " + message +
                    " - " + current_date_time + "\n")

    def send_message_request(self, message, reciver):
        try:
            print("Sending request to server")
            senderId = self.logged_user_id
            reciverId = reciver

            # array to string
            message = ','.join(map(str, message))

            data = {
                "message": message,
                "senderId": senderId,
                "reciverId": reciverId
            }

            response = requests.post(
                'http://localhost:8080/api/v1/message', json=data)

            self.message_entry.delete(0, 'end')

        except requests.exceptions.ConnectionError:
            self.label_warning.configure(text="Error connecting to server")


root = ctk.CTk()
root.geometry("1280x720")
my_gui = Application(root)
root.mainloop()
