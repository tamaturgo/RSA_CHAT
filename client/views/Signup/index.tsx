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
const RSAKey = require("react-native-rsa");
import localStorage from "react-native-sync-localstorage";

export default function Signup({ navigation }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    name: "",
    password2: "",
  });

  const createUser = async () => {
    //  Verifica se as senhas são iguais
    if (user.password === user.password2) {
      const userDTO = {
        name: user.name,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        rsaPublicKey: "",
      };

      try {
        // Gera a chave pública e privada
        // console.log("Gerando as chaves...");

        const bits = 1024;
        const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
        var RSA = new RSAKey();
        let r = RSA.generate(bits, exponent);
        const publicKey = RSA.getPublicString(); // return json encoded string
        const privateKey = RSA.getPrivateString(); // return json encoded string
        userDTO.rsaPublicKey = publicKey;
        console.log("Chaves geradas com sucesso!");

        // Salva a chave privada no armazenamento local
        console.log("Salvando a chave privada no armazenamento local...");
        localStorage.setItem("privateKey" + userDTO.email, privateKey);

        console.log("Chave privada salva com sucesso!");

        console.log("Enviando dados para o servidor...");
        const response = await axios.post(
          "http://192.168.1.9:8080/api/v1/user",
          userDTO
        );
        console.log("Dados enviados com sucesso!\n");
        console.log("Resposta do servidor: ", response.data);
        alert("Usuário criado com sucesso!");
        navigation.navigate("Login");
      } catch (err) {
        console.log("Erro ao gerar as chaves: ", err);
      }
    } else {
      alert("As senhas não são iguais.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>RSChat</Text>
        <Text>The Real Security chat</Text>
      </View>

      <View style={styles.inputDiv}>
        <Text>Name</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setUser({ ...user, name: text })}
        />
      </View>

      <View style={styles.inputDiv}>
        <Text>E-mail</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setUser({ ...user, email: text })}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputDiv}>
        <Text>Phone Number</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
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

      <View style={styles.inputDiv}>
        <Text>Confirm password</Text>
        <TextInput
          style={styles.inputText}
          passwordRules="required: lower; required: upper; required: digit; required: [-]; minlength: 4;"
          textContentType="password"
          secureTextEntry={true}
          onChangeText={(text) => setUser({ ...user, password2: text })}
        />
      </View>

      <TouchableOpacity
        style={styles.btnCadastro}
        onPress={() => {
          createUser();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text
          style={{
            color: "black",
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            marginTop: 10,
          }}
        >
          Already have an account
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
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "600",
  },
});
