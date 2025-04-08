import Categoria from "../models/categoryModel.js";

export const getAllCategories = async () => {
  try {
    const categorias = await Categoria.findAll();
    return categorias.map(c => c.toJSON()); // para convertir los objetos Sequelize a JSON plano
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};