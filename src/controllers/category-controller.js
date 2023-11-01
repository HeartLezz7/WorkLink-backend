// const prisma = require("../models/prisma");

// exports.createworkCategories = async (req, res, next) => {
//     try {
//         const value = req.body;
//         console.log(value);
//         const workCategories = await prisma.workCategories.create({
//             data: {
//                 category: value.category
//             }
//         })
//         res.status(201).json({ workCategories })
//     } catch (error) {
//         next(error)
//     }
// }

// exports.getAllCategories = async (req, res, next) => {
//     try {
//         const { value } = req.params;
//         const allCategories = await prisma.workCategories.findMany({
//             where: {
//                 data: value
//             }
//         })
//         console.log(value);
//         res.status(201).json({ allCategories });

//     } catch (error) {
//         next(error)
//     }
// }