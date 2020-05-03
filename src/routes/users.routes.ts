import { Router } from 'express';
import multer from 'multer';

import { CreateUserService } from '../services/CreateUserService';
import { UpdateUserAvatartService } from '../services/UpdateUserAvatarService';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();
  const user = await createUser.execute({ name, email, password });

  delete user.password;
  return response.json(user);
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const uploadUserAvatar = new UpdateUserAvatartService();
    const user = await uploadUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRoutes;
