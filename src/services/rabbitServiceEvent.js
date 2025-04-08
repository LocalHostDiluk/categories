import amqp from "amqplib";
import dotenv from "dotenv";
import { getAllCategories } from "../services/categoriaService.js";// <-- Esta función debe obtener las categorías desde tu BD

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "categorias_actualizadas";

let channel = null;

// 🔹 Conectar a RabbitMQ
const connectRabbitMQ = async () => {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        channel = await conn.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ [Categorías] Conectado a RabbitMQ");

        // 🔸 Enviar todas las categorías existentes al iniciar
        await sendAllCategoriesOnStartup();
    } catch (error) {
        console.error("❌ [Categorías] Error al conectar a RabbitMQ:", error);
    }
};

// 🔹 Publicar una sola categoría
export const publishCategoryUpdate = async (categoria) => {
    if (!channel) {
        await connectRabbitMQ();
    }
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(categoria)));
    console.log("📢 [Categorías] Mensaje enviado:", categoria);
};

// 🔹 Enviar todas las categorías al arrancar
const sendAllCategoriesOnStartup = async () => {
    try {
        const categorias = await getAllCategories(); // <-- Aquí conectas con la BD
        for (const categoria of categorias) {
            await publishCategoryUpdate(categoria);
        }
        console.log(`📦 [Categorías] ${categorias.length} categorías enviadas al arrancar`);
    } catch (error) {
        console.error("❌ [Categorías] Error al enviar categorías al arrancar:", error);
    }
};

// 🔸 Ejecutar conexión
connectRabbitMQ();
