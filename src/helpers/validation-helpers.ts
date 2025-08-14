// import { ZodSchema, ZodError } from 'zod';
//
// export interface ValidationError extends Error {
// 	type: "client-validation";
// 	error: "validation-error";
// 	fields: { field: string; message: string }[];
// }
//
// export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
// 	try {
//
// 		return schema.parse(data);
// 	} catch (error) {
// 		if (error instanceof ZodError) {
//
// 			const formattedErrors = error.errors.map(issue => ({
// 				field: issue.path.join('.'),
// 				message: issue.message
// 			}));
//
// 			const validationError = new Error("Ошибка валидации клиента") as ValidationError;
// 			validationError.type = "client-validation";
// 			validationError.error = "validation-error";
// 			validationError.fields = formattedErrors;
//
// 			throw validationError;
// 		}
//
// 		throw error;
// 	}
// }
