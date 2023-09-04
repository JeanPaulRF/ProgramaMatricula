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

const CourseDetailScreen = (props) => {
    const initialState = {
        id: "",
        name: "",
        number: "",
        credits: "",
        profesor: "",
    };

    const [course, setCourse] = useState(initialState);
    const [loading, setLoading] = useState(true);

    const handleTextChange = (value, prop) => {
        setCourse({ ...course, [prop]: value });
    };

    const getCourseById = async (id) => {
        const dbRef = firebase.db.collection("courses").doc(id);
        const doc = await dbRef.get();
        const course = doc.data();
        setCourse({ ...course, id: doc.id });
        setLoading(false);
    };

    const deleteCourse = async () => {
        setLoading(true)
        const dbRef = firebase.db
            .collection("courses")
            .doc(props.route.params.courseId);
        await dbRef.delete();
        setLoading(false)
        props.navigation.navigate("CoursesList");
    };

    const openConfirmationAlert = () => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de eliminar este curso?",
            [
                { text: "Eliminar", onPress: () => deleteCourse() },
                { text: "Cancelar", onPress: () => console.log("canceled") },
            ],
            {
                cancelable: true,
            }
        );
    };

    const updateCourse = async () => {
        const courseRef = firebase.db.collection("courses").doc(course.id);
        await courseRef.set({
            name: course.name,
            number: course.number,
            credits: course.credits,
            profesor: course.profesor,
        });
        setCourse(initialState);
        props.navigation.navigate("CoursesList");
    };

    const seeEstudiantes = () => {
        props.navigation.navigate("UserXCourseScreen", {
            courseId: course.id, // Pasa el id del curso a UserXCourseScreen.js
        });
    };

    useEffect(() => {
        getCourseById(props.route.params.courseId);
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#9E9E9E" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <TextInput
                    placeholder="Nombre"
                    autoCompleteType="nombre"
                    style={styles.inputGroup}
                    value={course.name}
                    onChangeText={(value) => handleTextChange(value, "name")}
                />
            </View>
            <View>
                <TextInput
                    autoCompleteType="number"
                    placeholder="Numero"
                    style={styles.inputGroup}
                    value={course.number}
                    onChangeText={(value) => handleTextChange(value, "number")}
                />
            </View>
            <View>
                <TextInput
                    placeholder="Creditos"
                    autoCompleteType="credits"
                    style={styles.inputGroup}
                    value={course.credits}
                    onChangeText={(value) => handleTextChange(value, "credits")}
                />
            </View>
            <View>
                <TextInput
                    placeholder="Profesor"
                    autoCompleteType="profesor"
                    style={styles.inputGroup}
                    value={course.profesor}
                    onChangeText={(value) => handleTextChange(value, "profesor")}
                />
            </View>
            <View style={styles.btn}>
                <Button title="Actualizar" onPress={() => updateCourse()} color="#19AC52" />
            </View>
            <View style={styles.btn}>
                <Button title="Ver estudiantes" onPress={() => seeEstudiantes()} color="#621FF7" />
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

export default CourseDetailScreen;
