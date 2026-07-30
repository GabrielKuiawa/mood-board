import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import {
  getAuthenticatedUser,
  getAuthenticatedUserId,
} from "../utils/authorization";
import {
  validateEmail,
  validateId,
  validatePagination,
  validateTextField,
} from "../utils/validation";
import { UserService } from "../service/UserService";
import { serializePaginationMeta } from "../utils/pagination";
import { validateUploadedImage } from "../utils/imageUpload";
import BadRequestException from "../exception/BadRequestException";

export class UserController {
  constructor(private readonly userService: UserService) {}

  public async saveUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const name = validateTextField(req.body.name, "Nome", 100);
      const email = validateEmail(req.body.email);
      const password = validateTextField(req.body.password, "Senha", 72, 8);

      const user = await this.userService.createUserWithUpload(
        name,
        email,
        password,
        validateUploadedImage(req.file),
      );

      res.status(201).json({
        message: "Usuário criado com sucesso",
        data: this.serializeUser(user),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.userService.getUsers(
        validatePagination(req.query.page, req.query.limit),
      );
      res.json({
        data: result.data.map((user) => this.serializeUser(user)),
        meta: serializePaginationMeta(req, result.meta),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const user = await this.userService.getUserById(
        id,
        getAuthenticatedUser(req),
      );

      res.json(this.serializeUser(user));
    } catch (error) {
      next(error);
    }
  }

  public async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      const user = await this.userService.getUserById(
        getAuthenticatedUserId(req),
        authenticatedUser,
      );

      res.json({
        ...this.serializeUser(user),
        readOnly: authenticatedUser.readOnly === true,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserWithPins(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const result = await this.userService.getUserWithPins(
        id,
        getAuthenticatedUser(req),
        validatePagination(req.query.page, req.query.limit),
      );

      res.json({
        ...this.serializeUser(result.user),
        pins: {
          data: result.pins.data.map((pin) => ({
            id: pin.getId(),
            title: pin.getTitle(),
            pathImage: pin.getPathImage(),
            description: pin.getDescription(),
          })),
          meta: serializePaginationMeta(req, result.pins.meta),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = validateId(req.params.id);

      const name =
        req.body.name === undefined
          ? undefined
          : validateTextField(req.body.name, "Nome", 100);
      const email =
        req.body.email === undefined
          ? undefined
          : validateEmail(req.body.email);
      const password =
        req.body.password === undefined
          ? undefined
          : validateTextField(req.body.password, "Senha", 72, 8);
      const image = req.file ? validateUploadedImage(req.file) : undefined;

      if (
        name === undefined &&
        email === undefined &&
        password === undefined &&
        image === undefined
      ) {
        throw new BadRequestException(
          "Envie pelo menos um campo para atualizar.",
        );
      }

      const updatedUser = await this.userService.updateUserWithUpload(
        id,
        name,
        email,
        password,
        getAuthenticatedUser(req),
        image,
      );
      res.json({
        message: "Usuário atualizado com sucesso",
        data: this.serializeUser(updatedUser),
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = validateId(req.params.id);
      await this.userService.deleteUser(id, getAuthenticatedUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const email = validateEmail(req.body.email);
      const password = validateTextField(req.body.password, "Senha", 72, 1);
      const token = await this.userService.login(email, password);

      res.json({ message: "Login bem-sucedido", token });
    } catch (error) {
      next(error);
    }
  }

  private serializeUser(user: User) {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      pathImageUser: user.getPathImageUser(),
      role: user.getAdmin(),
    };
  }
}
