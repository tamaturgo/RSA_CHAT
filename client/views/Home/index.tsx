import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import localStorage from "react-native-sync-localstorage";

export default function Home({ route, navigation }) {
  const loged_user = route.params.user;

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    async function get_users() {
      try {
        const response = await axios.get("http://192.168.1.9:8080/api/v1/user");
        setUserList(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    get_users();
  }, []);

  const list_messages = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.9:8080/api/v1/message"
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Bem vindo, {loged_user.name}
      </Text>
      <View style={styles.userList}>
        <View>
          {userList.map((user: any) => {
            if (user._id != loged_user.id) {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Message", {
                      user: user,
                      loged_user: loged_user,
                    })
                  }
                  key={user._id}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#eaeaea",
                    padding: 20,
                  }}
                >
                  <View key={user._id} style={styles.userListItem}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 7,
                          padding: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 10,
                          }}
                        >
                          {user.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            marginBottom: 10,
                          }}
                        >
                          {user.email}
                        </Text>
                      </View>
                    </View>
                    <Button
                      title="Mensagens"
                      onPress={() =>
                        navigation.navigate("Message", {
                          user: user,
                          loged_user: loged_user,
                        })
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    justifyContent: "center",
  },
  userList: {
    flex: 1,
    alignItems: "center",
  },

  userListItem: {
    margin: 3,
    alignItems: "center",
    flexDirection: "row",
  },
});
