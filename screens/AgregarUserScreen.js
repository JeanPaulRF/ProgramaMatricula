import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "../database/firebase";

const AgregarUserScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const courseId = props.route.params.courseId; // Obtén el id del curso de las props

    useEffect(() => {
        // Consulta la tabla 'users' para obtener la lista de estudiantes
        firebase.db.collection("users").onSnapshot((querySnapshot) => {
            const usersData = [];
            querySnapshot.docs.forEach((doc) => {
                const { name, email, carne } = doc.data();
                usersData.push({
                    id: doc.id,
                    name,
                    email,
                    carne,
                });
            });
            setUsers(usersData);
        });

        // Consulta la tabla 'courseXUser' para obtener los estudiantes ya matriculados en el curso
        firebase.db
            .collection("courseXUser")
            .where("idCourse", "==", courseId)
            .onSnapshot((querySnapshot) => {
                const userIds = [];
                querySnapshot.docs.forEach((doc) => {
                    const { idUser } = doc.data();
                    userIds.push(idUser);
                });
                setEstudiantes(userIds);
            });
    }, []);

    const agregarEstudiante = (userId) => {
        // Agrega el usuario al arreglo de estudiantes del curso en la tabla 'courseXUser'
        firebase.db.collection("courseXUser").add({
            idCourse: courseId,
            idUser: userId,
        })
            .then(() => {
                // Después de agregar el estudiante, actualiza el estado 'estudiantes' con la nueva lista de estudiantes matriculados
                setEstudiantes([...estudiantes, userId]);
            })
            .catch((error) => {
                console.error("Error al agregar estudiante:", error);
            });
    };

    return (
        <ScrollView>
            {users.map((user) => {
                if (!estudiantes.includes(user.id)) {
                    return (
                        <ListItem
                            key={user.id}
                            bottomDivider
                        >
                            <ListItem.Chevron />
                            <Avatar
                                source={{
                                    uri:
                                        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                                }}
                                rounded
                            />
                            <ListItem.Content>
                                <ListItem.Title>{user.name}</ListItem.Title>
                                <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
                            </ListItem.Content>
                            <TouchableOpacity
                                style={styles.agregarContainer}
                                onPress={() => agregarEstudiante(user.id)}
                            >
                                <Text style={styles.agregarText}>Agregar</Text>
                            </TouchableOpacity>
                        </ListItem>
                    );
                } else {
                    return null;
                }
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    estudianteContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    estudianteText: {
        fontSize: 16,
    },
    agregarButton: {
        backgroundColor: "blue",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    agregarButtonText: {
        color: "white",
        fontSize: 18,
    },
    agregarContainer: {
        backgroundColor: "blue",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    agregarText: {
        color: "white",
    },
});

export default AgregarUserScreen;
