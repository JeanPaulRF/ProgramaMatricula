import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const UserXCourseScreen = (props) => {
    const [courses, setCourses] = useState([]);
    const [cursosMatriculados, setCursosMatriculados] = useState([]);

    const userId = props.route.params.userId; // Obtén el id del curso de las props

    useEffect(() => {
        // Consulta la tabla 'courseXUser' para obtener los cursos matriculados en el curso
        firebase.db
            .collection("courseXUser")
            .where("idUser", "==", userId)
            .onSnapshot((querySnapshot) => {
                const courseIds = [];
                querySnapshot.docs.forEach((doc) => {
                    const { idCourse } = doc.data();
                    courseIds.push(idCourse);
                });
                setCursosMatriculados(courseIds);
            });
    }, []);

    useEffect(() => {
        if (cursosMatriculados.length === 0) {
            // No hay cursos matriculados, no hay necesidad de hacer más consultas
            setCourses([]);
            return;
        }

        firebase.db
            .collection("courses")
            .where(firebase.firebase.firestore.FieldPath.documentId(), "in", cursosMatriculados)
            .get()
            .then((querySnapshot) => {
                const cursosData = [];
                querySnapshot.docs.forEach((doc) => {
                    const { name, number, credits, profesor } = doc.data();
                    cursosData.push({
                        id: doc.id,
                        name,
                        number,
                        credits,
                        profesor,
                    });
                });
                setCourses(cursosData);
            });
    }, [cursosMatriculados]);

    const handleEliminar = (courseId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de desmatricular este curso?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => eliminarCurso(courseId),
                },
            ]
        );
    };

    const eliminarCurso = (courseId) => {
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
                    props.navigation.navigate("AgregarCourseScreen", {
                        userId: userId,
                    });
                }}
                title="Agregar Curso"
            />
            {courses.map((course) => (
                <ListItem
                    key={course.id}
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
                        <ListItem.Title>{course.name}</ListItem.Title>
                        <ListItem.Subtitle>{course.number}</ListItem.Subtitle>
                    </ListItem.Content>
                    <TouchableOpacity
                        style={styles.eliminarContainer}
                        onPress={() => handleEliminar(course.id)}
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
