// import createHttpError from 'http-errors';
// import { ContactCollection } from '../db/models/Contact.js';
// import { ROLES } from '../constants/index.js';

// export const checkRoles =
//   (...roles) =>
//   async (req, res, next) => {
//     const { user } = req;

//     if (!user) {
//       next(createHttpError(401, 'Unauthorized'));
//       return;
//     }

//     const { role } = user;

//     // Якщо роль користувача — USER
//     if (roles.includes(ROLES.USER) && role === ROLES.USER) {
//       const { contactId } = req.params;

//       // Якщо contactId не переданий
//       if (!contactId) {
//         next(createHttpError(403, 'Forbidden: Access denied'));
//         return;
//       }

//       // Перевірка, чи належить контакт користувачу
//       const contact = await ContactCollection.findOne({
//         _id: contactId,
//         userId: user._id,
//       });

//       if (contact) {
//         next();
//         return;
//       }

//       next(
//         createHttpError(403, 'Forbidden: Contact not found or access denied'),
//       );
//       return;
//     }

//     // Якщо роль користувача — дозволена (але не USER)
//     if (roles.includes(role)) {
//       next();
//       return;
//     }

//     // Якщо роль не дозволена
//     next(createHttpError(403, 'Forbidden: Access denied'));
//   };

import createHttpError from 'http-errors';
import { ContactCollection } from '../db/models/Contact.js';
import { ROLES } from '../constants/index.js';

/**
 * Middleware для перевірки ролей та прав доступу.
 * @param {...string} roles - дозволені ролі.
 * @returns {function} - middleware для перевірки доступу.
 */
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
