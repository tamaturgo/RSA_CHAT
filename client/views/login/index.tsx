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

export default function Login({ navigation }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  async function login() {
    try {
      const response = await axios.get("http://10.0.2.2:8080/api/v1/user");

      // Percorre o array de usuários
      let userExists = false;
      response.data.forEach((useRes: any) => {
        // Verifica se o usuário existe
        if (useRes.email === user.email && useRes.password === user.password) {
          // Se existir, redireciona para a página de produtos
          navigation.navigate("Home");
          userExists = true;
        }
      });
      // Se não existir, exibe um alerta
      if (!userExists) {
        alert("E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>RSChat</Text>
        <Text >The Real Security chat</Text>
      </View>

      <View style={styles.inputDiv}>
        <Text>E-mail</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />
      </View>

      <View style={styles.inputDiv}>
        <Text>Password</Text>
        <TextInput
          style={styles.inputText}
          passwordRules="required: lower; required: upper; required: digit; required: [-]; minlength: 4;"
          textContentType="password"
          secureTextEntry={true}
          onChangeText={(text) => setUser({ ...user, password: text })}
        />
      </View>
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={() => {
          login();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnCadastro}
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Create Account
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 200,
    margin: 10,
  },
  inputDiv: {
    justifyContent: "center",
  },
  btnLogin: {
    backgroundColor: "blue",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  btnCadastro: {
    backgroundColor: "#3333aa",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "600",
  },
});
