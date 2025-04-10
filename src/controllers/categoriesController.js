import Category from "../models/categoryModel.js";
import { publishCategoryUpdate } from "../services/rabbitServiceEvent.js";

// 🔹 Obtener todas las categorías
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error("❌ Error al obtener categorías:", error);
        res.status(500).json({ message: "Error al obtener categorías" });
    }
};

// 🔹 Crear una categoría
export const createCategory = async (req, res) => {
    try {
        const { nombre } = req.body;
        const category = await Category.create({ nombre });

        // Enviar actualización a RabbitMQ
        await publishCategoryUpdate({ action: "create", nombre });

        res.status(201).json(category);
    } catch (error) {
        console.error("❌ Error al crear categoría:", error);
        res.status(500).json({ message: "Error al crear categoría" });
    }
};

// 🔹 Eliminar una categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await category.destroy();

        // Enviar actualización a RabbitMQ
        await publishCategoryUpdate({ action: "delete", nombre: category.nombre });

        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);
        res.status(500).json({ message: "Error al eliminar categoría" });
    }
};

// 🔹 Actualizar una categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const oldNombre = category.nombre;

        await category.update({
            nombre: nombre || category.nombre,
            descripcion: descripcion || category.descripcion
        });

        // Enviar actualización a RabbitMQ
        await publishCategoryUpdate({
            action: "update",
            oldNombre,
            nombre: nombre || category.nombre,
        });

        return res.status(200).json({
            message: "Categoría actualizada correctamente",
            data: category,
        });
    } catch (error) {
        console.error("❌ Error al actualizar categoría:", error);
        return res.status(500).json({ message: "Error al actualizar categoría" });
    }
};

