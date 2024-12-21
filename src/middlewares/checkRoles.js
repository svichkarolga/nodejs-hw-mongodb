import createHttpError from 'http-errors';
import { ContactCollection } from '../db/models/Contact.js';
import { ROLES } from '../constants/index.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    try {
      const { user } = req; // Витягуємо дані про користувача з req.user

      // Якщо користувача немає (неавторизований запит)
      if (!user) {
        return next(createHttpError(401, 'Unauthorized: Please log in.'));
      }

      const { role } = user; // Витягуємо роль користувача

      // Якщо роль користувача відповідає одній із дозволених ролей
      if (roles.includes(role)) {
        return next(); // Дозволяємо доступ
      }

      // Додаткова перевірка для ролі USER
      if (role === ROLES.USER) {
        const { contactId } = req.params;

        // Якщо запитується доступ до конкретного контакту
        if (contactId) {
          const contact = await ContactCollection.findOne({
            _id: contactId,
            userId: user._id, // Перевіряємо, чи контакт належить користувачу
          });

          if (!contact) {
            return next(
              createHttpError(
                403,
                'Forbidden: Contact not found or access denied.',
              ),
            );
          }

          return next(); // Контакт знайдений, доступ дозволено
        }

        // Якщо користувач хоче отримати список контактів
        if (req.method === 'GET') {
          req.query.userId = user._id; // Додаємо userId до запиту
          return next();
        }

        // Забороняємо доступ до інших ресурсів
        return next(createHttpError(403, 'Forbidden: Access denied.'));
      }

      // Якщо роль не відповідає дозволеним ролям
      return next(createHttpError(403, 'Forbidden: Access denied.'));
    } catch (error) {
      next(error); // Обробка помилок
    }
  };
