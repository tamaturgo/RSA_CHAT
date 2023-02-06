import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import localStorage from "react-native-sync-localstorage";
const RSAKey = require("react-native-rsa");

export default function Message({ route, navigation }) {
  const user = route.params.user;
  const logged_user = route.params.loged_user;

  const [chatObj, setChatObj] = useState({});
  const [message, setMessage] = useState([]);

  const chat = async (reciverId: any, senderId: any) => {
    const response = await axios.get(
      `http://192.168.1.9:8080/api/v1/chat/reciver/${reciverId}/sender/${senderId}`
    );
    return response.data;
  };

  const loadMessages = async (chatId: any) => {
    const response = await axios.get(
      `http://192.168.1.9:8080/api/v1/message/chat/${chatId}`
    );
    return response.data;
  };

  useEffect(() => {
    chat(user._id, logged_user.id).then((res) => {
      if (res.length === 0) {
        createChat(user._id, logged_user.id).then((res) => {
          setChatObj(res);
        });
      } else {
        setChatObj(res[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (chatObj._id) {
      loadMessages(chatObj._id).then((res) => {
        setMessage(res);
      });
    }
  }, [chatObj]);

  const createChat = async (reciverId: any, senderId: any) => {
    const response = await axios.post(`http://192.168.1.9:8080/api/v1/chat`, {
      reciverId,
      senderId,
    });
    return response.data;
  };

  const [reciverPublicKey, setReciverPublicKey] = useState("");
  const [senderPublicKey, setSenderPublicKey] = useState("");

  useEffect(() => {
    setReciverPublicKey(user.rsaPublicKey);
  }, [user]);

  useEffect(() => {
    setSenderPublicKey(logged_user.rsaPublicKey);
  }, [logged_user]);

  const [messageText, setMessageText] = useState("");

  const encryptMessage = async (message: any) => {
    const rsa = new RSAKey();
    rsa.setPublicString(reciverPublicKey);

    const encryptedMessage = rsa.encrypt(message);
    return encryptedMessage;
  };

  const sendMessage = async (message: any, chatId: any) => {
    // Encrypt message
    const encryptedMessage = await encryptMessage(message);

    // Send message
    const response = await axios.post(
      `http://192.168.1.9:8080/api/v1/message`,
      {
        message: encryptedMessage,
        chatId: chatId,
        senderId: logged_user.id,
        reciverId: user._id,
      }
    );

    const id_message = response.data;

    // Save message in local storage
    localStorage.setItem("msg" + id_message, message);

    // Update message list
    loadMessages(chatObj._id).then((res) => {
      setMessage(res);
    });
  };

  function getLocalMessage(id_message: string) {
    const message = localStorage.getItem("msg" + id_message);
    return message;
  }

  function dcrypt(message: string): string {
    const rsa = new RSAKey();
    const privatekey = localStorage.getItem("privateKey" + logged_user.email);
    rsa.setPrivateString(privatekey);
    const decryptedMessage = rsa.decrypt(message);
    return decryptedMessage;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Home", {
              user: route.params.loged_user,
            })
          }
          style={{
            position: "relative",
            paddingLeft: 30,
            top: 0,
          }}
          dsa
          algorithm
        >
          <Text
            style={{
              fontSize: 14,
              textDecorationLine: "underline",
              color: "white",
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>
          Conversando com {route.params.user.name}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
          {message.map((message: any) => {
            return (
              <View key={message._id}>
                {message.senderId === logged_user.id ? (
                  <View
                    style={{
                      backgroundColor: "#e6e6e6",
                      borderRadius: 10,
                      margin: 10,
                      padding: 10,
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text>{getLocalMessage(message._id)}</Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#a6e6e6",
                      borderRadius: 10,
                      margin: 10,
                      padding: 10,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text>{dcrypt(message.message)}</Text>
                  </View>
                )}
              </View>
            );
          })}

          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              margin: 10,
              borderRadius: 10,
              padding: 10,
            }}
            onChangeText={(text) => setMessageText(text)}
            value={messageText}
          />

          <Button
            title="Enviar"
            onPress={() => {
              sendMessage(messageText, chatObj._id);
            }}
          />

          <Button
            title="reload"
            onPress={() => {
              loadMessages(chatObj._id).then((res) => {
                setMessage(res);
              });
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1E90FF",
    alignItems: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#ddd",
    paddingTop: 40,
    flexDirection: "row",
    paddingBottom: 10,
  },
  headerText: {
    color: "white",
    fontSize: 14,
    padding: 26,
  },
});
