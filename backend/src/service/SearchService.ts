import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { SearchSuggestion } from "../types/Search";

export class SearchService {
  constructor(
    private readonly pinRepository: PinRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async getSuggestions(
    query: string,
    limit: number,
  ): Promise<SearchSuggestion[]> {
    const perTypeLimit = Math.ceil(limit / 2);
    const [pins, users] = await Promise.all([
      this.pinRepository.findSuggestions(query, perTypeLimit),
      this.userRepository.findSuggestions(query, perTypeLimit),
    ]);

    const suggestions: SearchSuggestion[] = [];
    const collectionLength = Math.max(pins.length, users.length);

    for (let index = 0; index < collectionLength; index += 1) {
      const pin = pins[index];
      if (pin) {
        suggestions.push({
          type: "pin",
          id: pin.getId(),
          label: pin.getTitle(),
          subtitle: `Pin de ${pin.getUser().getName()}`,
          imageUrl: pin.getPathImage(),
        });
      }

      const user = users[index];
      if (user) {
        suggestions.push({
          type: "user",
          id: user.getId(),
          label: user.getName(),
          subtitle: "Criador",
          imageUrl: user.getPathImageUser(),
        });
      }
    }

    return suggestions.slice(0, limit);
  }
}
