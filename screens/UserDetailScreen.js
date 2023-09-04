import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const UserDetailScreen = (props) => {
  const initialState = {
    id: "",
    name: "",
    email: "",
    carne: "",
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };

  const getUserById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({ ...user, id: doc.id });
    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true)
    const dbRef = firebase.db
      .collection("users")
      .doc(props.route.params.userId);
    await dbRef.delete();
    setLoading(false)
    props.navigation.navigate("UsersList");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar este estudiante del curso?",
      [
        { text: "Eliminar", onPress: () => deleteUser() },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const updateUser = async () => {
    const userRef = firebase.db.collection("users").doc(user.id);
    await userRef.set({
      name: user.name,
      email: user.email,
      carne: user.carne,
    });
    setUser(initialState);
    props.navigation.navigate("UsersList");
  };

  useEffect(() => {
    getUserById(props.route.params.userId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  const seeCursos = () => {
    props.navigation.navigate("CourseXUserScreen", {
      userId: user.id, // Pasa el id del usuario a CourseXUserScreen.js
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="nombre"
          style={styles.inputGroup}
          value={user.name}
          onChangeText={(value) => handleTextChange(value, "name")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="email"
          placeholder="Email"
          style={styles.inputGroup}
          value={user.email}
          onChangeText={(value) => handleTextChange(value, "email")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Carne"
          autoCompleteType="carne"
          style={styles.inputGroup}
          value={user.carne}
          onChangeText={(value) => handleTextChange(value, "carne")}
        />
      </View>
      <View style={styles.btn}>
        <Button title="Actualizar" onPress={() => updateUser()} color="#19AC52" />
      </View>
      <View style={styles.btn}>
        <Button
          title="Ver cursos"
          onPress={() => seeCursos()}
          color="#621FF7"
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Eliminar"
          onPress={() => openConfirmationAlert()}
          color="#E37399"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
});

export default UserDetailScreen;
