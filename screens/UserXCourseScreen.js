import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const UserXCourseScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);

    const courseId = props.route.params.courseId; // Obtén el id del curso de las props

    useEffect(() => {
        // Consulta la tabla 'CourseXUser' para obtener los estudiantes matriculados en el curso
        firebase.db
            .collection("courseXUser")
            .where("idCourse", "==", courseId)
            .onSnapshot((querySnapshot) => {
                const userIds = [];
                querySnapshot.docs.forEach((doc) => {
                    const { idUser } = doc.data();
                    userIds.push(idUser);
                });
                setEstudiantesMatriculados(userIds);
            });
    }, []);

    useEffect(() => {
        if (estudiantesMatriculados.length === 0) {
            // No hay estudiantes matriculados, no hay necesidad de hacer más consultas
            setUsers([]);
            return;
        }

        firebase.db
            .collection("users")
            .where(firebase.firebase.firestore.FieldPath.documentId(), "in", estudiantesMatriculados)
            .get()
            .then((querySnapshot) => {
                const estudiantesData = [];
                querySnapshot.docs.forEach((doc) => {
                    const { name, email, carne } = doc.data();
                    estudiantesData.push({
                        id: doc.id,
                        name,
                        email,
                        carne,
                    });
                });
                setUsers(estudiantesData);
            });
    }, [estudiantesMatriculados]);

    const handleEliminar = (userId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de eliminar este estudiante del curso?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => eliminarEstudiante(userId),
                },
            ]
        );
    };

    const eliminarEstudiante = (userId) => {
        // Elimina al estudiante de la tabla 'CourseXUser'
        firebase.db
            .collection("courseXUser")
            .where("idCourse", "==", courseId)
            .where("idUser", "==", userId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            });
    };

    return (
        <ScrollView>
            <Button
                onPress={() => {
                    props.navigation.navigate("AgregarUserScreen", {
                        courseId: courseId,
                    });
                }}
                title="Agregar estudiante"
            />
            {users.map((user) => (
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
                        style={styles.eliminarContainer}
                        onPress={() => handleEliminar(user.id)}
                    >
                        <Text style={styles.eliminarText}>Eliminar</Text>
                    </TouchableOpacity>
                </ListItem>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    eliminarContainer: {
        backgroundColor: "red",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    eliminarText: {
        color: "white",
    },
});

export default UserXCourseScreen;
