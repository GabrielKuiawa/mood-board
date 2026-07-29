import Pin from "../../../src/models/Pin";
import { User } from "../../../src/models/User";
import PinRepository from "../../../src/repository/PinRepository";
import UserRepository from "../../../src/repository/UserRepository";
import { SearchService } from "../../../src/service/SearchService";

const PIN_ID = "123e4567-e89b-42d3-a456-426614174000";
const USER_ID = "323e4567-e89b-42d3-a456-426614174000";

function setEntityId(entity: object, id: string): void {
  Object.defineProperty(entity, "id", { value: id });
}

describe("SearchService", () => {
  it("interleaves pin and user suggestions without exposing folders", async () => {
    const user = new User();
    setEntityId(user, USER_ID);
    user.setName("Ana");
    user.setPathImageUser("/users/ana.png");

    const pin = new Pin();
    setEntityId(pin, PIN_ID);
    pin.setTitle("Jardim moderno");
    pin.setPathImage("/images/garden.png");
    pin.user = user;

    const pinRepository = {
      findSuggestions: jest.fn().mockResolvedValue([pin]),
    };
    const userRepository = {
      findSuggestions: jest.fn().mockResolvedValue([user]),
    };

    const service = new SearchService(
      pinRepository as unknown as PinRepository,
      userRepository as unknown as UserRepository,
    );

    const result = await service.getSuggestions("jar", 9);

    expect(result).toEqual([
      {
        type: "pin",
        id: PIN_ID,
        label: "Jardim moderno",
        subtitle: "Pin de Ana",
        imageUrl: "/images/garden.png",
      },
      {
        type: "user",
        id: USER_ID,
        label: "Ana",
        subtitle: "Criador",
        imageUrl: "/users/ana.png",
      },
    ]);
    expect(pinRepository.findSuggestions).toHaveBeenCalledWith("jar", 5);
  });

  it("respects the total suggestion limit", async () => {
    const pins = Array.from({ length: 4 }, (_, index) => {
      const user = new User();
      setEntityId(user, `${index}23e4567-e89b-42d3-a456-426614174000`);
      user.setName(`User ${index}`);

      const pin = new Pin();
      setEntityId(pin, `${index}23e4567-e89b-42d3-a456-426614174001`);
      pin.setTitle(`Pin ${index}`);
      pin.setPathImage(`/images/${index}.png`);
      pin.user = user;
      return pin;
    });

    const service = new SearchService(
      {
        findSuggestions: jest.fn().mockResolvedValue(pins),
      } as unknown as PinRepository,
      {
        findSuggestions: jest.fn().mockResolvedValue([]),
      } as unknown as UserRepository,
    );

    await expect(service.getSuggestions("", 2)).resolves.toHaveLength(2);
  });
});
